# paytonsuh.com

Personal academic website, built with [Astro](https://astro.build) and deployed to GitHub Pages.

## Develop

```sh
npm install
npm run dev      # http://localhost:4321
npm run build    # outputs to dist/
```

## Editing content

| What | Where |
| --- | --- |
| Name, email, links | `src/site.ts` |
| Home page bio | `src/pages/index.astro` |
| Research & projects | `src/data/projects.ts` |
| CV | `src/pages/cv.astro` (drop a PDF at `public/cv.pdf`) |
| Notes | `src/content/notes/*.md` |

### Writing notes

Create `src/content/notes/my-note.md`:

```md
---
title: 'Title'
date: 2026-10-06
summary: 'One line shown in the list.'
tags: [analysis]
draft: false
---

Inline math $e^{i\pi} + 1 = 0$ and display math:

$$
\int_{-\infty}^{\infty} e^{-x^2}\,dx = \sqrt{\pi}
$$
```

Theorem-style blocks (leave blank lines inside the div so Markdown still renders):

```html
<div class="theorem" data-label="Theorem 1.">

Statement with $math$.

</div>

<div class="proof">

Proof text. A ∎ is added automatically.

</div>
```

## Deployment

Pushing to `main` runs `.github/workflows/deploy.yml`, which builds the site and publishes it to GitHub Pages. `public/CNAME` sets the custom domain `paytonsuh.com`.
