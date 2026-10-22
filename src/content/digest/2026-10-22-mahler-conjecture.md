---
title: "The Mahler conjecture, claimed through symplectic balls"
date: 2026-10-22
summary: "Three papers in OpenAI's October 6 release claim to settle Mahler's 1939 volume-product problem: for symmetric bodies, the cube is the minimizer (with all equality cases), and for general bodies it's the simplex. The shortest proof fits large symplectic balls inside K × K°. The symmetric inequality is formalized in Lean."
tags: [convex geometry, symplectic geometry, AI and mathematics, formal verification]
---

**TL;DR.** Family 087 in [OpenAI's math repository](https://github.com/openai/math) (see the [October 8 entry](/digest/2026-10-08-openai-math-catalog)) has three papers dated September 22, 2026 that together claim to settle the **Mahler conjecture**. For an origin-symmetric convex body $K \subset \mathbb R^n$, they claim $|K|\,|K^\circ| \ge 4^n/n!$, with equality exactly for Hanner polytopes. Without symmetry, simplices are claimed to be exactly the minimizers. The shortest of the three proves the symmetric inequality by fitting symplectic balls of every capacity below $4$ inside $K \times K^\circ$. The repository's Lean library states and proves the symmetric inequality from Mathlib definitions. None of the papers has been refereed, and I found no specialist's assessment I could read, so these are claims.

## The problem

Let $K$ be a convex body that is symmetric about the origin ($K = -K$). Its **polar** is
$$
K^\circ = \{\, p \in \mathbb R^n : \langle q, p\rangle \le 1 \text{ for every } q \in K \,\}.
$$
For example, the polar of the cube $[-1,1]^n$ is the cross-polytope $\{p : \sum |p_j| \le 1\}$, and the unit ball is its own polar. Stretching $K$ by a linear map $T$ shrinks $K^\circ$ by the inverse transpose, so the **volume product** $|K|\,|K^\circ|$ doesn't change under $T$. It's a number attached to the *shape* of $K$.

The Blaschke–Santaló inequality says the Euclidean ball has the largest volume product. Mahler asked for the smallest. The cube has volume $2^n$ and the cross-polytope $2^n/n!$ (it is $2^n$ simplices of volume $1/n!$, one per orthant), which gives $4^n/n!$. In the plane: a square gives $4 \cdot 2 = 8$, while the disk gives $\pi^2 \approx 9.87$. The conjecture says nothing beats the cube. Before this, the sharp bound was known in the plane (Mahler), for unconditional bodies (Saint-Raymond), and in dimension three (Iriyeh and Shibata, 2020). In general dimension the best results were exponential bounds of the form $c^n/n!$ with $c < 4$, starting with Bourgain and Milman (1987).

Part of what made it hard is that the cube is far from the only minimizer. The cross-polytope ties it, and so does every body built from intervals by repeatedly taking products and "free sums" (the convex hull of $H_1 \times \{0\}$ and $\{0\} \times H_2$). These are the **Hanner polytopes**, and any proof has to be tight on all of them at once.

## The symplectic proof

The paper *Symplectic Balls in Symmetric Polar Products* (19 pages) puts $K$ in the position coordinates $q$ and $K^\circ$ in the momentum coordinates $p$ of $\mathbb R^{2n}$, with the standard form $\omega_0 = \sum dq_j \wedge dp_j$. Its main theorem, for $n \ge 2$, is that the **Gromov width** of $U_K = \operatorname{int} K \times \operatorname{int} K^\circ$ is exactly $4$. That means for every $c < 4$, the ball $\{\pi(|q|^2 + |p|^2) < c\}$ embeds into $U_K$ by a map preserving $\omega_0$.

Mahler follows in one line. A symplectic map preserves volume, and that ball has $2n$-dimensional volume $c^n/n!$, so
$$
\frac{c^n}{n!} \le |U_K| = |K|\,|K^\circ| \quad\text{for every } c < 4.
$$

The upper bound, width at most $4$, takes half a page and is worth working through. Pick $q_0 \in K$ and $p_0 \in K^\circ$ with $\langle q_0, p_0\rangle = 1$. A linear symplectic change of coordinates makes $Q_1 = \langle p_0, q\rangle$ and $P_1 = \langle q_0, p\rangle$ the first coordinate pair. On $U_K$ both lie in $(-1,1)$ by polarity and symmetry, so $U_K$ sits inside a square of area $4$ times $\mathbb R^{2n-2}$. Gromov's nonsqueezing theorem then caps every embedded ball at capacity $4$. Artstein-Avidan, Karasev and Ostrover had already computed that a different symplectic invariant, the Hofer–Zehnder capacity, equals $4$ on $K \times K^\circ$. As the paper notes, that doesn't produce actual balls, and Viterbo's general volume–capacity conjecture, which would have, was disproved in 2024 by Haim-Kislev and Ostrover.

The new content is the lower bound: actually building the balls. As I read Sections 2–4, there are two ingredients.

1. **A ball from a holomorphic zero** (Theorem 2.1). If $f : \Omega \subset \mathbb C^n \to \mathbb C^m$ is holomorphic, vanishes only at $0$, and vanishes there to order $k$, then the region $\{|f|^2 < 1\}$, with the symplectic form coming from the potential $|z|^2 + |f|^2$, contains balls of every capacity below $\pi k$. The proof smooths the logarithmic singularity of $\log|f|^2$ and moves the resulting ball back with Moser's deformation trick.
2. **A conformal lens** (Section 3). The map $F(w) = \frac{8}{\pi^2}\sum_{\ell \ge 0} (-1)^\ell w^{2\ell+1}/(2\ell+1)^2$ sends the unit disk onto a lens-shaped domain with tips at $\pm i$. It's a rotation of a map Gross used to embed the uniform distribution. Writing $g = F^{-1}$, a uniform estimate on primitives of $|(g^k)'|^2$ controls how far the construction reaches in the momentum direction: about $\pi k/4$.

When $K$ is cut out by finitely many slabs $|\langle b_j, x\rangle| \le 1$, set $f_j(z) = g(\langle b_j, z\rangle)^k$. This vanishes to order $k$, so ingredient 1 gives balls of capacity nearly $\pi k$. Ingredient 2 places the domain inside $\operatorname{int} K \times (\pi k/4)\operatorname{int} K^\circ$. Rescaling the momentum by $\pi k/4$ divides capacity by the same factor, which leaves capacity nearly $4$. A polytope approximation handles general $K$.

## The other two papers

- *The symmetric Mahler conjecture and its equality cases* (26 pages) proves the same inequality a second way, through the same lens map and a mass estimate at an isolated holomorphic zero. It also classifies equality: $|K|\,|K^\circ| = 4^n/n!$ exactly when $K$ is a linear image of a Hanner polytope. That last step goes through a classical property of normed spaces: any three pairwise-intersecting closed balls share a point.
- *The Mahler Conjecture for General Convex Bodies* (72 pages) drops symmetry. Polarity is then taken about the Santaló point, and the claimed sharp bound is $(n+1)^{n+1}/(n!)^2$, attained exactly by simplices. In the plane that's $27/4$, from a triangle. The proof is different again: Klartag's correspondence between cones and Laplace transforms, then Moreau's decomposition and Gaussian averages. I read only its introduction.

## What has been checked

- **Lean.** The [scope note for family 087](https://github.com/openai/math/blob/main/lean/docs/087.md) says the formalization covers the symmetric inequality with its Hanner equality cases, the general inequality with simplex equality, and the Gromov width theorem. It does not cover the functional versions. I read the [statement file for the symmetric inequality](https://github.com/openai/math/blob/main/lean/ComparatorChallenges/MahlerConjecture.lean). It's short: $K$ is any compact, convex, symmetric set in $\mathbb R^n$ with nonempty interior, the polar is defined directly, and volume is Mathlib's Lebesgue measure. I confirmed that the solution module its comparator config names exists and proves that exact theorem by name. I didn't run the checker myself.
- **People.** Search results mention mathematicians' blog posts and an illustrated walkthrough, but I couldn't open any of them, so I can't report what they say. No refereed version exists.

## Why it's worth knowing

It's a problem anyone who has met convex sets can state, and it stood since Mahler's 1939 paper on the geometry of numbers. Its answer has many minimizers rather than one. The upper half of the proof uses only a change of coordinates, polarity, and Gromov's nonsqueezing theorem, so it's a good first look at why symplectic geometry is more rigid than volume. And as with the rest of this release, the formal check makes the *statement* trustworthy while the ideas still wait on human readers.
