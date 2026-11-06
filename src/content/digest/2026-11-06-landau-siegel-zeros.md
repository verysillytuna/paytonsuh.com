---
title: "Landau–Siegel zeros: a claimed proof that they don't exist, now in human hands"
date: 2026-11-06
summary: "One of the AI-generated manuscripts from OpenAI's October release claims there are no Landau–Siegel zeros, the hypothetical exceptional zeros that have made many bounds in number theory ineffective for ninety years. Number theorists have since posted their own write-ups, one with an explicit constant. None has been refereed."
tags: [number theory, analytic number theory, L-functions, AI and mathematics]
---

**TL;DR.** Among the AI-generated manuscripts OpenAI released in early October (the same release behind the [zero-free half-plane claim](/digest/2026-10-09-zero-free-half-plane/)) is a short paper claiming that **Landau–Siegel zeros do not exist**. Since then, human mathematicians have posted their own versions of the argument. William Banks's version ([arXiv:2610.15483](https://arxiv.org/abs/2610.15483), Oct 11) gives an explicit constant. Bryce Kerr's ([arXiv:2610.21099](https://arxiv.org/abs/2610.21099), Oct 15) replaces the central determinant step with a pigeonhole argument. This week's coverage has been about how fast the proof has been shortened and checked. Specialists quoted in the press mostly think the argument is right, and others won't call it a theorem until every detail has been checked. None of these papers has been refereed, so treat the result as a claim.

## The question

Let $\chi$ be a real primitive Dirichlet character of conductor $q$, for example the character $\chi_{-d}$ attached to an imaginary quadratic field. Its $L$-function is
$$
L(s,\chi) = \sum_{n \ge 1} \frac{\chi(n)}{n^s}.
$$
The classical zero-free region (de la Vallée Poussin, Landau, Page) says that $L(s,\chi)$ has no zeros with
$$
\sigma > 1 - \frac{c}{\log\big(q(|t|+2)\big)}, \qquad s = \sigma + it,
$$
for an absolute constant $c > 0$, with **one possible exception**: a single real zero $\beta$ close to $1$. That hypothetical zero is a **Landau–Siegel zero** (or exceptional zero). The Generalized Riemann Hypothesis would put every zero on $\sigma = \tfrac12$, so GRH rules it out. Without GRH, nobody had managed to exclude it.

The strongest unconditional statement was **Siegel's theorem** (1935): for every $\varepsilon > 0$ there is a $c(\varepsilon) > 0$ with
$$
L(1,\chi) > c(\varepsilon)\, q^{-\varepsilon}, \qquad \text{and hence} \qquad 1 - \beta > c(\varepsilon)\, q^{-\varepsilon}.
$$
The catch is that $c(\varepsilon)$ is **ineffective**: the proof argues by contradiction, from a possible bad character, and gives no way to compute the constant.

## Why it matters

The possible exceptional zero is why many results in analytic number theory come with a constant no one can compute.

- **Class numbers.** For an imaginary quadratic field of discriminant $-d$ with $d > 4$, the class number formula gives $h(-d) = \frac{\sqrt d}{\pi} L(1,\chi_{-d})$. So Siegel's theorem gives $h(-d) \gg_\varepsilon d^{1/2-\varepsilon}$, but you can't use it to list all fields with a given class number. (The effective bounds known so far, from Goldfeld and Gross–Zagier, are only of size $\log d$.) A zero-free gap of the claimed form would give an effective bound close to $\sqrt d$.
- **Primes in progressions.** The Siegel–Walfisz theorem counts primes in arithmetic progressions with an ineffective constant for the same reason.
- **A strange flip side.** Some results go *through* a Siegel zero: Heath-Brown showed in 1983 that if Siegel zeros exist, then there are infinitely many twin primes. Proving that they don't exist would close that route.

## What is claimed

From the papers' listings and summaries (the full texts weren't reachable from here):

- **The claim.** There is an absolute, **effective** constant $\delta_0 > 0$ with $(1-\beta)\log q \ge \delta_0$ for every real zero $\beta$ of $L(s,\chi)$ with $\chi$ real and primitive. In other words, the exceptional zero in the classical region doesn't exist.
- **Banks (Oct 11)** reports $\delta_0 = 0.003$. The analytic argument covers conductors $q \ge 10^{10}$. Smaller conductors rely on a published computation, which he says he did not check himself. The method is an interpolation-determinant argument. He says he checked the written argument line by line, and he asks for independent scrutiny.
- **Kerr (Oct 15)** gives what he calls a conceptually simpler proof that some positive constant works. He uses the pigeonhole principle in place of the determinant.

Coverage of the original manuscript differs on some details, so I've left them out.

## How to read this

A uniform $\log q$ gap would be one of the biggest results in analytic number theory in decades. It is also the kind of claim that has failed before: earlier announced proofs of no Siegel zeros didn't survive. What's different here is that several number theorists have rebuilt the argument themselves and reached the same conclusion. The next steps to watch for are a refereed version and a formal proof in Lean. If it holds up, expect a lot of "ineffective" constants in textbooks to become computable.

**Background you can reach now.** Davenport's *Multiplicative Number Theory* (chapters on Dirichlet $L$-functions, Siegel's theorem and the class number formula) is the standard source. You can find it through the library.

## Read more

- W. D. Banks, *On the OpenAI proof that Landau–Siegel zeros do not exist*, [arXiv:2610.15483](https://arxiv.org/abs/2610.15483) (October 11, 2026).
- B. Kerr, *A simpler proof that there are no Landau–Siegel zeros*, [arXiv:2610.21099](https://arxiv.org/abs/2610.21099) (October 15, 2026).
- [Siegel zero](https://en.wikipedia.org/wiki/Siegel_zero) on Wikipedia, for the classical background.
- On this site: [the zero-free half-plane claim](/digest/2026-10-09-zero-free-half-plane/), from the same OpenAI release.
