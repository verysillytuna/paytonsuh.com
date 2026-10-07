"""
pipeline.py — flare detection and centroid vetting for a single TESS target.

Given a TESS Target Pixel File (TPF) cutout, this script

  1. builds an aperture-masked light curve,
  2. detrends it and flags flare candidates (runs of points well above the
     robust noise level),
  3. computes flux-weighted centroids at every cadence,
  4. compares the centroid during the strongest flare against a quiet
     pre-flare baseline, and
  5. projects the catalogue position of the target onto the pixel grid.

If the light centroid moves significantly during a flare, and moves *away* from
the target, the flare most likely comes from a neighbouring star that shares
TESS's large (21") pixels rather than from the target itself.

Usage
-----
    python pipeline.py data/tess-s0080-2-2_270.420554_28.932725_30x30_astrocut.fits \
        --ra 270.420554 --dec 28.932725 --name "TIC 1603615314"
"""

from __future__ import annotations

import argparse
from dataclasses import dataclass
from pathlib import Path

import astropy.units as u
import matplotlib.pyplot as plt
import numpy as np
from astropy.coordinates import SkyCoord
from lightkurve import LightCurve, TessTargetPixelFile


# ---------------------------------------------------------------------------
# Data containers
# ---------------------------------------------------------------------------

@dataclass
class Flare:
    """A contiguous run of cadences above the detection threshold."""
    start: int          # first cadence index
    stop: int           # last cadence index (inclusive)
    peak: int           # index of maximum flux within the run
    peak_time: float    # BTJD
    amplitude: float    # peak relative flux above the detrended baseline


@dataclass
class CentroidShift:
    """Centroid motion between a quiet baseline cadence and a flare peak."""
    baseline_idx: int
    peak_idx: int
    dx: float           # pixels
    dy: float           # pixels
    shift: float        # pixels, sqrt(dx^2 + dy^2)
    significance: float # shift in units of the quiet-time centroid scatter
    toward_target: bool # does the centroid move toward the target's position?


# ---------------------------------------------------------------------------
# 1. Light curve
# ---------------------------------------------------------------------------

def build_light_curve(tpf: TessTargetPixelFile, threshold: float = 3.0):
    """Aperture-masked light curve.

    Pixels brighter than `threshold` times the background median form the
    aperture. The *same* mask is reused for flare detection and centroiding so
    that all three measurements describe exactly the same pixels.
    """
    mask = tpf.create_threshold_mask(threshold=threshold)
    lc = tpf.to_lightcurve(aperture_mask=mask).remove_nans()
    return mask, lc


# ---------------------------------------------------------------------------
# 2. Flare detection
# ---------------------------------------------------------------------------

def robust_sigma(x: np.ndarray) -> float:
    """Standard deviation estimated from the median absolute deviation."""
    x = x[np.isfinite(x)]
    return 1.4826 * np.median(np.abs(x - np.median(x)))


def detect_flares(lc: LightCurve, n_sigma: float = 3.0, min_points: int = 3,
                  window_length: int = 401) -> tuple[list[Flare], LightCurve]:
    """Flag flares as runs of >= `min_points` cadences above `n_sigma`.

    The light curve is first flattened (a Savitzky–Golay filter removes slow
    trends such as rotational modulation and scattered light), so the
    threshold is applied to the residual relative flux.
    """
    flat = lc.normalize().flatten(window_length=window_length)
    resid = flat.flux.value - 1.0
    sigma = robust_sigma(resid)
    above = resid > n_sigma * sigma

    flares: list[Flare] = []
    i, n = 0, len(above)
    while i < n:
        if not above[i]:
            i += 1
            continue
        j = i
        while j + 1 < n and above[j + 1]:
            j += 1
        if j - i + 1 >= min_points:
            peak = i + int(np.nanargmax(resid[i:j + 1]))
            flares.append(Flare(i, j, peak, float(flat.time.value[peak]),
                                float(resid[peak])))
        i = j + 1

    flares.sort(key=lambda f: f.amplitude, reverse=True)
    return flares, flat


# ---------------------------------------------------------------------------
# 3. Flux-weighted centroids
# ---------------------------------------------------------------------------

def flux_weighted_centroids(flux: np.ndarray, mask: np.ndarray):
    """Centroid (x_c, y_c) of the aperture flux at every cadence.

        x_c = sum(x * F) / sum(F),   y_c = sum(y * F) / sum(F)

    `flux` has shape (n_cadences, ny, nx). Pixels outside the aperture are set
    to NaN so they contribute nothing.
    """
    masked = flux.copy()
    masked[:, ~mask] = np.nan
    ny, nx = flux.shape[1:]
    y, x = np.mgrid[0:ny, 0:nx]
    total = np.nansum(masked, axis=(1, 2))
    with np.errstate(invalid="ignore", divide="ignore"):
        cx = np.nansum(x * masked, axis=(1, 2)) / total
        cy = np.nansum(y * masked, axis=(1, 2)) / total
    return cx, cy


# ---------------------------------------------------------------------------
# 4. Centroid shift during the strongest flare
# ---------------------------------------------------------------------------

def quiet_baseline(peak: int, valid: np.ndarray, offset: int = 10) -> int:
    """A valid cadence `offset` steps before the peak (or after, near the start)."""
    step = -1 if peak >= offset else 1
    idx = peak + step * offset
    while 0 < idx < len(valid) - 1 and not valid[idx]:
        idx += step
    return idx


