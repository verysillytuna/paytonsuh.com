---
title: "A counterexample to the Eilenberg–Ganea conjecture, an OpenAI paper claims"
date: 2026-10-21
summary: "Another result in OpenAI's October 6 release claims to settle a 1957 question: a finitely generated group whose cohomology stops in dimension two, but which has no two-dimensional classifying space. The group is a Bestvina–Brady kernel, and the obstruction comes from small SU(2) labels on a graph."
tags: [group theory, algebraic topology, AI and mathematics, formal verification]
---

**TL;DR.** In the [repository OpenAI released on October 6](https://github.com/openai/math) (covered here on [October 8](/digest/2026-10-08-openai-math-catalog)), result family 249 is a 25-page paper, *A finitely generated counterexample to the Eilenberg–Ganea conjecture* (dated September 23, 2026). It constructs a finitely generated, residually finite group $G$ with cohomological dimension $\operatorname{cd}_{\mathbb Z} G = 2$ and geometric dimension $\operatorname{gd} G = 3$. If correct, this answers the 1957 question negatively. The repository lists a Lean formalization of the full statement. I found no expert commentary or referee report yet, so this is a claim.

## The question

A **classifying space** for a group $G$ is a connected CW complex with fundamental group $G$ and contractible universal cover (a $K(G,1)$). The **geometric dimension** $\operatorname{gd} G$ is the smallest dimension of one. The **cohomological dimension** $\operatorname{cd}_{\mathbb Z} G$ is the length of the shortest projective resolution of $\mathbb Z$ over $\mathbb Z[G]$. The cellular chains of the universal cover of a $K(G,1)$ give such a resolution, so always
$$
\operatorname{cd}_{\mathbb Z} G \le \operatorname{gd} G.
$$
Eilenberg and Ganea proved in 1957 that equality holds when $\operatorname{cd}_{\mathbb Z} G \ge 3$. Stallings and Swan proved that $\operatorname{cd}_{\mathbb Z} G = 1$ forces $G$ to be free, so equality holds there too. That left one case: must a group of cohomological dimension two have a two-dimensional classifying space? The conjecture said yes.

The case was hard because of a gap between homology and homotopy. A free action of $G$ on an *acyclic* two-complex already gives a length-two resolution, so $\operatorname{cd} = 2$. A classifying space needs a *contractible* cover, and acyclic does not imply contractible. Worse, showing that one particular acyclic model isn't contractible says nothing about some other two-complex you haven't thought of.

## The group

The candidate goes back to Bestvina and Brady's 1997 Morse theory paper (*Inventiones* 129). Take a finite flag simplicial complex $L$ with vertex set $V$ and form the right-angled Artin group
$$
A_L = \langle a_q \ (q \in V) \mid [a_q, a_r] = 1 \text{ whenever } \{q,r\} \text{ is an edge of } L \rangle.
$$
Send every generator to $1 \in \mathbb Z$. The kernel of this "height" map is a Bestvina–Brady group. Bestvina and Brady showed that when $L$ is a suitable acyclic triangulation of a spine of the Poincaré homology sphere, either the Eilenberg–Ganea conjecture or Whitehead's asphericity conjecture must fail, without saying which.

The new paper takes $L$ to be a flag triangulation (103 vertices, in the Lean files) of the presentation complex of
$$
\langle x, y \mid x^2 = y^5,\ x^2 = (xy^{-1})^3 \rangle,
$$
the group of Example 2.38 in Hatcher's *Algebraic Topology*. The exponent-sum matrix has rows $(2,-5)$ and $(-1,3)$, with determinant $1$, so the complex is acyclic. But its fundamental group is nontrivial, and the paper writes down an explicit nontrivial map to $SU(2)$: send $x$ to a unit imaginary quaternion $u$ and $y$ to $\cos(\pi/5) + v \sin(\pi/5)$, with $u \cdot v = 1/(2\sin(\pi/5))$. Then $x^2$ and $y^5$ both go to $-1$, and $u(\cos\theta - v\sin\theta)$ has real part $1/2$, so its cube is $-1$.

Then $G$ is the height kernel. It acts freely on a two-dimensional acyclic level set $X$ inside the cube complex of $A_L$, which gives $\operatorname{cd} G = 2$; the whole three-dimensional cube complex divided by $G$ gives $\operatorname{gd} G \le 3$. The group is finitely generated but not finitely presented, by the Bestvina–Brady criterion, since $L$ is not simply connected.

## The idea of the obstruction

As I read the introduction and Sections 3–5, the argument plays two facts about labelings of edges by unit quaternions against each other:

1. **If a two-dimensional $K(G,1)$ existed** (with any number of cells), then there would be an $\eta > 0$ such that every labeling of the edges of $X$ by elements within $\eta$ of $1$ that multiplies to $1$ around every triangle also multiplies to $1$ around *every* closed path (Theorem 3.1). The proof turns the hypothetical classifying space into a presentation whose relators line up with the triangles of $X$. Then it shows that small commutators contribute only a quadratic error, and solves the leftover word equations in $SU(2)$ using a localized version of the Gerstenhaber–Rothaus degree argument (Lemma 2.1). Residual finiteness and compactness extend finite solutions to the whole graph.
2. **But such labelings exist anyway** (Proposition 5.1). For every $\varepsilon > 0$ there are labels within $\varepsilon$ of $1$, flat on every triangle, with nontrivial product around some loop. They come from pulling back the $SU(2)$ representation of $\pi_1(L)$ along maps from $X$ to $L$ that move slowly far from the identity but still trace a loop of $L$ exactly.

With an abelian target this couldn't work: products around loops would factor through $H_1(X) = 0$. The nonabelian group $SU(2)$ sees the homotopy that homology misses. Choosing $\varepsilon < \eta$ gives the contradiction, so $\operatorname{gd} G = 3$.

## What has been checked

- **Lean.** The repository's [scope note for result 249](https://github.com/openai/math/blob/main/lean/docs/249.md) says the formalization builds the group and proves it has cohomological dimension two and a three-dimensional but no two-dimensional classifying space. I read the [statement file](https://github.com/openai/math/blob/main/lean/ComparatorChallenges/EilenbergGanea.lean). It builds the triangulation from the two relator words and defines the Artin group, the height kernel, and cohomological dimension (as projective dimension over $\mathbb Z[G]$) from Mathlib. It also defines a classifying space as an ordinary CW complex with no limit on the number of cells, so the theorem rules out *every* two-dimensional model. The solution module the comparator config points to exists in the repository. I didn't run the checker myself.
- **People.** I found no human-written exposition or expert comment yet, unlike the Thompson's group $F$ result from the same release, which already has an exposition by Kim and Lodha.

## Why it's worth knowing

The conjecture is a clean statement about the two ways to measure a group's dimension, one algebraic and one geometric. It is also tied to Whitehead's asphericity conjecture through the Bestvina–Brady examples. The paper decides the Eilenberg–Ganea side for a finitely generated group; it doesn't claim anything about Whitehead's question. For a student meeting $\pi_1$ and homology, the example to keep is the presentation complex above. It has the homology of a point but a nontrivial fundamental group, and that gap is what the whole construction uses. Treat the result as a claim until specialists weigh in.
