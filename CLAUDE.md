# paytonsuh.com — rules for Claude

Astro site deployed to GitHub Pages on every push to `main`. **Never push to `main`; open a PR.**

## Commands
- `npm run dev` / `npm run build` (must pass before any PR)
- `npm run cv:pdf`: regenerates `public/cv.pdf` from `src/components/Resume.astro` (must stay 2 pages, original resume format)
- `npm run notes:pdf`: rebuilds the linear algebra reference from `latex/linear-algebra/` (Tectonic)

## Content rules
- No AIAA anywhere. No phone numbers or personal Gmail. Public email: paytonsuh@ucla.edu. Instagram: suh.payton.
- DSP (Departmental Scholars Program) is an application in progress, not an acceptance.
- ZrC-ARC: Principal Investigator Jan–Oct 2026; Co-Investigator since Oct 2026 (leads research and LAMMPS simulation).
- The stellar light-curve project (Oct 2025–Jun 2026) is the same as the "solar activity" project in the
  recommendation letter; it began as his Physics 23 project. One entry only.
- Violin and taekwondo appear on the CV, not the home page.
- Never host copyrighted textbook PDFs; link official free sources only.
- Photos: small 5px frames, editorial grid, no numbered captions; strip EXIF when adding images.

## Design rules
- Palette tokens live in `src/styles/global.css` (wardrobe palette: burgundy, denim, plum, leather, sand on
  off-white). Keep accents soft; check contrast (body ≥ 7:1, links ≥ 4.5:1). Support light and dark.
- Typeface: EB Garamond. Canvas figures live in `src/scripts/math-figures.ts`; each page has a distinct one.
- No background symbol layer.
