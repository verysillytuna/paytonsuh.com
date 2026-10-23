---
title: "Thompson's group F is nonamenable, an OpenAI paper claims"
date: 2026-10-20
summary: "One of the results in OpenAI's October 6 release says it settles a 1979 conjecture of Geoghegan: Thompson's group F has no invariant mean. The proof is short, it has a Lean formalization, and a human-written exposition by Kim and Lodha appeared on the arXiv on October 13."
tags: [group theory, AI and mathematics, formal verification]
---

**TL;DR.** Whether Thompson's group $F$ is amenable has been one of the best-known open questions in group theory since the 1970s. In the [repository OpenAI released on October 6](https://github.com/openai/math) (covered here on [October 8](/digest/2026-10-08-openai-math-catalog)), result family 248 is a short paper, *Thompson's group $F$ is nonamenable* (dated September 23, 2026), which proves Geoghegan's 1979 conjecture that the answer is **no**. The repository lists a Lean formalization of the full statement. On October 13 Sang-hyun Kim and Yash Lodha posted *A note on the proof of nonamenability of $F$* ([arXiv:2610.18360](https://arxiv.org/abs/2610.18360)), a human-written exposition of the argument. Nothing has been refereed yet.

## The group

$F$ is the group of increasing piecewise-linear homeomorphisms of $[0,1]$ with finitely many pieces, breakpoints at dyadic rationals, and every slope a power of $2$. One of its two standard generators is

$$
x_0(t) = \begin{cases} t/2, & 0 \le t \le 1/2,\\ t - 1/4, & 1/2 \le t \le 3/4,\\ 2t - 1, & 3/4 \le t \le 1,\end{cases}
$$

with slopes $1/2, 1, 2$ and breakpoints $1/2, 3/4$. The group is finitely presented and very well understood, yet the amenability question resisted decades of attempts.

## Why the question was hard

A group $G$ is **amenable** if there is a finitely additive, translation-invariant "average" of bounded functions on $G$. Equivalently (Følner), for every finite set $S$ of group elements and every $\varepsilon > 0$ there is a finite set $A$ that barely moves under left multiplication: $|hA \,\triangle\, A| < \varepsilon |A|$ for all $h \in S$. Abelian groups are amenable. Free groups are not.

The usual way to prove nonamenability is to find a free subgroup on two generators, and that is unavailable here: Brin and Squier showed $F$ has no such subgroup. On the other side, $F$ is not *elementary* amenable (it can't be built from finite and abelian groups by the standard operations), so the easy proofs of amenability fail too. There is also a history of announced solutions in both directions that didn't hold up. The paper itself recounts Shavgulidze's amenability claim, the errors Justin Moore identified in it, and Moore's own amenability preprint, which he withdrew after Akhmedov found an error.

## The idea of the proof

As I read the paper's introduction and Section 2, the argument is a contradiction built from three pieces:

1. **A map with no approximate fixed points.** In an infinite-dimensional Hilbert space there is a Lipschitz map $f$ of the closed unit ball into itself that moves every point by at least a fixed $\delta > 0$ (a theorem of Benyamini and Sternfeld; the paper's appendix builds one explicitly on $L^2([0,1];\mathbb{R}^2)$ with $\delta = 1/2$). In finite dimensions Brouwer's theorem forbids this.
2. **Colors on dyadic partitions.** Choose $D$ separated dyadic "parent" intervals, with an affine copy of the same pattern inside each parent. Assign each finite dyadic partition of $[0,1]$ a vector in the ball, recursively: apply $f$ to the average of the colors of its restrictions to the parents. This is where the self-similarity of $F$ is used.
3. **Averaging over a Følner set.** If $F$ were amenable, averaging these colors over a nearly invariant finite set $A$ would make all the correlations between separated intervals nearly equal, because $F$ can carry any separated pair of dyadic intervals onto any other. Expanding a sum of squares then shows that the average color $m$ is nearly a fixed point of $f$: $\|m - f(m)\|^2$ is at most a constant times $L^2(1/D + \eta)$, where $L$ is the Lipschitz constant and $\eta$ measures how far $A$ is from invariant. Taking $D$ large and $\eta$ small contradicts the lower bound $\delta^2$.

So $F$ has a uniform positive Følner boundary bound, and is not amenable. The paper's main argument is about seven pages, with the explicit Benyamini–Sternfeld map in an appendix.

## What has been checked

- **Lean.** The repository's [formalization page for result 248](https://github.com/openai/math/blob/main/lean/docs/248.md) says the formal statement rules out a positive, normalized, left-invariant mean on bounded real functions for the standard dyadic PL group. I read the [statement file](https://github.com/openai/math/blob/main/lean/ComparatorChallenges/ThompsonNonamenability.lean): it defines $F$ from scratch (dyadic breakpoints, slopes $2^k$, composition as the group law) and defines invariant means directly, so there is little room for the statement to say something weaker than it should. The proof file it points to exists in the repository. I didn't run the checker myself.
- **People.** Kim and Lodha's note is the first human-written account on the arXiv. I saw only its listing, not the paper. Reports also mention an essay by Moore on his experience with the problem, which I haven't read.

## Consequences the paper records

Because $F$ is now nonamenable, known results for nonamenable groups apply to it. Section 3 lists two: $F$ has uniformly bounded representations on Hilbert space that can't be made unitary, and Bernoulli percolation on any of its Cayley graphs has a nonempty phase with infinitely many infinite clusters ($p_c < p_u$).

## Why it's worth knowing

For a student who has just met group actions, $F$ is a good example of how far "concrete" is from "understood": anyone can write down $x_0$, and the question of whether its group has an invariant average stayed open for almost fifty years. The proof's key move, turning an averaging argument into an approximate fixed point and then using a map that has none, is a technique worth remembering. Treat the result as a claim until referees and specialists weigh in. The formalization makes it far more credible than an unchecked announcement.
