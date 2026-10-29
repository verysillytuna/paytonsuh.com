---
title: "Local smoothing in every dimension, claimed"
date: 2026-10-28
summary: "On October 26 OpenAI announced that its models proved Sogge's local smoothing conjecture for the wave equation in every dimension, which would also settle the Bochner–Riesz, restriction and Kakeya conjectures, and separately that they disproved the Exponential Time Hypothesis. Both come with Lean files; neither has been refereed."
tags: [harmonic analysis, PDE, complexity theory, AI and mathematics, formal verification]
---

**TL;DR.** On Monday, October 26, OpenAI announced three results produced by its internal models. Two are mathematics. The first is a proof of **Sogge's local smoothing conjecture** for the wave equation **in every dimension**. If it is right, it settles a whole chain of conjectures in harmonic analysis at once: Bochner–Riesz, Stein's restriction conjecture, and the Kakeya conjecture, all in all dimensions. The second is a **disproof of the Exponential Time Hypothesis** (ETH) from complexity theory. The third, in quantum field theory, was announced without the proofs. Coverage says the natural-language proofs and Lean formalizations were posted publicly, that outside experts are now checking them, and that nothing has been refereed. Everything below is a claim.

This follows the [October 23 entry](/digest/2026-10-23-kakeya-three-and-four) on OpenAI's papers about Kakeya in three and four dimensions. If the new claim holds, it supersedes both.

## The conjecture

Let $u(x,t)$ solve the wave equation $\partial_t^2 u = \Delta u$ on $\mathbb R^n$, with $n \ge 2$. At a single fixed time, solutions can lose regularity in $L^p$: the operator $e^{it\sqrt{-\Delta}}$ maps $W^{s,p}$ into $W^{s - (n-1)|1/2 - 1/p|,\,p}$ and no better (Seeger–Sogge–Stein, 1991). Averaging over time helps. **Local smoothing** asks how much. Sogge's conjecture (1991) says that for $p \ge \tfrac{2n}{n-1}$ the time average gains almost a full $1/p$ derivative:
$$
\| e^{it\sqrt{-\Delta}} f \|_{L^p(\mathbb R^n \times [1,2])} \le C_{\varepsilon}\, \| f \|_{W^{\sigma,p}(\mathbb R^n)}, \qquad \sigma = (n-1)\Big(\tfrac12 - \tfrac1p\Big) - \tfrac1p + \varepsilon,
$$
for every $\varepsilon > 0$.

What was known: Guth, Wang and Zhang proved the case $n = 2$ in 2019 ([Annals 2020](https://annals.math.princeton.edu/2020/192-2/p06)) through a sharp square function estimate for the cone in $\mathbb R^3$. In higher dimensions only partial ranges of $p$ were known, many of them through decoupling.

## Why it would settle so much

The conjectures in this corner of harmonic analysis form a ladder, and local smoothing sits at the top:
$$
\text{local smoothing} \;\Longrightarrow\; \text{Bochner–Riesz} \;\Longrightarrow\; \text{restriction} \;\Longrightarrow\; \text{Kakeya}.
$$
- **Local smoothing ⟹ Bochner–Riesz.** The Bochner–Riesz means $\big(1 - |\xi|^2\big)_+^{\delta}$ are averages of wave propagators, so time-averaged estimates for waves give the conjectured $L^p$ bounds for them. This implication goes back to the 1990s.
- **Bochner–Riesz ⟹ restriction.** Tao proved this in 1999. The restriction conjecture bounds the Fourier transform of a function on the sphere in $L^p(\mathbb R^n)$ for $p > \tfrac{2n}{n-1}$.
- **Restriction ⟹ Kakeya.** Wave packets concentrated on thin tubes turn a restriction estimate into a bound on how much tubes in different directions can overlap. That bound says Kakeya sets have full dimension.

So a proof at the top proves everything below it, in every dimension. Until last year Kakeya was settled only for $n \le 2$. Then Hong Wang and Joshua Zahl proved the three-dimensional case ([arXiv:2502.17655](https://arxiv.org/abs/2502.17655), February 2025). Coverage of the new claim says the proof introduces a new auxiliary PDE. I have not been able to read the manuscript, so I can't say more about the method.

## What the Lean files do and don't show

Coverage reports that the model produced the proof in mid-October and that it was formalized in Lean within a day. Sources disagree on the exact dates. A Lean check shows that the stated formal theorem follows from the library's axioms. It does not show that the formal statement is Sogge's conjecture. With an estimate like the one above, with its function spaces, endpoint range and $\varepsilon$-loss, checking that the definitions match is real work. That is the first thing referees will look at. The earlier Kakeya papers from OpenAI, from three weeks ago, were not formalized.

## The second claim: ETH is false

The **Exponential Time Hypothesis** (Impagliazzo and Paturi, 1999) says 3-SAT on $n$ variables cannot be solved in time $2^{o(n)}$. Much of fine-grained complexity assumes it. See the [October 26 entry](/digest/2026-10-26-3sum-apsp) for its relatives 3SUM and APSP. OpenAI says its model found a refutation, which means a $2^{o(n)}$ algorithm for 3-SAT, and that the refutation was also formalized in Lean. Two cautions from the coverage. First, it does **not** settle P vs NP: a $2^{o(n)}$ algorithm can still be far from polynomial, for example $2^{n/\log n}$. Second, a faster algorithm in principle does not make practical SAT solvers faster tomorrow.

## What to watch

- Whether experts in Fourier restriction and decoupling confirm that the formal statement matches Sogge's conjecture, and that the paper's argument holds up.
- Whether complexity theorists confirm the ETH refutation. It would rewrite a large part of fine-grained complexity.
- These two claims came out three weeks after the [October release](/digest/2026-10-08-openai-math-catalog). That release is still being checked family by family.

## Sources

- Background: Guth–Wang–Zhang, [*A sharp square function estimate for the cone in ℝ³*](https://annals.math.princeton.edu/2020/192-2/p06), Annals of Math. 192 (2020); Wang–Zahl, [arXiv:2502.17655](https://arxiv.org/abs/2502.17655); Wikipedia on the [local smoothing conjecture](https://en.wikipedia.org/wiki/Local_smoothing_conjecture), the [restriction conjecture](https://en.wikipedia.org/wiki/Restriction_conjecture) and [Kakeya sets](https://en.wikipedia.org/wiki/Kakeya_set).
- News coverage of the October 26 announcement: [Quartz](https://qz.com/openai-ai-discoveries-math-computer-science-physics-102726), [The Washington Times](https://www.washingtontimes.com/news/2026/oct/27/openai-says-model-refuted-exponential-time-hypothesis/), [Xenospectrum](https://xenospectrum.com/en/openai-yang-mills-kakeya-eth-release/).
- OpenAI's mathematics repository: [github.com/openai/math](https://github.com/openai/math).

*This entry is based on search summaries of the announcement and its coverage. The runner could not reach OpenAI's post, the manuscripts or arXiv directly, so the details of the proofs are not described here.*
