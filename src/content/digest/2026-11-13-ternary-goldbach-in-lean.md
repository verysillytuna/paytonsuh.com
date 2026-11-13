---
title: "Ternary Goldbach, checked in Lean"
date: 2026-11-13
summary: "Helfgott's 2013 proof that every odd number above 5 is a sum of three primes now has a complete Lean formalization, conditional on two published computations. Formalizing it turned up a handful of small errors in the published proof, all repaired."
tags: [number theory, analytic number theory, formalization, Lean]
---

**TL;DR.** The ternary (weak) Goldbach conjecture says every odd integer $n > 5$ is a sum of three primes. Harald Helfgott proved it in 2013, in a book-length preprint. This week a Lean 4 formalization of that proof, by Charlie Reams with Helfgott, reached a state with no `sorry` and only Lean's three standard axioms. It is **conditional**: it takes two published numerical results as explicit hypotheses, Platt's verification of GRH up to a fixed height for small conductors and Oliveira e Silva, Herzog and Pardi's check of binary Goldbach up to $4 \cdot 10^{18}$. On Nov 13 the authors recorded the first full build of the current version. The current statement hasn't been through Comparator, the independent statement checker; an earlier version with four hypotheses passed it on Nov 6.

## The shape of the proof

Helfgott's proof is the Hardy–Littlewood circle method made fully explicit. Write $n$ as a sum of three primes by counting: the number of representations is an integral of $S(\alpha)^3 e(-n\alpha)$ over $\alpha \in [0,1]$, where $S(\alpha)$ is a smoothed sum of $e(p\alpha)$ over primes. Near rationals with small denominator (the **major arcs**) $S$ is large and you can compute it, using the zeros of Dirichlet $L$-functions. Elsewhere (the **minor arcs**) you need an upper bound that is small enough. Vinogradov showed in 1937 that this works for all sufficiently large $n$. The problem was that "sufficiently large" was astronomically large. Helfgott's contribution was bounds sharp enough to bring the threshold down to about $10^{27}$.

Below that threshold, the proof is a computation, and it reduces to binary Goldbach in an elementary way:

- If every even number in $[4, N]$ is a sum of two primes, then every odd $n$ with $5 < n \le N + 3$ is a sum of three: take $3$ plus a representation of $n - 3$.
- To go beyond $N$, use a **prime ladder**: a list of primes $p_1 < p_2 < \dots$ up to $10^{27}$ with consecutive gaps below $N - 4$. For odd $n$ in range, some rung $p$ has $4 \le n - p \le N$, and $n - p$ is even, so it is a sum of two primes.

In the formalization, $N = 4 \cdot 10^{18}$ comes from the published binary Goldbach computation. The ladder is not assumed. It is about $2.5 \cdot 10^8$ Proth primes of the form $c = k \cdot 2^{45} + 1$, each certified by the condition $3^{(c-1)/2} \equiv -1 \pmod c$. That condition forces every prime factor of $c$ to be $\equiv 1 \pmod{2^{45}}$, and since $c < (2^{45}+1)^2$, $c$ must be prime. The Lean kernel checks all the rungs itself. The README estimates about five hours on one core.

## What formalizing it found

The repository lists errors in the sources, each with a repair. Two examples:

- **An integral bound in the minor-arc estimates is false at a small parameter.** The README computes the exact value $\int_1^4 T_2(S)\,dS/S = (\log 2 - \tfrac12) + \tfrac12\log\tfrac32 + \tfrac13\log\tfrac43 + \tfrac1{24} \approx 0.53344$. The published bound claims at most $0.37273 \log 4 \approx 0.51671$. (I checked both numbers.) The formalization proves a corrected bound with an additive constant $0.0231$. The final minor-arc total still comes out as published, because there was room elsewhere.
- **A lemma from Ramaré (1995) that Helfgott cites has a false step:** a product over primes claimed to be at most $8$ is already about $8.08$ over the primes below $10^7$. The lemma itself is proved in Lean by a route that avoids that step.

None of these breaks the theorem. Each was a gap of a few percent in a constant, absorbed by slack elsewhere. That is typical of what explicit, constant-heavy proofs look like under formalization, and it's the main reason to do it.

## What "conditional" means here

The two hypotheses are large computations, run on computers years ago and published in *Mathematics of Computation*. They're stated in Lean as plain propositions, so anyone can read exactly what is assumed. Everything else, including the explicit prime-counting bounds that Helfgott's book cites from Rosser–Schoenfeld and others, is proved inside the development or checked by the kernel. The repository says it uses no `native_decide`, a tactic that would trust compiled code.

**Try it.** Binary Goldbach for small even numbers is easy to check. I sieved the primes up to $10^6$. Every even $n$ in $[4, 10^6]$ is $p + q$ with $p \le 523$, and the largest prime gap below $10^6$ is $114$. In the real proof, the gap bound is what lets the ladder make up for verifying binary Goldbach only up to $4 \cdot 10^{18}$.

## Read more

- [The formalization](https://github.com/calr3/ternary-goldbach) (Charlie Reams and Harald Helfgott). The README explains the status and the trust base. `Challenge.lean` states the main theorems with Mathlib-only definitions, and `HYPOTHESES.md` lists the two assumptions and every error found in the sources.
- Helfgott, *The ternary Goldbach problem*, arXiv:1501.05438. This is the version the formalization follows; it's cited in the repository.