def centroid_shift(cx, cy, peak: int, target_xy: tuple[float, float],
                   quiet: np.ndarray) -> CentroidShift:
    valid = np.isfinite(cx) & np.isfinite(cy)
    base = quiet_baseline(peak, valid)
    dx, dy = cx[peak] - cx[base], cy[peak] - cy[base]
    shift = float(np.hypot(dx, dy))

    # How much does the centroid wander when nothing is happening?
    scatter = np.hypot(robust_sigma(cx[quiet & valid]), robust_sigma(cy[quiet & valid]))
    significance = shift / scatter if scatter > 0 else np.inf

    # Moving toward the target means the distance to it shrinks during the flare.
    tx, ty = target_xy
    d_before = np.hypot(cx[base] - tx, cy[base] - ty)
    d_during = np.hypot(cx[peak] - tx, cy[peak] - ty)

    return CentroidShift(base, peak, float(dx), float(dy), shift,
                         float(significance), bool(d_during <= d_before))


# ---------------------------------------------------------------------------
# 5. Target position on the pixel grid
# ---------------------------------------------------------------------------

def target_pixel(tpf: TessTargetPixelFile, ra: float, dec: float) -> tuple[float, float]:
    coord = SkyCoord(ra=ra * u.deg, dec=dec * u.deg)
    x, y = tpf.wcs.world_to_pixel(coord)
    return float(x), float(y)


# ---------------------------------------------------------------------------
# Plots
# ---------------------------------------------------------------------------

def plot_diagnostics(tpf, mask, lc, flat, flares, cx, cy, shift, target_xy,
                     name: str, out: Path | None = None):
    fig, axes = plt.subplots(1, 2, figsize=(13, 4.5),
                             gridspec_kw={"width_ratios": [2.2, 1]})

    # Light curve with flare candidates
    ax = axes[0]
    ax.plot(lc.time.value, lc.flux.value, lw=0.7, color="0.2")
    for f in flares:
        ax.axvspan(lc.time.value[f.start], lc.time.value[f.stop], color="C3", alpha=0.25)
    ax.set_xlabel("Time [BTJD]")
    ax.set_ylabel("Aperture flux [e⁻/s]")
    ax.set_title(f"{name}: {len(flares)} flare candidate(s)")

    # Pixel image with aperture, centroids, and target
    ax = axes[1]
    image = np.nanmedian(tpf.flux.value, axis=0)
    ax.imshow(image, origin="lower", cmap="gray_r")
    ax.contour(mask, levels=[0.5], colors="C0", linewidths=1)
    b, p = shift.baseline_idx, shift.peak_idx
    ax.plot(cx[b], cy[b], "o", color="C0", label="baseline centroid")
    ax.plot(cx[p], cy[p], "o", color="C3", label="flare centroid")
    ax.annotate("", xy=(cx[p], cy[p]), xytext=(cx[b], cy[b]),
                arrowprops=dict(arrowstyle="->", color="C3"))
    ax.plot(*target_xy, "+", color="C2", ms=12, mew=2, label="target (WCS)")
    ax.set_title(f"shift {shift.shift:.3f} px ({shift.significance:.1f}σ)")
    ax.legend(loc="upper right", fontsize=8)

    fig.tight_layout()
    if out:
        fig.savefig(out, dpi=200)
    plt.show()


# ---------------------------------------------------------------------------
# Driver
# ---------------------------------------------------------------------------

def analyze(path: Path, ra: float, dec: float, name: str, plot: bool = True):
    tpf = TessTargetPixelFile(path)
    mask, lc = build_light_curve(tpf)

    flares, flat = detect_flares(lc)
    if not flares:
        print(f"{name}: no flare candidates above threshold.")
        return None

    # Map the strongest flare from light-curve time back to a TPF cadence.
    strongest = flares[0]
    tpf_time = tpf.time.value
    peak = int(np.nanargmin(np.abs(tpf_time - strongest.peak_time)))

    cx, cy = flux_weighted_centroids(tpf.flux.value, mask)

    # Quiet cadences: everything not inside any flare.
    in_flare = np.zeros(len(tpf_time), dtype=bool)
    for f in flares:
        t0, t1 = lc.time.value[f.start], lc.time.value[f.stop]
        in_flare |= (tpf_time >= t0) & (tpf_time <= t1)

    txy = target_pixel(tpf, ra, dec)
    shift = centroid_shift(cx, cy, peak, txy, quiet=~in_flare)

    print(f"{name}")
    print(f"  flare candidates:      {len(flares)}")
    print(f"  strongest flare:       BTJD {strongest.peak_time:.4f}, "
          f"+{100 * strongest.amplitude:.2f}% above baseline")
    print(f"  centroid shift:        dx={shift.dx:+.4f} px, dy={shift.dy:+.4f} px "
          f"({shift.significance:.1f}σ)")
    print(f"  target pixel position: x={txy[0]:.2f}, y={txy[1]:.2f}")
    verdict = ("consistent with the target" if shift.significance < 3 or shift.toward_target
               else "likely from a nearby contaminating source")
    print(f"  verdict:               {verdict}")

    if plot:
        plot_diagnostics(tpf, mask, lc, flat, flares, cx, cy, shift, txy, name,
                         out=path.with_suffix(".diagnostics.png"))
    return flares, shift


def main():
    parser = argparse.ArgumentParser(description=__doc__,
                                     formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("tpf", type=Path, help="TESS target pixel file (FITS)")
    parser.add_argument("--ra", type=float, required=True, help="target RA [deg]")
    parser.add_argument("--dec", type=float, required=True, help="target Dec [deg]")
    parser.add_argument("--name", default="target")
    parser.add_argument("--no-plot", action="store_true")
    args = parser.parse_args()
    analyze(args.tpf, args.ra, args.dec, args.name, plot=not args.no_plot)


if __name__ == "__main__":
    main()
