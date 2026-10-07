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

## Resources

`/resources/` holds public tools built in the workbench repo: the Putnam practice bank (`src/data/putnam-bank.csv`,
copied from `workbench/putnam/bank.csv`), summer research programs (`src/data/summer-programs.ts`, from
`workbench/applications/reu-2027.md` without personal notes), and a LaTeX notes template (`public/resources/latex/`).

## Admin dashboard

`/admin/` is a private dashboard (not linked, `noindex`, not in the sitemap) with the same sections and actions as
`workbench/apps/dashboard`, read live from the GitHub API in the browser.

Because the site is static, there is no server to check a password. Instead, a fine-grained GitHub token is
encrypted with your username and password (PBKDF2-SHA256, 600,000 iterations → AES-256-GCM) and only the ciphertext
is committed. Signing in decrypts the token in the browser and keeps it in `sessionStorage` until the tab closes.

```sh
npm run admin:seal   # prompts for username, password, and token; writes src/data/admin-vault.json
```

Commit the vault and merge; the next deploy enables the login. To change the password or rotate the token, run it
again. Use a long, unique password: the ciphertext is public, so its strength is what protects the token, and the
token's narrow scope (two repos; issues write, pull requests and contents read) limits the damage if it leaks.

```sh
npm test             # vault round trip and dashboard parsers
```
