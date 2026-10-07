"""
flare_ch.py
-----------
Detects and characterizes stellar flares from TESS Target Pixel File (TPF) data.

Pipeline overview:
  1. Load a TESS TPF cutout and generate an aperture-masked light curve.
  2. Identify the brightest cadence (strongest flare candidate).
  3. Compute flux-weighted centroids over time using only aperture pixels.
  4. Measure the centroid shift between the pre-flare baseline and the flare peak.
  5. Project the target star's sky coordinates onto the pixel grid via WCS.

A significant centroid shift during the flare suggests the emission originates
from a nearby contaminating source rather than the target star itself.
"""

from lightkurve import TessTargetPixelFile
import matplotlib.pyplot as plt
import numpy as np
from astropy.coordinates import SkyCoord
import astropy.units as u

# ---------------------------------------------------------------------------
# 1. Load data
# ---------------------------------------------------------------------------

tpf_path = "data/tess-s0080-2-2_270.420554_28.932725_30x30_astrocut.fits"
tpf = TessTargetPixelFile(tpf_path)

# ---------------------------------------------------------------------------
# 2. Build aperture mask and light curve
#
# The same mask is reused for the light curve, flare detection, and centroid
# computation to ensure all three are internally consistent.
# Pixels with flux > 3x the background median are included.
# ---------------------------------------------------------------------------

aperture_mask = tpf.create_threshold_mask(threshold=3)
lc = tpf.to_lightcurve(aperture_mask=aperture_mask)

plt.figure(figsize=(10, 4))
lc.plot()
plt.show()

# ---------------------------------------------------------------------------
# 3. Extract raw flux and time arrays
# ---------------------------------------------------------------------------

flux = tpf.flux.value   # shape: (n_cadences, ny, nx)
time = tpf.time.value   # shape: (n_cadences,) — TBJD

print("Flux shape:", flux.shape)
print("Time len:  ", len(time))

# ---------------------------------------------------------------------------
# 4. Apply aperture mask and detect the strongest flare
#
# Non-aperture pixels are set to NaN so they contribute nothing to sums.
# The cadence with the highest total in-aperture flux is taken as the flare peak.
# ---------------------------------------------------------------------------

masked_flux = flux.copy()
masked_flux[:, ~aperture_mask] = np.nan                        # blank out background pixels

aperture_flux = np.nansum(masked_flux, axis=(1, 2))            # total in-aperture flux per cadence
flare_idx     = np.nanargmax(aperture_flux)                    # index of peak brightness

print("Index of strongest flare:", flare_idx)
print("Time of strongest flare: ", time[flare_idx])

# ---------------------------------------------------------------------------
# 5. Compute flux-weighted centroids at every cadence
#
# Centroid formula:  x_c = sum(x * F) / sum(F)
# Computed only over aperture pixels; NaNs are excluded by nansum.
# ---------------------------------------------------------------------------

ny, nx = flux.shape[1], flux.shape[2]
y, x   = np.mgrid[0:ny, 0:nx]           # pixel coordinate grids

num_x = np.nansum(x * masked_flux, axis=(1, 2))   # sum(x * F)
num_y = np.nansum(y * masked_flux, axis=(1, 2))   # sum(y * F)
den   = np.nansum(masked_flux,     axis=(1, 2))   # sum(F)

centroid_x = num_x / den   # flux-weighted x centroid at each cadence
centroid_y = num_y / den   # flux-weighted y centroid at each cadence

# ---------------------------------------------------------------------------
# 6. Select pre-flare baseline index
#
# Prefer 10 cadences before the peak. If the flare occurs within the first
# 10 cadences, fall back to 10 cadences after the peak.
# NaN frames are skipped in either direction.
# ---------------------------------------------------------------------------

if flare_idx >= 10:
    pre_idx = flare_idx - 10
    while pre_idx > 0 and np.all(np.isnan(masked_flux[pre_idx])):
        pre_idx -= 1
else:
    pre_idx = flare_idx + 10
    while pre_idx < len(time) - 1 and np.all(np.isnan(masked_flux[pre_idx])):
        pre_idx += 1
    print("Warning: flare near start of data; using post-flare frame as baseline")

peak_idx = flare_idx
while peak_idx > 0 and np.all(np.isnan(masked_flux[peak_idx])):
    peak_idx -= 1

print("Using pre-flare index:", pre_idx,  "time:", time[pre_idx])
print("Using peak index:     ", peak_idx, "time:", time[peak_idx])

# ---------------------------------------------------------------------------
# 7. Measure centroid shift between baseline and flare peak
# ---------------------------------------------------------------------------

x_pre  = centroid_x[pre_idx]
y_pre  = centroid_y[pre_idx]
x_peak = centroid_x[peak_idx]
y_peak = centroid_y[peak_idx]

print("Centroid BEFORE flare:  x =", x_pre,  " y =", y_pre)
print("Centroid DURING flare:  x =", x_peak, " y =", y_peak)

dx = x_peak - x_pre
dy = y_peak - y_pre
print("Centroid shift (dx, dy) =", dx, dy)

# ---------------------------------------------------------------------------
# 8. Project target star coordinates onto the pixel grid via WCS
# ---------------------------------------------------------------------------

wcs           = tpf.wcs
coord         = SkyCoord(ra=270.420554*u.deg, dec=28.932725*u.deg)   # TIC 1603615314
x_tic, y_tic  = wcs.world_to_pixel(coord)

print("TIC 1603615314 pixel position:  x =", x_tic, " y =", y_tic)