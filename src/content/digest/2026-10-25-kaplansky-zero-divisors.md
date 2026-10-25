---
title: "Kaplansky's zero-divisor conjecture, claimed false"
date: 2026-10-25
summary: "An OpenAI paper claims a finitely presented torsion-free group whose group algebra over the field with two elements has zero divisors. The cancellation is a parity argument an undergraduate can check; the hard part is proving the group is torsion-free. The main theorem has a Lean formalization. It isn't refereed."
tags: [group theory, algebra, AI and mathematics]
---

**TL;DR.** Family 196 in [OpenAI's math repository](https://github.com/openai/math) (see the [October 8 entry](/digest/2026-10-08-openai-math-catalog)) is a 26-page paper, dated September 23, 2026, claiming a **counterexample to Kaplansky's zero-divisor conjecture**: a finitely presented torsion-free group $G$ and nonzero $\alpha, \beta \in \mathbb F_2[G]$ with $\alpha\beta = 0$. The group even has a finite two-dimensional classifying space. The cancellation that makes $\alpha\beta = 0$ is a short parity argument. Almost all of the paper goes into proving that $\alpha$ and $\beta$ are nonzero and that $G$ has no torsion. The main theorem is listed as formalized in Lean. Nobody has refereed it, so this is a claim.

## The conjecture

For a field $K$ and a group $G$, the **group algebra** $K[G]$ is the set of finite formal sums $\sum a_g g$ with $a_g \in K$, multiplied by extending the group law bilinearly. If $g$ has finite order $m > 1$, there are zero divisors for free:
$$
(1 - g)(1 + g + \cdots + g^{m-1}) = 1 - g^m = 0.
$$
The **zero-divisor conjecture** says this is the only source: if $G$ is torsion-free, $K[G]$ has no zero divisors. The question goes back to Graham Higman's 1940 thesis, and Kaplansky posed it in his 1956 problem list. For $G = \mathbb Z$ it's easy, since $K[\mathbb Z]$ is the Laurent polynomial ring $K[t, t^{-1}]$, an integral domain. It was known for torsion-free elementary amenable groups (Kropholler, Linnell and Moody, 1988), for torsion-free 3-manifold groups, and for any group with the **unique-product property**: for finite nonempty $P, Q \subseteq G$, some element of $PQ$ is a product $pq$ in only one way. Applied to the supports of $\alpha$ and $\beta$, that one product survives in $\alpha\beta$.

Two older results showed the question was delicate. Rips and Segev (1987) built torsion-free groups *without* unique products, so that easy route can't cover every group. And in 2021 Giles Gardam disproved Kaplansky's related **unit conjecture** ([Annals, 2021](https://doi.org/10.4007/annals.2021.194.3.9)), finding a torsion-free group whose group algebra over $\mathbb F_2$ has a unit other than $\lambda g$. A unit is never a zero divisor, though, so the zero-divisor conjecture stayed open.

## The cancellation

Here is the part you can check with a pencil. Take two finite graphs $\Gamma_A$ and $\Gamma_B$ whose edges are labelled by letters $t$ (with $\bar t$ read backwards), and at each vertex $x$ let $S_x$ be the set of outgoing labels. Build a group $G$ in which the label of every closed path in either graph is trivial. (The paper does this by gluing a cone onto each graph component.) Then a path from a fixed root $x_A$ to a vertex $x$ has a well-defined label $g_x \in G$; similarly $h_y$ for paths from $x_B$ in $\Gamma_B$. Set
$$
\alpha = \sum_{x \in A'} g_x, \qquad \beta = \sum_{y \in B'} h_y^{-1},
$$
summing over the vertices of the roots' components. The coefficient of $w$ in $\alpha\beta$ is the number of pairs $(x, y)$ with $g_x h_y^{-1} = w$, taken mod 2.

Now join $(x, y)$ to $(x', y')$ whenever $x \xrightarrow{t} x'$ and $y \xrightarrow{t} y'$ with the same label $t$. A step doesn't change the product, because
$$
(g_x t)(h_y t)^{-1} = g_x h_y^{-1}.
$$
So $g_x h_y^{-1}$ is constant on each connected component of this pair graph. The degree of $(x, y)$ is $|S_x \cap S_y|$. If every one of those numbers is **odd**, then by the handshake lemma (the degrees sum to twice the number of edges) every component has an even number of vertices. Each component then adds an even number to a single coefficient, and over $\mathbb F_2$ everything cancels: $\alpha\beta = 0$.

The paper gets odd intersections from the **projective plane over $\mathbb F_{128}$**, with 16,513 points. Each vertex's ordinary labels form a line. Two lines meet in one point, or in all 129 points if they're the same line, and both numbers are odd. Three extra letters are added so that an $A$-vertex has 0 or 2 of them and a $B$-vertex 0 or 3; those overlap in 0 or 2, which is even, so the parity is unchanged. The edges themselves are chosen by random matchings.

## Where the work is

The parity argument would work for any such graphs, and that's the catch. It's easy to make $\alpha\beta = 0$ in a group where $\alpha$ or $\beta$ is secretly $0$, or where $G$ has torsion. The paper's introduction names two safeguards.

1. **The factors are nonzero.** A path from a root to any *other* vertex must have nontrivial label in $G$. Then the root is the only term contributing the identity, so $\alpha$ and $\beta$ each have identity coefficient 1.
2. **$G$ is torsion-free.** The paper proves the two-complex $X$ it builds is aspherical. That makes $X$ a finite two-dimensional $K(G, 1)$, and a group with a finite-dimensional classifying space has no torsion.

Both come down to ruling out certain planar arrangements of paired paths, and that takes Sections 2–5. As I read the outline in Section 1, a counting estimate over the random graphs ("squared-word decay") excludes bounded configurations. Then the Lipton–Tarjan planar separator theorem cuts an arbitrarily large spherical picture down to a bounded one. The authors say they prove the topology directly, not through a small-cancellation or CAT(0) criterion. The proof is probabilistic: it shows suitable matchings exist, but it doesn't write down an explicit presentation or explicit $\alpha$ and $\beta$.

## What has been checked

- **Lean.** The [scope note for family 196](https://github.com/openai/math/blob/main/lean/docs/196.md) says the main theorem is formalized. I read the [statement file](https://github.com/openai/math/blob/main/lean/ComparatorChallenges/TorsionFreeZeroDivisors.lean). It asks for a finitely presented group with no nontrivial element of finite order, a finite two-dimensional CW complex with that fundamental group and a contractible covering space, and nonzero $\alpha, \beta$ in Mathlib's `MonoidAlgebra (ZMod 2) G` with $\alpha\beta = 0$. The checker configuration permits only Lean's three standard axioms. I read the top-level proof file, which assembles the theorem from the sampled graphs, and one supporting file, which has no `sorry`. I didn't run the checker, so I can't confirm that it builds.
- **People.** I found no expert commentary on this paper that I could open.

## Why it's worth knowing

If you've met group rings in an algebra course, this is a famous problem whose counterexample you can partly verify. The cancellation step uses only the handshake lemma and the incidence counts of a projective plane. The difficulty sits in the part that looks routine: making sure the group you've built hasn't collapsed. The same catalogue (family 197) also claims a torsion-free counterexample to Kaplansky's **direct-finiteness** conjecture over $\mathbb F_2$ (that $ab = 1$ implies $ba = 1$). With Gardam's units, that would make three of Kaplansky's group-ring conjectures false in characteristic two.

## Sources

- OpenAI, *A Torsion-Free Group Algebra with Zero Divisors* ([PDF](https://github.com/openai/math/blob/main/preprints/A-Torsion-Free-Group-Algebra-with-Zero-Divisors-September-23-2026/paper.pdf)), September 23, 2026. Sections 1, 2.1 and 6 read.
- OpenAI math repository, [catalogue entries 196–197](https://github.com/openai/math/blob/main/CONTENTS.md), the [Lean scope note](https://github.com/openai/math/blob/main/lean/docs/196.md), and the [Lean statement file](https://github.com/openai/math/blob/main/lean/ComparatorChallenges/TorsionFreeZeroDivisors.lean).
- G. Gardam, *A counterexample to the unit conjecture for group rings*, [Annals of Mathematics 194 (2021)](https://doi.org/10.4007/annals.2021.194.3.9).
