---
title: "Marton's conjecture, three years on"
date: 2026-11-14
summary: "The polynomial Freiman–Ruzsa conjecture was proved in November 2023 by an entropy argument, and a Lean formalization began the same month. It has since grown to the improved exponent 9 and to every bounded-torsion group, and now has a statement-checked record of six theorems."
tags: [additive combinatorics, information theory, formalization, Lean]
---

**TL;DR.** No new story this weekend could be checked against a primary source, so this entry covers a result worth knowing. Marton's conjecture, usually called the **polynomial Freiman–Ruzsa (PFR) conjecture**, says that a subset of $\mathbf{F}_2^n$ that barely grows when you add it to itself is essentially a subspace, up to a number of cosets polynomial in the growth. Gowers, Green, Manners and Tao proved it in November 2023 (arXiv:2311.05762). The proof is short and uses Shannon entropy. A collaborative Lean 4 formalization led by Tao, `teorth/pfr`, began the same month. It has since been extended, and its records now state six headline theorems from three papers in Mathlib-only terms, with no `sorry` in the proofs and only Lean's three standard axioms.

## The statement

Write $A + A = \{a + b : a, b \in A\}$. If $A$ is a subspace, then $A + A = A$. The **doubling constant** $K = |A+A|/|A|$ measures how far $A$ is from being closed under addition.

> **Theorem (GGMT 2023).** If $A \subseteq \mathbf{F}_2^n$ is non-empty and $|A + A| \le K|A|$, then $A$ is covered by at most $2K^{12}$ cosets of a subspace $H$ with $|H| \le |A|$.

The older Freiman–Ruzsa theorem in this setting puts $A$ inside a *single* subspace of size at most $F(K)|A|$, but $F$ has to be exponential in $K$. Here is the standard example. Take a subspace $V$ of dimension $d$ and $r$ vectors $e_1, \dots, e_r$ independent modulo $V$, and let $A = \bigcup_i (e_i + V)$. Then $|A| = r\,2^d$ and $A + A = V \cup \bigcup_{i<j} (e_i + e_j + V)$, so
$$K = \frac{1 + \binom r2}{r} \approx \frac r2, \qquad \frac{|\operatorname{span} A|}{|A|} = \frac{2^{r}}{r}.$$
Any one subspace containing $A$ is exponentially larger than $A$ in $K$, but $r \approx 2K$ cosets of $V$ cover it. PFR says that this is the worst that can happen, up to a polynomial.

**Try it.** I built these sets by brute force. With $d = 3$ and $r = 4, 6, 8$, and with $d = 2, r = 10$, I got $|A+A| = 56, 128, 232, 184$ and $K = 1.75, 2.67, 3.63, 4.6$, matching $(1 + \binom r2)2^d$. The span of $A$ was $4$, $10.7$, $32$ and $102.4$ times the size of $A$, which is $2^r/r$ each time.

## The proof, in one paragraph

Replace sets by random variables. For independent $G$-valued $X, Y$, the **entropic Ruzsa distance** is $d[X;Y] = \mathbf H[X - Y] - \tfrac12 \mathbf H[X] - \tfrac12 \mathbf H[Y]$, where $\mathbf H$ is Shannon entropy. If $U_A$ is uniform on $A$, then $\mathbf H[U_A] = \log|A|$ and $\mathbf H[U_A + U_A] \le \log|A+A|$, so $d[U_A;U_A] \le \log K$. The heart of the paper is an **entropy form of PFR**: for any $X_1, X_2$ there is a subgroup $H$ with
$$d[X_1;U_H] + d[X_2;U_H] \le 11\, d[X_1;X_2].$$
To prove it, minimize a functional $\tau$ (the distance $d[X_1;X_2]$ plus a small penalty for moving away from the original variables) over all pairs of distributions. A minimum exists by compactness. Entropy inequalities applied to sums like $X_1 + X_2$ and $X_1 + \tilde X_1$ then show that a minimizer must have distance $0$, and distance $0$ forces uniformity on a coset of a subgroup. Going back to sets uses the Ruzsa covering lemma: cover $A$ greedily by disjoint translates of a large piece $A \cap (H + x_0)$. That gives $K^{13/2}$ cosets up to a size adjustment, and handling the size of $H$ gives the final $2K^{12}$.

## What the formalization now contains

According to the repository's `formalization.yaml` and `PFRPalomar/Challenge.lean`, the six checked statements are:

- the theorem above, with $2K^{12}$;
- **Jyun-Jie Liao's improvement** to $2K^{9}$ (arXiv:2404.09639);
- the **bounded-torsion version** by the same four authors (arXiv:2404.02244): in any abelian group with $mx = 0$ for all $x$, at most $m K^{256 m^3 + 1}$ cosets;
- **weak PFR over $\mathbf Z^D$**, with the paper's unspecified constants made explicit: a subset of at least $K^{-34}$ of $A$ with affine dimension at most $(80/\log 2)\log K$;
- two consequences about **approximate homomorphisms** between groups of exponent 2.

The formal versions are in some ways stronger than the papers. The ambient group needn't be finite, only $A$, and every constant is explicit. The yaml file also lists what isn't formalized: the $U^3$ inverse theorems and a sum-product corollary. The entropy forms are proved in the library but aren't among the checked statements, because Mathlib doesn't yet define Shannon entropy, and the checked statements may import only Lean core and Mathlib.

**Why it's worth knowing.** PFR was one of the central open problems of additive combinatorics. Its proof brought information-theoretic methods into the field, and the formalization, done in public by two dozen contributors, shows that a new research proof can be checked in full by machine.

## Read more

- [The formalization](https://github.com/teorth/pfr), with its README, `formalization.yaml`, and `PFRPalomar/Challenge.lean`, which states the six theorems.
- The project's blueprint source (`blueprint/src/chapter/`), which gives the informal proof lemma by lemma. The chapters `pfr.tex`, `distance.tex` and `entropy_pfr.tex` cover the argument sketched above.
- Gowers, Green, Manners, Tao, *On a conjecture of Marton*, [arXiv:2311.05762](https://arxiv.org/abs/2311.05762). This is the source the repository formalizes.
