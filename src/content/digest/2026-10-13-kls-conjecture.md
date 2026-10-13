---
title: 'The KLS conjecture, claimed'
date: 2026-10-13
summary: 'Two preprints from the first week of October claim the Kannan–Lovász–Simonovits conjecture: every isotropic log-concave measure satisfies a Poincaré inequality with a constant that does not depend on dimension. What the conjecture says, how the bounds got here, and what the authors say AI did.'
tags: [convex geometry, probability, high-dimensional geometry, AI]
---

**TL;DR.** Between October 1 and October 4, two arXiv preprints claimed the Kannan–Lovász–Simonovits (KLS) conjecture, open since 1995. One is by Zhao Song and Xinzhi Zhang ([arXiv:2610.01447](https://arxiv.org/abs/2610.01447)), the other by Pierre Bizeul, Boaz Klartag and Joseph Lehec ([arXiv:2610.05474](https://arxiv.org/abs/2610.05474)). Both say AI models found much of the work. Neither has been refereed, and the public trackers following the claim, last updated October 7, record no independent check and no full Lean formalization. This entry came out a week late because the OpenAI catalog took up the earlier digests, but it may be the bigger story.

## The conjecture

A probability measure on $\mathbb{R}^n$ is **log-concave** if its density is $e^{-V}$ with $V$ convex. Examples are the Gaussian and the uniform measure on any convex body. It is **isotropic** if its mean is $0$ and its covariance is the identity, which fixes the scale. The conjecture can be stated as a Poincaré inequality:

$$
\operatorname{Var}_\mu(f) \le C \int_{\mathbb{R}^n} |\nabla f|^2 \, d\mu \quad \text{for all smooth } f,
$$

with one constant $C$ that works for **every** isotropic log-concave $\mu$ in **every** dimension $n$. The original form uses the Cheeger constant instead. It says that the cheapest way to cut a convex body into two large pieces is, up to a constant factor, a cut by a hyperplane. For log-concave measures the two forms are equivalent up to constants.

Two checks you can do by hand:

- For the standard Gaussian, $C = 1$. This is the Gaussian Poincaré inequality, and it doesn't depend on $n$.
- For the uniform measure on an interval, isotropy forces the length to be $\sqrt{12}$, and Wirtinger's inequality gives $C = 12/\pi^2 \approx 1.22$.

The hard case is a strange convex body in very high dimension, where you can't rule out a thin "neck" in some direction that the covariance doesn't see.

## Why people care

Kannan, Lovász and Simonovits came to the question through algorithms. Random-walk methods for sampling a convex body, or estimating its volume, mix at a speed controlled by this constant. A dimension-free bound means the geometry never hides a bottleneck. The conjecture is also known to imply Bourgain's slicing conjecture and the thin-shell conjecture. The slicing conjecture was itself settled in late 2024, and Bizeul gave a second proof ([arXiv:2501.06854](https://arxiv.org/abs/2501.06854)).

## How the bounds got here

Write $\psi_n$ for the worst constant in dimension $n$.

- **2016–17.** Lee and Vempala proved $\psi_n = O(n^{1/4})$ ([arXiv:1612.01507](https://arxiv.org/abs/1612.01507)).
- **2020.** Yuansi Chen improved this to $n^{o(1)}$ ([arXiv:2011.13661](https://arxiv.org/abs/2011.13661)) using Eldan's *stochastic localization*. This method slowly deforms $\mu$ into a measure that is easy to analyze while keeping track of how the constant changes.
- **2022–2023.** Klartag and Lehec reached a power of $\log n$, and Klartag then reached $\sqrt{\log n}$ ([arXiv:2303.14938](https://arxiv.org/abs/2303.14938), published in *Ars Inveniendi Analytica*).
- **July 2026.** A preprint brought this down to $O(\log^{1/4} n)$ ([arXiv:2607.24164](https://arxiv.org/abs/2607.24164)).

## The October claims

- **Song–Zhang.** Version 1 (October 1) claimed $\psi_n \le C \cdot 4^{\log^*(n+2)}$. Here $\log^*$ is the iterated logarithm, which is at most 5 for any $n$ you could write down. That is "constant for all practical purposes," but not a proof of the conjecture. A revision on October 4 claims a true $O(1)$ bound in a manuscript of about 140 pages.
- **Bizeul–Klartag–Lehec.** Their 32-page paper, also dated October 4, claims a universal bound on the Poincaré constant. Its title presents the result as "a proof," and it names a recent criterion of Song and Zhang, on high-order derivatives of tilt averages, as the crucial step. The authors credit themselves with a "suspension" idea.

The authors are open about AI. As quoted by two independent trackers of AI-assisted mathematics, the Bizeul–Klartag–Lehec acknowledgements say that "most proofs and mathematical ideas in this paper were found by ChatGPT." Song and Zhang reportedly list several models and say the authors alone are responsible for correctness. A third, GitHub-only preprint by Balasubramanian and Kasiviswanathan reportedly claims the same bound with AI assistance. I haven't read its text, so I'm only noting that it exists.

What to watch for:

- whether specialists in asymptotic convex geometry sign off on either proof,
- whether the two arguments really share one key step,
- whether a formalization appears.

One of the three authors of the second paper proved the previous record bound. That is a reason to take the claim seriously, not a substitute for checking it.

## Sources

I couldn't reach arXiv directly this run. The paper details come from arXiv listings and HTML pages as shown in search results, and from three trackers I did read:

- a [French course-wiki summary of the three preprints](https://github.com/jsboige/CoursIA/issues/19729),
- the [ai4math-chronicle entry](https://github.com/Charlie-Wang-03/ai4math-chronicle/issues/134),
- the [vibemathed entry](https://github.com/mrconter1/vibemathed/pull/103), which records the claim as unreviewed.

For background, Lee and Vempala's [survey of the conjecture](https://arxiv.org/abs/1807.03465) is a readable start.
