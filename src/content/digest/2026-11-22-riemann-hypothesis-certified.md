---
title: "Lean's maintainers certify the Riemann hypothesis proof. What that certifies"
date: 2026-11-22
summary: "A day after Levent Alpöge released a 17-million-line Lean proof of the Riemann hypothesis, the Lean FRO and the Mathlib Initiative issued a joint statement certifying that the statement and the proof are correct. Here is what each of their four checks covers, and the one thing no check can give: an explanation."
tags: [number theory, Riemann hypothesis, Lean, formalization]
---

**TL;DR.** On November 21, 2026, the Lean FRO and the Mathlib Initiative published a [joint statement](https://leanprover-community.github.io/blog/posts/riemann-hypothesis/). (It first appeared under the byline "Lean and Mathlib communities"; on November 23 the Mathlib maintainers changed it, to avoid attributing it to the communities as a whole.) It says they have "full confidence" that Levent Alpöge's Lean proof of the **Riemann hypothesis**, released the day before, is correct. The end-to-end statement comparison that was still running on November 21 has now finished, and two independent tools agree. Formally, this is about as strong a verdict as a proof can get. It still isn't understanding. Nobody has yet given a human account of why the 17-million-line argument works.

## The four checks

The statement certifies four things. Each answers a different way a "formal proof" could fail.

1. **The statement is the right one.** The theorem proved is Mathlib's own `RiemannHypothesis`, written before this project and vetted by Lean users and number theorists. In words: every zero of $\zeta(s)$ other than the trivial zeros $-2, -4, -6, \dots$ has real part $\tfrac12$.
2. **The library compiles.** Dozens of people built it and got the same proof export file.
3. **The code proves that statement, not a look-alike.** The community wrote a short file that states the theorems and imports only Mathlib. Two independent tools, `comparator` and `con-leche --compare`, confirm that the theorem in Alpöge's library is exactly that statement. This step matters because a large project could, in principle, redefine $\zeta$ or $\tfrac12$ along the way.
4. **The proof is valid.** The exported proof was replayed by Lean's own kernel and by several independent checkers written in other languages. Two of them, `con-leche` and `con-ron`, come with a formal proof, relative to set theory, that they can't accept a false proof. These checks ran on an inert export of the proof, so nothing in the 175,000 source files could interfere with them.

The axiom audit lists only Lean's three standard axioms (`propext`, `Classical.choice`, `Quot.sound`) for each of the five headline theorems. The other four theorems give **GRH for Dirichlet L-functions**: for every modulus and every character, $L(\chi, s) \neq 0$ when $\operatorname{Re} s > \tfrac12$. Dedekind zeta functions and other L-functions are not covered.

## What "certified" leaves open

- **Why it's true.** The source has no comments. The top of the proof is the classical step: GRH for Dirichlet L-functions, plus the functional equation, gives RH. Below that, roughly 12 million lines of automorphic and arithmetic-geometric machinery prove the non-vanishing. The statement ends: "We look forward to all the activity in the mathematical community that will help explain the new ideas in this proof." That's now the main open problem around the result.
- **Clean-up.** The community repository has started removing files the proof doesn't use and shortening proofs. The unmodified original is kept on its own branch, so every check above can still be run against exactly what was published.
- **Refereeing in the usual sense.** No journal has reviewed a human write-up, because there isn't one yet. Unrefereed guides to the formalization have begun to appear (one is linked below). Read them as maps of the code, not as proofs.

For a student, the immediate consequence is the long list of theorems proved "assuming GRH" for Dirichlet L-functions. They include square-root error terms for primes in arithmetic progressions and the deterministic Miller primality test. If the checks hold, all of them are now unconditional.

## Read more

I read the statement's source in the [leanprover-community blog repository](https://github.com/leanprover-community/blog) and the two verification repositories below. I couldn't open Alpöge's own note, [alpo.ge/remark.pdf](https://alpo.ge/remark.pdf), from here.

- [Lean verification of the Riemann Hypothesis](https://leanprover-community.github.io/blog/posts/riemann-hypothesis/): the joint statement, with the four criteria.
- [leanprover-community/riemann-hypothesis](https://github.com/leanprover-community/riemann-hypothesis): the community copy, the Mathlib-only statement file, and how to run `lake comparator` yourself. Its [verification notes](https://github.com/leanprover-community/riemann-hypothesis/blob/main/verification/NOTES.md) give the size, a static scan, and a hand reading of the statements.
- [the-omega-institute/riemann-hypothesis](https://github.com/the-omega-institute/riemann-hypothesis): a table of public kernel replays with links to each team's logs, and a link to an unrefereed companion guide.
- Background: Mathlib's [`RiemannHypothesis`](https://github.com/leanprover-community/mathlib4/blob/master/Mathlib/NumberTheory/LSeries/RiemannZeta.lean).
