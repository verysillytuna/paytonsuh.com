"""
scanning.py — variability and anomaly survey of the open cluster NGC 2516.

NGC 2516 (RA 119.52°, Dec −60.75°, ~408 pc) has several hundred bright members
and lies near TESS's southern continuous viewing zone, so it has been observed
in many sectors. This pipeline turns the cluster into a light-curve dataset and
ranks its stars by how unusual their variability is.

  Phase 1  Gaia DR3 membership: stars in a 0.75° cone whose parallax and proper
           motion match the cluster (box cuts after Cantat-Gaudin et al. 2018).
  Phase 2  Cross-match each member to the TESS Input Catalog (TIC).
  Phase 3  Download TESS light curves (2-min SPOC preferred, QLP fallback),
           normalise, stitch sectors, and clean.
  Phase 4  Extract variability features from each light curve.
  Phase 5  Score stars with an Isolation Forest; the most isolated points in
           feature space are the anomaly candidates worth a closer look.

Usage
-----
    python scanning.py                    # all available sectors
    python scanning.py --sectors 61 62    # restrict to specific sectors
"""

from __future__ import annotations

import argparse
import warnings
from pathlib import Path

import astropy.units as u
import lightkurve as lk
import numpy as np
import pandas as pd
from astropy.coordinates import SkyCoord
from astroquery.gaia import Gaia
from astroquery.mast import Catalogs
from scipy.stats import kurtosis, skew
from sklearn.ensemble import IsolationForest
from sklearn.preprocessing import RobustScaler

warnings.filterwarnings("ignore")

DATA_DIR = Path("data/ngc2516")
CLUSTER_RA, CLUSTER_DEC, RADIUS_DEG = 119.52, -60.75, 0.75


# ---------------------------------------------------------------------------
# Phase 1 — Gaia DR3 membership
# ---------------------------------------------------------------------------

GAIA_QUERY = f"""
SELECT source_id, ra, dec, parallax, parallax_error, pmra, pmdec,
       phot_g_mean_mag, phot_bp_mean_mag, phot_rp_mean_mag, bp_rp, radial_velocity
FROM gaiadr3.gaia_source
WHERE CONTAINS(POINT(ra, dec), CIRCLE({CLUSTER_RA}, {CLUSTER_DEC}, {RADIUS_DEG})) = 1
  AND parallax BETWEEN 2.1 AND 2.9          -- ~345–475 pc
  AND pmra     BETWEEN -5.5 AND -3.5        -- mas/yr
  AND pmdec    BETWEEN 11.0 AND 13.0        -- mas/yr
  AND phot_g_mean_mag < 14.0
  AND parallax_error < 0.2
"""


def query_members() -> pd.DataFrame:
    print("Phase 1  Querying Gaia DR3 for NGC 2516 members…")
    members = Gaia.launch_job(GAIA_QUERY).get_results().to_pandas()
    print(f"         {len(members)} candidate members")
    return members


# ---------------------------------------------------------------------------
# Phase 2 — TIC cross-match
# ---------------------------------------------------------------------------

def crossmatch_tic(members: pd.DataFrame, radius_arcsec: float = 5.0,
                   max_tmag: float = 13.5) -> pd.DataFrame:
    """Brightest TIC source within `radius_arcsec` of each Gaia member."""
    print("Phase 2  Cross-matching to the TESS Input Catalog…")
    tic_id, tmag = [], []
    for ra, dec in zip(members["ra"], members["dec"]):
        coord = SkyCoord(ra=ra * u.deg, dec=dec * u.deg)
        hits = Catalogs.query_region(coord, radius=radius_arcsec * u.arcsec, catalog="TIC")
        if len(hits):
            hits.sort("Tmag")
            tic_id.append(int(hits["ID"][0]))
            tmag.append(float(hits["Tmag"][0]))
        else:
            tic_id.append(np.nan)
            tmag.append(np.nan)

    out = members.assign(tic_id=tic_id, Tmag=tmag).dropna(subset=["tic_id"])
    out = out[out["Tmag"] < max_tmag].reset_index(drop=True)
    out["tic_id"] = out["tic_id"].astype(int)
    print(f"         {len(out)} stars matched with Tmag < {max_tmag}")
    return out


# ---------------------------------------------------------------------------
# Phase 3 — Light curves
# ---------------------------------------------------------------------------

def fetch_light_curve(tic_id: int, sectors: list[int] | None) -> lk.LightCurve | None:
    """Download, normalise, stitch, and clean all available sectors for one star."""
    target = f"TIC {tic_id}"
    search = lk.search_lightcurve(target, mission="TESS", author="SPOC",
                                  exptime=120, sector=sectors)
    flux_column = "pdcsap_flux"
    if len(search) == 0:                       # fall back to QLP full-frame-image photometry
        search = lk.search_lightcurve(target, mission="TESS", author="QLP", sector=sectors)
        flux_column = "sap_flux"
    if len(search) == 0:
        return None

    lcs = search.download_all(flux_column=flux_column, quality_bitmask="hardest")
    if lcs is None or len(lcs) == 0:
        return None
    lc = lcs.stitch(corrector_func=lambda x: x.remove_nans().normalize())
    return lc.remove_nans().remove_outliers(sigma_upper=10, sigma_lower=5)


