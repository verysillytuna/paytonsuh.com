---
title: "Fuglede's conjecture: tiles, spectra, and a claimed planar counterexample"
date: 2026-11-27
summary: "Fuglede asked in 1974 whether a region admits an orthogonal basis of exponentials exactly when it tiles space by translations. Tao broke one direction in dimension 5, later work pushed counterexamples down to dimension 3, Lev and Matolcsi proved it for convex bodies, and a July 2026 preprint claims both directions fail in the plane."
tags: [harmonic analysis, combinatorics, counterexamples]
---

**TL;DR.** Nothing new broke in the last day or two that this digest hasn't covered (the Riemann hypothesis claim had three entries, Nov 21–23), so here is a problem with a recent claim worth knowing. **Fuglede's conjecture** says a bounded region of $\mathbb{R}^n$ has an orthogonal basis of exponential functions exactly when it tiles $\mathbb{R}^n$ by translations. It is false in every dimension $n \ge 3$ and true for convex bodies. A July 2026 preprint by Tao Zhang claims both directions fail in dimension 2. That is a preprint, not yet refereed. Dimension 1 is still open.

## The problem

Let $\Omega \subset \mathbb{R}^n$ be bounded and measurable with positive measure. For $\lambda \in \mathbb{R}^n$ write $e_\lambda(x) = e^{2\pi i \langle \lambda, x\rangle}$.

- $\Omega$ is **spectral** if some set $\Lambda \subset \mathbb{R}^n$ makes $\{e_\lambda : \lambda \in \Lambda\}$ an orthogonal basis of $L^2(\Omega)$. Then $\Lambda$ is a **spectrum**.
- $\Omega$ **tiles by translations** if some set $T$ makes the translates $\Omega + t$, $t \in T$, cover $\mathbb{R}^n$ with overlaps of measure zero.

> **Fuglede's conjecture (1974).** $\Omega$ is spectral if and only if it tiles $\mathbb{R}^n$ by translations.

The model case is the unit cube $[0,1)^n$. It tiles with $T = \mathbb{Z}^n$, and $\Lambda = \mathbb{Z}^n$ is a spectrum: that is just the statement that Fourier series form an orthonormal basis.

## A one-dimensional example to try

Take $\Omega = [0,1) \cup [2,3)$. It tiles $\mathbb{R}$ with $T = \{0, 1\} + 4\mathbb{Z}$. A spectrum is $\Lambda = \{0, \tfrac14\} + \mathbb{Z}$.

Orthogonality is a short computation. $\langle e_\lambda, e_\mu \rangle_{L^2(\Omega)}$ is the Fourier transform of $1_\Omega$ at $\mu - \lambda$, and

$$\widehat{1_\Omega}(\xi) = \widehat{1_{[0,1)}}(\xi)\,\bigl(1 + e^{-4\pi i \xi}\bigr).$$

The first factor vanishes at every nonzero integer. The second vanishes at $\xi \in \tfrac14 + \tfrac12\mathbb{Z}$, which covers the differences $\pm\tfrac14 + k$. (Checking completeness is a good exercise: think of $L^2(\Omega)$ as pairs of functions on $[0,1)$.)

The pattern behind it: $\Omega = A + [0,1)$ with $A = \{0, 2\}$, and the $2 \times 2$ matrix $\bigl(e^{2\pi i a b}\bigr)_{a \in A,\, b \in \{0, 1/4\}}$ has orthogonal rows. Most counterexamples start from that finite picture.

## How it broke

The first counterexample came from finite groups. In a finite abelian group $G$, a tile $A$ must have $|A|$ dividing $|G|$, since disjoint translates of $A$ cover $G$. Spectra have no such constraint. Tao (2004) found a spectral set of **6 points in $(\mathbb{Z}/3\mathbb{Z})^5$**. Since $6 \nmid 3^5 = 243$, it can't tile. He then lifted it to a finite union of unit cubes in $\mathbb{R}^5$ that is spectral and does not tile. The first version of his paper worked in dimension 12, from real Hadamard matrices.

Later work brought counterexamples down to dimension 3, and found tiles that are not spectral too. Google DeepMind's [formal-conjectures file](https://github.com/google-deepmind/formal-conjectures/blob/f606af160664c5a10952e9a957b100a1cd45bbeb/FormalConjectures/Wikipedia/Fuglede.lean) records the conjecture as `research solved` (false) for every $n \ge 3$ and `research open` for $n = 1$ and $n = 2$.

## The positive side

Lev and Matolcsi (2022, *Acta Mathematica*) proved the conjecture for **convex bodies in every dimension**: a convex spectral body must be a polytope, and it tiles. So any counterexample has to be non-convex.

## The 2026 claim in the plane

Zhang's preprint (arXiv, July 17, 2026) constructs two explicit 60-point subsets of $\mathbb{Z}_{60} \times \mathbb{Z}_{12}$: one tiles but has no spectrum, the other is spectral but doesn't tile. A transference principle lifts each to a finite union of unit squares in $\mathbb{R}^2$. If it holds up, dimension 1 is the only case left. A 2026 preprint on cyclic groups of square-free order cites Zhang's construction, but I found no published specialist assessment, so this is a claim until refereed.

## Why look at it

- The divisibility obstruction ($|A|$ divides $|G|$ for a tile) is a Putnam-sized idea, and it is the whole reason spectral sets can fail to tile.
- The example above uses nothing past Fourier series and a $2 \times 2$ matrix.
- Dimension 1 asks about finite unions of intervals and sets of integers, and it is still open.

## Read more

I read the formal-conjectures file at the commit linked above. The paper details come from search summaries of the arXiv and journal pages. arxiv.org wasn't reachable from where I wrote this, so I haven't quoted any paper.

- T. Tao, [Fuglede's conjecture is false in 5 and higher dimensions](https://arxiv.org/abs/math/0306134) (arXiv:math/0306134).
- N. Lev and M. Matolcsi, [The Fuglede conjecture for convex domains is true in all dimensions](https://arxiv.org/abs/1904.12262) (arXiv:1904.12262; *Acta Math.* 228 (2022), 385–420).
- T. Zhang, [Both directions of Fuglede's conjecture fail in dimension two](https://arxiv.org/abs/2607.15632) (arXiv:2607.15632, preprint).
- [Fuglede's Conjecture for Cyclic Groups of Square-free Order](https://arxiv.org/abs/2610.02218) (arXiv:2610.02218, preprint).
- [formal-conjectures: `Wikipedia/Fuglede.lean`](https://github.com/google-deepmind/formal-conjectures/blob/f606af160664c5a10952e9a957b100a1cd45bbeb/FormalConjectures/Wikipedia/Fuglede.lean).
