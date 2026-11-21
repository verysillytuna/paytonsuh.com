---
title: "A claimed proof of the Riemann hypothesis, in 17 million lines of Lean"
date: 2026-11-21
summary: "On November 20 Levent Alpöge released a Lean 4 project that he says proves the Riemann hypothesis and GRH for Dirichlet L-functions. Independent kernel checks reported so far accept it, using only Lean's three standard axioms. Here is what that does and doesn't establish, and what the formal statements actually say."
tags: [number theory, Riemann hypothesis, L-functions, Lean, formalization]
---

**TL;DR.** On November 20, 2026, Levent Alpöge released a short note and a Lean 4 project of about 175,000 files that, he says, proves the **Riemann hypothesis** and the **Generalized Riemann Hypothesis for Dirichlet L-functions**. Repository descriptions say he worked with Anthropic's model Claude. Within a day several groups had compiled it and replayed it through independent proof checkers. The public reports so far accept all five main theorems, with only Lean's three standard axioms. This is still a **claim**. The end-to-end checks are still running, and no mathematician has yet explained the argument in human terms. A machine check of this size is also new territory. Below: exactly what was stated, what the checks cover, and what is still open.

## What is claimed

The project's `Main.lean` has five theorems, each a single line pointing into the rest of the code:

```lean
theorem riemannHypothesis : RiemannHypothesis := rhOfAll
theorem riemannZeta_eq_zero_re : RiemannZetaZerosOnLine := rhOfAll
theorem LFunction_ne_zero_of_half_lt_re : DirichletLNonvanishingRightOfHalf := allChi
theorem LFunction_eq_zero_re : DirichletLZerosOnLine := claimAll.2.1
theorem LFunction_eq_zero_re_of_isPrimitive : PrimitiveDirichletLZerosOnLine := critAll
```

The first uses **Mathlib's own** definition, which predates this project:

```lean
/-- A formal statement of the **Riemann hypothesis** – constructing a term of this type is worth a
million dollars. -/
def RiemannHypothesis : Prop :=
  ∀ (s : ℂ) (_ : riemannZeta s = 0) (_ : ¬∃ n : ℕ, s = -2 * (n + 1)) (_ : s ≠ 1), s.re = 1 / 2
```

In words: every zero of $\zeta(s)$ other than the trivial zeros $-2, -4, -6, \dots$ has real part $\tfrac12$. (The hypothesis $s \neq 1$ is there because Mathlib gives $\zeta$ a junk value at its pole.)

The other four statements live in a 16-line file that imports only Mathlib. The strongest says that for every modulus $N$, every Dirichlet character $\chi$ mod $N$, and every $s$ with $\operatorname{Re} s > \tfrac12$,
$$
L(\chi, s) \neq 0,
$$
except for the trivial character at its pole $s = 1$. With the functional equation, that puts every zero in the critical strip $0 < \operatorname{Re} s < 1$ on the line $\operatorname{Re} s = \tfrac12$. So "GRH" here means Dirichlet L-functions only, not every L-function. That case is already the one behind the classical applications: primes in arithmetic progressions with square-root error terms, and a deterministic polynomial-time version of the Miller primality test.

## Why a computer check matters here, and what it does not tell you

A Lean proof is checked by a small **kernel**. If the kernel accepts the proof term and the statement means what you think, then the theorem follows from the axioms. Nothing the project's 1.06 million declarations say can change that. So a reader who accepts the checks only has to trust three things:

1. Mathlib's definitions of `riemannZeta` and `RiemannHypothesis` (plus, for the L-function theorems, the four short definitions quoted in the mirrors);
2. the kernel, or one of the independent checkers that re-run it;
3. the axioms `propext`, `Classical.choice`, and `Quot.sound`.

That's why the checking has moved so fast. Nobody needs to read 17.4 million lines; they need to rebuild them and replay the kernel. According to the verification repositories, by November 21:

- Andrew Sutherland (MIT) reported that all 175,187 modules compile, that `#print axioms` lists only the three standard axioms for all five theorems, and that `leanchecker`, the Rust kernel `nanoda`, `con-leche`, and `lean4lean` accept the proof. The `lean4lean` run needed a raised step limit on five modules.
- At least three other teams reported separate builds or replays that matched (the-omega-institute summarizes them with links).
- A text scan of the source finds no `sorry`, `axiom`, `native_decide`, `implemented_by`, or `unsafe`.
- The full end-to-end **Comparator** run was still in progress. It checks that the proved statements are exactly the Mathlib-only ones and replays them through four kernels at once.

What the checks don't give is **understanding**. The source has no comments. The top of the proof reduces RH to non-vanishing of every Dirichlet $L(\chi, s)$ for $\operatorname{Re} s > \tfrac12$, using only Mathlib. That non-vanishing comes from a 12-million-line library of automorphic and arithmetic-geometric machinery. Its names include theta correspondences, a "Weil bound," and étale cohomology, and it reproves results like Deligne–Ribet from scratch rather than assuming them. Whether there is a short human proof inside, and which idea makes it work, is the question people are now working on. Until a referee-level human account exists, the honest summary is "formally verified, if the checks hold up, but not yet understood."

## Things to watch

- **The Comparator result.** It's the cleanest single answer to "does this exact Mathlib-only statement have a kernel-accepted proof?" A known limit: it can't detect a modified Mathlib, so the build has to pin Mathlib's official release (the projects pin it to `v4.33.1`).
- **A human-readable account.** People have started writing guides to the formalization (linked below). They're unrefereed, so read them as reading aids, not as verification.
- **Spillover.** If it holds, every theorem "conditional on GRH" for Dirichlet L-functions becomes unconditional. Expect a wave of papers removing that hypothesis.

## Read more

These are the sources this entry is based on. The author's note is at [alpo.ge/remark.pdf](https://alpo.ge/remark.pdf); I couldn't open it from here, so its contents are described from the mirrors.

- [tamnd/riemann-lean](https://github.com/tamnd/riemann-lean): a byte-for-byte mirror of the release with source hashes, the five theorems, and [a structure guide](https://github.com/tamnd/riemann-lean/blob/main/docs/STRUCTURE.md) (library sizes, the top of the proof).
- [Hertaspace/alpoge-rh-lean-verification](https://github.com/Hertaspace/alpoge-rh-lean-verification): an independent build and axiom check, with step-by-step instructions and a clear explanation of the trust base.
- [the-omega-institute/riemann-hypothesis](https://github.com/the-omega-institute/riemann-hypothesis): a table of public kernel-replay results with links to each team's logs, plus the Comparator setup and its limits.
- [leanprover-community/riemann-hypothesis, verification notes](https://github.com/leanprover-community/riemann-hypothesis/blob/6b1e1b8e9d683841024757f158fda63a32bbeae7/verification/NOTES.md): the upstream Comparator run (in progress when I read it).
- Background: Mathlib's [`RiemannZeta.lean`](https://github.com/leanprover-community/mathlib4/blob/master/Mathlib/NumberTheory/LSeries/RiemannZeta.lean), where `RiemannHypothesis` is defined.
