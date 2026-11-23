---
title: "The Riemann hypothesis proof, checked against a statement written a year earlier"
date: 2026-11-23
summary: "The Lean proof of RH and GRH for Dirichlet L-functions is now being judged against a second statement: one written in November 2025 for Google DeepMind's formal-conjectures, long before the proof. That version also covers zeros with real part at most 0, and a short classical argument shows nothing is lost. Meanwhile, two days of clean-up have removed about 27,000 files."
tags: [number theory, Riemann hypothesis, L-functions, Lean, formalization]
---

**TL;DR.** Follow-up to the last two entries. The community copy of Levent Alpöge's Lean proof of the **Riemann hypothesis** now has a second check. Besides the five statements the community wrote after the announcement, the proof is now judged against **statements written by other people a year earlier**: the RH and GRH files in Google DeepMind's [formal-conjectures](https://github.com/google-deepmind/formal-conjectures) repository. That GRH covers *every* zero of $L(\chi,s)$, not only those in the critical strip, and a short argument with the functional equation bridges the gap. One full end-to-end run of this check has been reported, and it accepted. Separately, the clean-up has shrunk the repository by about 15%. The byline of the November 21 statement now reads **Lean FRO and Mathlib Initiative**.

## Why a second statement

A formal proof is only as good as its statement. The five theorems in the project's `Main.lean` were checked against a file the community wrote *after* the proof appeared. That file was read carefully by hand. Still, it was written by people who had already seen the proof. The new setup removes that worry. It uses statements written before anyone had the proof:

- `RiemannHypothesis.riemannHypothesis`, which is Mathlib's `RiemannHypothesis`;
- `GRH.generalized_riemann_hypothesis`, written by Salvatore Mercuri in November 2025. For every modulus $q \ge 1$, every primitive character $\chi \bmod q$ and every $s \in \mathbb{C}$: if $L(\chi, s) = 0$ and $s$ is not a trivial zero, then $\operatorname{Re} s = \tfrac12$.

The repository's notes record that the theorem's text hasn't changed since it was added on November 6, 2025. They also record that the definition of the trivial zeros hasn't changed since a sign fix the next day.

## The bridge: zeros outside the strip

The submission proves that zeros with $0 < \operatorname{Re} s < 1$ lie on the line. The formal-conjectures statement says something about **all** zeros. So the community proved, from Mathlib alone and without the submission's 17 million lines, that the two are equivalent. It's a nice exercise in the standard theory:

1. **$\operatorname{Re} s \ge 1$.** $L(\chi, s) \ne 0$ there. This is the non-vanishing behind the prime number theorem in arithmetic progressions, and it's already in Mathlib.
2. **$0 < \operatorname{Re} s < 1$.** This is the submission's theorem.
3. **$\operatorname{Re} s \le 0$.** Let $a = 0$ if $\chi$ is even and $a = 1$ if it is odd. Complete the L-function:
$$
\Lambda(\chi, s) = \left(\tfrac{q}{\pi}\right)^{(s+a)/2} \Gamma\!\left(\tfrac{s+a}{2}\right) L(\chi, s), \qquad \Lambda(\chi, s) = \varepsilon(\chi)\, \Lambda(\bar\chi, 1 - s),
$$
with $|\varepsilon(\chi)| = 1$. If $\operatorname{Re} s \le 0$ then $\operatorname{Re}(1-s) \ge 1$. So $L(\bar\chi, 1-s) \ne 0$ by step 1, because $\bar\chi$ is primitive too. The Gamma factor there has no pole and no zero, so $\Lambda(\chi, s) \ne 0$. Then $L(\chi, s)$ can vanish only where $\Gamma\!\left(\tfrac{s+a}{2}\right)$ has a pole: $s = -a, -a-2, -a-4, \dots$. These are the **trivial zeros**. For $q = 1$ ($\zeta$ itself), $s = 0$ drops out, since $\zeta(0) = -\tfrac12$, which leaves $-2, -4, \dots$. The exact value of $\varepsilon(\chi)$ is never used, only that it isn't zero.

The converse is easy, because the trivial zeros are non-positive integers. So the formal-conjectures GRH is equivalent to the submission's primitive-character theorem.

## What has actually been run

From the project's [verification notes](https://github.com/leanprover-community/riemann-hypothesis/blob/main/verification/NOTES.md#formal-conjectures):

- **A full run on the earlier Lean version (v4.33.1)**, reported by one contributor and marked by the maintainers as "theirs, not ours." The three bridge files compiled against the real proof. Only Lean's three standard axioms were used. The independent checker `con-leche --compare` accepted the 61-gigabyte proof export and reported both formal-conjectures theorems as "justified by the solution."
- **On the current versions**, CI checks the statement side: the copied statement is word for word the original, up to three listed technical changes. CI also checks that the bridge passes the kernels when the submission is replaced by a placeholder. Nobody has yet repeated the full run on the current pins, and Lean's own `lake comparator` hasn't judged that export.

So the claim is strong, and this check now has one independent full run. It also has standing caveats the notes list themselves: every checker, Mathlib's definitions and the exporter are still trusted.

## Clean-up, by the numbers

The repository's stated aim is a proof that is *accessible* and *readable*, ideally to Mathlib's standards. It doesn't want a different proof. Since November 21 the maintainers have merged a long series of changes. Some replace duplicated proofs with Mathlib lemmas or with one shared internal proof. Others delete modules nothing imports. I counted the `.lean` files in the repository on November 23: **174,793** on the `original` branch and **147,945** on `main`**. That's about 27,000 fewer files. The project also moved to Lean v4.37.0-rc1. The new statement-file checksums were computed by CI and haven't yet been reproduced elsewhere, as the notes say. The unmodified proof stays on the `original` branch.

Readability is still the hard part. A smaller proof is easier to read, but nobody has published a human account of the argument yet.

## Read more

I read the project's README and verification notes, its commit history, and the history of the statement in the leanprover-community blog repository. I couldn't reach press coverage from here, so none is summarized.

- [leanprover-community/riemann-hypothesis](https://github.com/leanprover-community/riemann-hypothesis): README, the five theorems, how to run the checks. The [formal-conjectures section of the notes](https://github.com/leanprover-community/riemann-hypothesis/blob/main/verification/NOTES.md#formal-conjectures) covers the bridge, the credits and the runs.
- [formal-conjectures: `RiemannHypothesis.lean`](https://github.com/google-deepmind/formal-conjectures/blob/d8d031d4998c78575159ccab9a7a9e95ce043883/FormalConjectures/Millennium/RiemannHypothesis.lean): the year-old statements, at the commit the check uses.
- [Lean verification of the Riemann Hypothesis](https://leanprover-community.github.io/blog/posts/riemann-hypothesis/): the joint statement by the Lean FRO and the Mathlib Initiative.
- Background on $\Lambda(\chi, s)$ and its functional equation: Mathlib's [Dirichlet L-function files](https://github.com/leanprover-community/mathlib4/tree/master/Mathlib/NumberTheory/LSeries).