def download_all(stars: pd.DataFrame, sectors: list[int] | None,
                 min_points: int = 200) -> dict[int, lk.LightCurve]:
    print("Phase 3  Downloading TESS light curves…")
    curves, log = {}, []
    for i, tic_id in enumerate(stars["tic_id"], 1):
        try:
            lc = fetch_light_curve(tic_id, sectors)
            if lc is None:
                status = "no_data"
            elif len(lc) < min_points:
                status = "too_short"
            else:
                curves[tic_id] = lc
                lc.to_fits(DATA_DIR / f"tic{tic_id}.fits", overwrite=True)
                status = "ok"
        except Exception as e:                  # network hiccups, corrupt files, …
            status = f"error: {e}"
        log.append({"tic_id": tic_id, "status": status})
        print(f"\r         {i}/{len(stars)}  ({len(curves)} ok)", end="")
    print()
    pd.DataFrame(log).to_csv(DATA_DIR / "download_log.csv", index=False)
    return curves


# ---------------------------------------------------------------------------
# Phase 4 — Variability features
# ---------------------------------------------------------------------------

def count_flares(lc: lk.LightCurve, n_sigma: float = 3.0, min_points: int = 3) -> int:
    """Number of runs of >= min_points consecutive cadences above n_sigma."""
    resid = lc.flatten(window_length=401).flux.value - 1.0
    sigma = 1.4826 * np.median(np.abs(resid - np.median(resid)))
    above = resid > n_sigma * sigma
    edges = np.diff(np.concatenate([[0], above.astype(int), [0]]))
    starts, stops = np.where(edges == 1)[0], np.where(edges == -1)[0]
    return int(np.sum(stops - starts >= min_points))


def features(lc: lk.LightCurve) -> dict[str, float]:
    f = lc.flux.value
    f = f[np.isfinite(f)]
    diffs = np.diff(f)
    pg = lc.to_periodogram(method="lombscargle", minimum_period=0.05, maximum_period=15)
    return {
        "std": float(np.std(f)),
        "mad": float(np.median(np.abs(f - np.median(f)))),
        "amplitude": float(np.percentile(f, 95) - np.percentile(f, 5)),
        "skew": float(skew(f)),                  # flares give strong positive skew
        "kurtosis": float(kurtosis(f)),
        "von_neumann": float(np.mean(diffs**2) / np.var(f)),  # small = smooth, correlated variability
        "period_days": float(pg.period_at_max_power.value),
        "ls_power": float(pg.max_power.value),
        "n_flares": count_flares(lc),
    }


def extract_features(curves: dict[int, lk.LightCurve]) -> pd.DataFrame:
    print("Phase 4  Extracting variability features…")
    rows = [{"tic_id": tic, **features(lc)} for tic, lc in curves.items()]
    return pd.DataFrame(rows)


# ---------------------------------------------------------------------------
# Phase 5 — Anomaly scoring
# ---------------------------------------------------------------------------

def score_anomalies(feats: pd.DataFrame, contamination: float = 0.05) -> pd.DataFrame:
    """Rank stars by Isolation Forest anomaly score (higher = more unusual)."""
    print("Phase 5  Scoring anomalies…")
    cols = [c for c in feats.columns if c != "tic_id"]
    X = RobustScaler().fit_transform(feats[cols].replace([np.inf, -np.inf], np.nan).fillna(0))
    forest = IsolationForest(n_estimators=500, contamination=contamination, random_state=0).fit(X)
    scored = feats.assign(anomaly_score=-forest.score_samples(X),
                          is_anomaly=forest.predict(X) == -1)
    return scored.sort_values("anomaly_score", ascending=False).reset_index(drop=True)


# ---------------------------------------------------------------------------
# Driver
# ---------------------------------------------------------------------------

def main():
    parser = argparse.ArgumentParser(description=__doc__,
                                     formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("--sectors", type=int, nargs="*", default=None,
                        help="TESS sectors to use (default: all available)")
    args = parser.parse_args()
    DATA_DIR.mkdir(parents=True, exist_ok=True)

    members = query_members()
    members.to_csv(DATA_DIR / "gaia_members.csv", index=False)

    stars = crossmatch_tic(members)
    stars.to_csv(DATA_DIR / "tic_matched.csv", index=False)

    curves = download_all(stars, args.sectors)
    feats = extract_features(curves)
    ranked = score_anomalies(feats).merge(stars, on="tic_id", how="left")
    ranked.to_csv(DATA_DIR / "anomaly_ranking.csv", index=False)

    print(f"\nDone. {len(curves)} light curves analysed; "
          f"{int(ranked['is_anomaly'].sum())} flagged as anomalous.")
    print(ranked.head(10)[["tic_id", "anomaly_score", "n_flares", "period_days", "amplitude"]]
          .to_string(index=False))


if __name__ == "__main__":
    main()
