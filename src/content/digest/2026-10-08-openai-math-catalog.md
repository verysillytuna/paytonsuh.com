---
title: 'OpenAI posts 372 result families at once'
date: 2026-10-08
summary: 'An internal model’s 719 manuscripts claim the quasi-Riemann hypothesis, ω ≤ 9/4, the free group factor problem, and much more. A day later, three papers were withdrawn.'
tags: [AI and mathematics, number theory, combinatorics, operator algebras]
---

**TL;DR.** On Tuesday, October 6, OpenAI published a public repository of mathematics written by an unreleased internal model: 719 manuscripts grouped into 372 "result families" across 16 areas. Press coverage rounded this to "more than 300 problems." Some claims would be among the biggest results in decades if they hold. About 42% of the top-line results come with Lean formalizations. On Wednesday, three manuscripts were withdrawn over a sign error. Nothing here has been refereed yet.

## What was released

The repository is [github.com/openai/math](https://github.com/openai/math). Its README says the model was posed about 4,000 open problems, each result used on average about three hours of "ChatGPT Pro thinking compute," and only results judged significant enough were kept. Two results were produced outside that fixed procedure, and one write-up (a zero-free region for $\zeta$) was edited by people for readability. The [overview PDF](https://github.com/openai/math/blob/main/overview.pdf) describes every family. The [manuscript map](https://github.com/openai/math/blob/main/CONTENTS.md) lists every paper with its abstract.

## The headline claims

Each of these is a claim from the catalog, not an established theorem.

- **Quasi-Riemann hypothesis (family 003).** Every Dirichlet $L$-function, $\zeta(s)$ included, has no zeros with $\operatorname{Re} s > 7/8$. Until now nobody could rule out zeros in *any* fixed half-plane $\operatorname{Re} s > 1 - \delta$. The Riemann hypothesis itself would push the line to $1/2$.
- **Matrix multiplication (107).** $\omega \le 9/4$. The best published bound before this was about $2.371$.
- **The irrationality exponent of $\pi$ is 2 (017).** For every $\varepsilon > 0$, $|\pi - p/q| \ge q^{-2-\varepsilon}$ for all large $q$. The previous upper bound was about $7.1$. A consequence: the Flint Hills series $\sum 1/(n^3 \sin^2 n)$ converges.
- **Erdős's conjecture on arithmetic progressions (159).** Every set of positive integers whose reciprocals sum to infinity contains arbitrarily long arithmetic progressions, via quasipolynomial bounds in Szemerédi's theorem.
- **Free group factors (287).** $L(\mathbb{F}_2) \cong L(\mathbb{F}_3)$, settling an operator-algebra question that goes back to Murray and von Neumann. By Dykema and Rădulescu, the interpolated free group factors are either all isomorphic or pairwise non-isomorphic, so this picks the first option.
- **Kaplansky's zero-divisor conjecture is false (196).** A torsion-free group $G$ with zero divisors in $\mathbb{F}_2[G]$. Gardam disproved the related *unit* conjecture in 2021.

## The first correction

The repository's [history](https://github.com/openai/math/blob/main/history.md) for October 7 records that a sign error in "Algebraicity of Weil classes on split abelian eightfolds" broke an argument that two other papers depended on. All three were withdrawn: the eightfolds paper, a Kuga–Satake paper, and one on the rational Hodge conjecture for products of K3 surfaces. Fourteen more manuscripts were revised with proof repairs. This is the right response to an error. It also shows why a Lean proof, or a referee, matters more than the number of papers.

## How mathematicians are reacting

Reactions are mixed. [Scientific American](https://www.scientificamerican.com/article/openai-unleashes-hundreds-more-math-results-upon-a-field-already-in-shock/) reports on the verification burden: checking this much work will take months. It also asks whether the proofs contain new ideas or mostly recombine known techniques. [Fortune](https://fortune.com/2026/10/07/openai-math-controversy-solutions-370-outstanding-challenges-published-criticisms-celebration/) covers both the celebration and the criticism. The independent advisory group of mathematicians hosted at the Institute for Advanced Study, which OpenAI consulted, said in coverage that its involvement was not an endorsement. The [Washington Post](https://www.washingtonpost.com/technology/2026/10/07/openai-releases-progress-more-than-300-math-research-problems/) and [Engadget](https://www.engadget.com/2279815/openai-just-posted-hundreds-more-results-on-major-math-problems/) have overviews. For background on the run-up, see [Quanta on the Erdős problems](https://www.quantamagazine.org/why-the-legendary-erdos-problems-are-falling-to-ai-20260803/).

## If you read one thing

Start with family 017, on $\pi$. The statement needs only continued fractions and Diophantine approximation, and the repository includes an [abridged summary of the model's reasoning](https://github.com/openai/math/blob/main/reasoning_traces/irrationality-exponent-of-pi.pdf). Read it next to the paper and ask where the new idea is.
