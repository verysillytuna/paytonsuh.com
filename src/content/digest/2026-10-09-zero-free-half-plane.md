---
title: 'What “no zeros past 7/8” would mean'
date: 2026-10-09
summary: 'A closer look at the biggest claim in OpenAI’s catalog: a zero-free half-plane for every Dirichlet L-function. What the classical zero-free regions are, what a half-plane would buy, and what the Lean files actually state.'
tags: [analytic number theory, AI and mathematics]
---

**TL;DR.** Yesterday's entry covered OpenAI's release of 372 result families. Today: its most striking claim, family 003. It says no Dirichlet $L$-function, $\zeta(s)$ included, has a zero with $\operatorname{Re} s > 7/8$. That's still a claim. Nobody has refereed it, and the repository's [history page](https://github.com/openai/math/blob/main/history.md) still lists only the October 7 corrections (checked the morning of October 9, UTC). This entry explains why the claim matters and what the formal statement covers.

## Where things stood

The nontrivial zeros of $\zeta(s)$ lie in the critical strip $0 < \operatorname{Re} s < 1$, symmetric about the line $\operatorname{Re} s = 1/2$. The Riemann hypothesis says they all lie *on* that line.

What we can actually prove is much weaker. Hadamard and de la Vallée Poussin showed in 1896 that there are no zeros on $\operatorname{Re} s = 1$. That fact is the prime number theorem. De la Vallée Poussin pushed it into a thin region
$$
\operatorname{Re} s > 1 - \frac{c}{\log(|t| + 2)}, \qquad s = \sigma + it.
$$
The best region known, due to Vinogradov and Korobov (1958), is still only a little wider:
$$
\operatorname{Re} s > 1 - \frac{c}{(\log |t|)^{2/3} (\log\log |t|)^{1/3}}.
$$
Both regions shrink toward the line $\operatorname{Re} s = 1$ as $|t| \to \infty$. Before this week, nobody could rule out zeros in *any* half-plane $\operatorname{Re} s > \theta$ with $\theta < 1$. A fixed $\theta$ like that is the "quasi-Riemann hypothesis."

## What a half-plane would buy

A zero-free half-plane $\operatorname{Re} s > \theta$ for $\zeta$ is equivalent to a power-saving error term in the prime number theorem:
$$
\psi(x) = \sum_{n \le x} \Lambda(n) = x + O_\varepsilon\!\left(x^{\theta + \varepsilon}\right) \quad \text{for every } \varepsilon > 0.
$$
The Riemann hypothesis is the case $\theta = 1/2$. With $\theta = 7/8$, the primes up to $x$ would follow $x$ to within roughly $x^{7/8}$. Today's unconditional error term saves less than any power of $x$.

The claim also covers every Dirichlet $L$-function, uniformly in the modulus. That rules out **Landau–Siegel zeros**: a hypothetical real zero $\beta$ of $L(s,\chi)$, for a real character $\chi$ mod $q$, very close to $1$. Siegel's theorem bounds how close such a zero can get, but its constant can't be computed. So many results about primes in arithmetic progressions and class numbers of imaginary quadratic fields can't be made explicit. A half-plane for all moduli would make those results effective. A companion manuscript in the catalog states this directly, with a separate proof of the weaker half-plane $\operatorname{Re} s > 11/12$.

## What the Lean files say

Family 003's [formalization notes](https://github.com/openai/math/blob/main/lean/docs/003.md) say the Lean development proves:

- the $7/8$ half-plane for $\zeta$ and every Dirichlet $L$-function, uniformly over all moduli and characters (the pole at $s = 1$ excluded);
- the same half-plane for finite-order Hecke $L$-functions over $\mathbb{Q}(\sqrt{-3})$;
- one constant $c > 0$ with $1 - \beta \ge c/\log q$ for every real zero $\beta$ of $L(s,\chi)$, where $\chi$ is primitive, real, and of conductor $q \ge 3$. No explicit value of $c$ is given.

The notes also say the paper's later applications aren't formalized. The statement the formal proof must match is short enough to read in one glance ([QuasiRiemannHypothesis.lean](https://github.com/openai/math/blob/main/lean/ComparatorChallenges/QuasiRiemannHypothesis.lean)). Here it is in full:

```lean
theorem riemannZeta_ne_zero_of_seven_eighths_lt_re
    {s : ℂ} (hs : (7 / 8 : ℝ) < s.re) : riemannZeta s ≠ 0
```

`riemannZeta` is Mathlib's $\zeta$, so the statement means exactly what it says. Whether the proof checks is a question for people who run the build. Whether the paper contains a new idea that people can learn from is a separate question, and only reading it will answer that.

## Reading

- The paper: [The Quasi-Riemann Hypothesis: A Zero-Free Half-Plane Re s > 7/8](https://github.com/openai/math/blob/main/preprints/The-Quasi-Riemann-Hypothesis-September-30-2026/paper.pdf), and the family's entry in the [manuscript map](https://github.com/openai/math/blob/main/CONTENTS.md).
- Background: Davenport's *Multiplicative Number Theory* is the standard textbook for both classical facts above, the zero-free regions and Siegel's theorem.
