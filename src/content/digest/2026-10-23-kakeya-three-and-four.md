---
title: "Kakeya in three and four dimensions, claimed"
date: 2026-10-23
summary: "Two long papers in OpenAI's October release claim the next steps on the Kakeya problem after Wang and Zahl's 2025 solution in three dimensions: the stronger maximal-function form in three dimensions, and the set conjecture in four. Neither is refereed or formalized."
tags: [harmonic analysis, geometric measure theory, AI and mathematics]
---

**TL;DR.** Family 074 in [OpenAI's math repository](https://github.com/openai/math) (see the [October 8 entry](/digest/2026-10-08-openai-math-catalog)) has two papers on the **Kakeya problem**. The first (97 pages, dated September 23, 2026) claims the **Kakeya maximal conjecture in $\mathbb R^3$**, a quantitative strengthening of the set conjecture that Hong Wang and Joshua Zahl proved last year. The second (175 pages, dated September 24) claims that **every Kakeya set in $\mathbb R^4$ has Hausdorff dimension 4**. Before this, the best lower bound in four dimensions was about $3.059$. The four-dimensional proof uses a lemma from the three-dimensional paper, so the two stand or fall together. Neither has a Lean formalization or a referee, so these are claims.

## The problem

A **Kakeya set** in $\mathbb R^n$ contains a unit line segment pointing in every direction. A ball of diameter 1 is one. Besicovitch showed in 1919–28 that such a set can have **measure zero**. The Kakeya conjecture says it can't be much smaller than that: every Kakeya set in $\mathbb R^n$ has Hausdorff dimension $n$.

The plane was settled by Davies in 1971. In higher dimensions the problem became a central one in harmonic analysis, because the same configurations of thin overlapping tubes control Fourier restriction and Bochner–Riesz summability. Wolff's "hairbrush" argument (1995) gave dimension at least $(n+2)/2$, which is $5/2$ in $\mathbb R^3$ and $3$ in $\mathbb R^4$. Progress past those numbers took decades and came in small steps. In February 2025, Wang and Zahl posted a proof of the full conjecture in $\mathbb R^3$ ([arXiv:2502.17655](https://arxiv.org/abs/2502.17655)), and Guth, Wang and Zahl posted a streamlined version in January 2026 ([arXiv:2601.14411](https://arxiv.org/abs/2601.14411)). Neither the four-dimensional case nor the maximal form in three dimensions was known.

## Two strengths of the conjecture

The **maximal** version measures how much thin tubes can overlap. Fix a small width $\delta$. For a direction $e$ on the unit sphere, let $T_\delta(a,e)$ be the tube of length 1 and radius $\delta$ centered at $a$ in direction $e$, and set
$$
\mathcal K_\delta f(e) = \sup_{a \in \mathbb R^n} \frac{1}{|T_\delta(a,e)|}\int_{T_\delta(a,e)} |f|.
$$
The **Kakeya maximal conjecture** says that for every $\varepsilon > 0$,
$$
\|\mathcal K_\delta f\|_{L^n(S^{n-1})} \le C_\varepsilon\, \delta^{-\varepsilon}\, \|f\|_{L^n(\mathbb R^n)}.
$$

The maximal version implies the set version, at least for Minkowski dimension. Let $K$ be a Kakeya set, and let $f$ be the indicator of its $\delta$-neighborhood $K_\delta$. Every direction has a whole tube inside $K_\delta$, so $\mathcal K_\delta f = 1$ everywhere on the sphere. The inequality then reads $|S^{n-1}|^{1/n} \le C_\varepsilon \delta^{-\varepsilon} |K_\delta|^{1/n}$, so $|K_\delta| \gtrsim \delta^{n\varepsilon}$ for every $\varepsilon$. Covering $K$ by $\delta$-balls therefore takes about $\delta^{-n}$ of them, up to $\delta^{-n\varepsilon}$ losses, which is Minkowski dimension $n$.

The converse fails, and that's the gap the three-dimensional paper claims to close. Its introduction puts it in terms of shaded tubes: if each tube is only partly filled, with a fraction $\lambda$ of its volume marked, the maximal conjecture needs the union of the marked parts to have volume at least about $\lambda^3$ times the total. Wang and Zahl's theorem gives a bound with a much worse power of $\lambda$. Their paper points out that improving it to $\lambda^3$ is what the maximal conjecture requires.

## What the papers claim, and how

I read the abstracts and introductions of both papers, and the bibliography of the four-dimensional one. The three-dimensional paper's main theorem is the inequality above with $n = 3$. As I read Section 1.2, it sets up a family of weighted incidence inequalities, assumes the best exponent is positive, and studies configurations that come close to equality. In those, typical short pieces of tubes must have nearly coplanar directions, and plates of tubes must fill up. Its key step is that rescaling an extremal configuration reproduces the same shape, which the paper calls *stationarity*. An entropy argument across two coordinate frames then rules that shape out.

The four-dimensional paper's main theorem is that any $K \subset \mathbb R^4$ containing a unit segment in every direction has Hausdorff dimension 4. $K$ doesn't have to be measurable or compact. The previous record it cites is $3.059$, from the Katz–Zahl "planebrush" ([arXiv:1902.00989](https://arxiv.org/abs/1902.00989)). The proof assumes a deficit and works with **charts**: a bundle of line pieces in a moving box over a time interval, on which one quadratic polynomial stays small. Charts can be nested, and the argument tracks a trade-off between how thin the quadratic relation is and how long the line pieces it holds on are. It splits into three geometric regimes. One of them ends with the broad directions lying near a conic, which the paper handles separately in a section titled "Seven directions and the exceptional conic." The three-dimensional input is a "weighted full-time plank bound," stated as Lemma 2.3 of the companion paper.

Both papers end with consequences: Nikodym maximal estimates on spaces of constant curvature, and versions for curved tubes.

## What has been checked

- **Lean.** The repository's catalogue lists no formalization for family 074, unlike the [Mahler family](/digest/2026-10-22-mahler-conjecture).
- **People.** Search turned up press coverage that mentions these papers, but I couldn't open any of it, so I can't report what experts have said. At 97 and 175 pages, building on arguments that are themselves new, these will take specialists a long time to check.

## Why it's worth knowing

The definition fits in a sentence, the measure-zero examples are elementary, and the problem connects to some of the deepest open questions in Fourier analysis. If these hold up, the $\mathbb R^3$ story would be complete in its strongest standard form, and $\mathbb R^4$ would be the first dimension above three where the set conjecture is known. One thing to watch is how much of the three-dimensional machinery carries over. The four-dimensional proof leans on it directly.

## Sources

- OpenAI, *The Kakeya maximal conjecture in three dimensions* ([PDF](https://github.com/openai/math/blob/main/preprints/The-Kakeya-maximal-conjecture-in-three-dimensions-September-23-2026/paper.pdf)), September 23, 2026. Abstract and Section 1 read.
- OpenAI, *Every four-dimensional Kakeya set has full Hausdorff dimension* ([PDF](https://github.com/openai/math/blob/main/preprints/Every-four-dimensional-Kakeya-set-has-full-Hausdorff-dimension-September-24-2026/paper.pdf)), September 24, 2026. Abstract, Section 1 and references read.
- H. Wang and J. Zahl, *Volume estimates for unions of convex sets, and the Kakeya set conjecture in three dimensions*, [arXiv:2502.17655](https://arxiv.org/abs/2502.17655).
- L. Guth, H. Wang and J. Zahl, *A streamlined proof of the Kakeya set conjecture in $\mathbb R^3$*, [arXiv:2601.14411](https://arxiv.org/abs/2601.14411).
