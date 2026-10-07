"""
Variable Star Anomaly Detection Pipeline
Target: NGC 2516 open cluster (~400-500 members)
Phase 1: Gaia membership query + TESS light curve download
"""

import pandas as pd
from pathlib import Path
from astroquery.gaia import Gaia
from astroquery.mast import Catalogs
import lightkurve as lk
import warnings

warnings.filterwarnings("ignore")

# -- Output directory ----------------------------------------------------------
DATA_DIR = Path("data/ngc2516")
DATA_DIR.mkdir(parents=True, exist_ok=True)

# -- 1. Query Gaia DR3 membership for NGC 2516 ---------------------------------
# Center: RA=119.52, Dec=-60.75 | Distance ~408 pc -> parallax ~2.45 mas
# Membership filter: parallax + proper motion box from Cantat-Gaudin 2018

GAIA_QUERY = """
SELECT
    source_id,
    ra,
    dec,
    parallax,
    parallax_error,
    pmra,
    pmdec,
    phot_g_mean_mag,
    phot_bp_mean_mag,
    phot_rp_mean_mag,
    bp_rp,
    radial_velocity
FROM gaiadr3.gaia_source
WHERE CONTAINS(
    POINT(ra, dec),
    CIRCLE(119.52, -60.75, 0.75)
) = 1
AND parallax BETWEEN 2.1 AND 2.9
AND pmra    BETWEEN -5.5 AND -3.5
AND pmdec   BETWEEN 11.0 AND 13.0
AND phot_g_mean_mag < 14.0
AND parallax_error < 0.2
"""

print("Querying Gaia DR3 for NGC 2516 members...")
job = Gaia.launch_job(GAIA_QUERY)
gaia_members = job.get_results().to_pandas()
print(f"  Found {len(gaia_members)} candidate members\n")

gaia_members.to_csv(DATA_DIR / "gaia_members.csv", index=False)


# -- 2. Cross-match Gaia sources to TESS Input Catalog (TIC) ------------------

print("Cross-matching to TESS Input Catalog...")

tic_ids  = []
tic_tmag = []

for _, row in gaia_members.iterrows():
    result = Catalogs.query_region(
        f"{row['ra']} {row['dec']}",
        radius="5s",           # 5 arcsec search radius
        catalog="TIC"
    )
    if len(result) > 0:
        result.sort("Tmag")    # take brightest match within radius
        tic_ids.append(int(result["ID"][0]))
        tic_tmag.append(float(result["Tmag"][0]))
    else:
        tic_ids.append(None)
        tic_tmag.append(None)

gaia_members["tic_id"] = tic_ids
gaia_members["Tmag"]   = tic_tmag

matched = gaia_members.dropna(subset=["tic_id"])
matched = matched[matched["Tmag"] < 13.5].reset_index(drop=True)
matched["tic_id"] = matched["tic_id"].astype(int)

print(f"  {len(matched)} stars matched to TIC with Tmag < 13.5\n")
matched.to_csv(DATA_DIR / "tic_matched.csv", index=False)


# -- 3. Download TESS light curves --------------------------------------------
# NGC 2516 covered in Sectors 1, 27, 28 (Southern CVZ-adjacent)
# Priority: 2-min cadence SPOC PDCSAP; fallback to QLP (FFI-based)

TARGET_SECTORS     = [100]
PREFERRED_AUTHORS  = ["SPOC", "QLP"]

print("Downloading TESS light curves...")
light_curves = {}
download_log = []

for _, row in matched.iterrows():
    tic_id = row["tic_id"]
    target = f"TIC {tic_id}"

    try:
        search = lk.search_lightcurve(
            target,
            mission="TESS",
            sector=TARGET_SECTORS,
            author=PREFERRED_AUTHORS,
            exptime="short"        # prefer 2-min cadence
        )

        # Fallback: if no 2-min, accept 10-min (QLP FFI)
        if len(search) == 0:
            search = lk.search_lightcurve(
                target, mission="TESS",
                sector=TARGET_SECTORS, author="QLP"
            )

        if len(search) == 0:
            download_log.append({"tic_id": tic_id, "status": "no_data"})
            continue

        lc_collection = search.download_all(
            flux_column="pdcsap_flux",
            quality_bitmask="hardest"
        )

        if lc_collection is None or len(lc_collection) == 0:
            download_log.append({"tic_id": tic_id, "status": "download_failed"})
            continue

        # Stitch sectors: normalize each to unit median before combining
        lc_stitched = lc_collection.stitch(corrector_func=lambda lc: lc.normalize())

        lc_clean = (
            lc_stitched
            .remove_nans()
            .remove_outliers(sigma=5.0)
        )

        if len(lc_clean) < 200:
            download_log.append({"tic_id": tic_id, "status": "too_short",
                                  "n_points": len(lc_clean)})
            continue

        light_curves[tic_id] = lc_clean
        download_log.append({
            "tic_id":   tic_id,
            "status":   "ok",
            "n_points": len(lc_clean),
            "sectors":  list(lc_collection.sector) if hasattr(lc_collection, "sector")
                        else TARGET_SECTORS,
            "Tmag":     row["Tmag"],
            "bp_rp":    row["bp_rp"]
        })

    except Exception as e:
        download_log.append({"tic_id": tic_id, "status": f"error: {str(e)}"})
        continue

# -- 4. Summary ----------------------------------------------------------------

log_df = pd.DataFrame(download_log)
log_df.to_csv(DATA_DIR / "download_log.csv", index=False)

ok = log_df[log_df["status"] == "ok"]
print(f"Download complete:")
print(f"  Successfully downloaded: {len(ok)} light curves")
print(f"  No data available:       {len(log_df[log_df['status'] == 'no_data'])}")
print(f"  Too short / failed:      {len(log_df) - len(ok) - len(log_df[log_df['status'] == 'no_data'])}")
print(f"\nLight curves ready for feature extraction: {len(light_curves)}")
print(f"Data saved to: {DATA_DIR.resolve()}")