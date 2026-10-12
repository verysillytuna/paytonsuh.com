---
title: 'Is the six-sphere a complex manifold?'
date: 2026-10-10
summary: 'No new refereed result in the last day, so a look at a claim from August that now has a machine-checked Lean proof: a complex structure on S⁶, answering a question of Hopf. What the question asks, why S⁶ is the only open case, and what the formal statement covers.'
tags: [complex geometry, topology, formalization]
---

**TL;DR.** The OpenAI catalog from the last two entries hasn't changed since its October 7 corrections: its [history page](https://github.com/openai/math/blob/main/history.md) has no newer entry, and the latest commits are from October 8 (both checked October 10, UTC). So today's entry is about a different claim. In August, Levent Alpöge posted a paper constructing a **complex structure on the six-sphere**, answering a question that goes back to Heinz Hopf. A Lean formalization of the statement is now public. It's still a claim: the paper hasn't been refereed.

## The question

A *complex manifold* of dimension $n$ is a space covered by charts to $\mathbb{C}^n$ whose transition maps are holomorphic. Every complex manifold also has an *almost complex structure*: a linear map $J$ on each tangent space with $J^2 = -1$ ("multiplication by $i$"). The converse fails. An almost complex structure comes from holomorphic charts exactly when its Nijenhuis tensor
$$
N_J(X, Y) = [JX, JY] - J[JX, Y] - J[X, JY] - [X, Y]
$$
vanishes (Newlander–Nirenberg). Then $J$ is called *integrable*.

For spheres, Borel and Serre showed that only $S^2$ and $S^6$ admit almost complex structures at all. $S^2$ is the Riemann sphere $\mathbb{CP}^1$, so it's complex. $S^6$ has an almost complex structure from the octonions. View $S^6$ as the unit sphere in the imaginary octonions $\operatorname{Im}\mathbb{O} \cong \mathbb{R}^7$, and set
$$
J_p(v) = p \times v \qquad (p \in S^6,\ v \perp p),
$$
where $\times$ is the octonion cross product. This $J$ is not integrable. **Hopf's problem** asks whether *some* almost complex structure on $S^6$ is. LeBrun showed that none is compatible with the round metric, but the general question stayed open.

## The claim

Alpöge's paper, [*A compact complex threefold fibred by tori over the projective line, and the six-sphere*](https://alpo.ge/s6.pdf), builds a compact complex threefold $X$ with a holomorphic map $X \to \mathbb{CP}^1$. The fibres are complex 2-tori, assembled from a modular family and completed over three special points. The paper then shows that $X$ is diffeomorphic to $S^6$. That last step is topological: $X$ is simply connected with the integer cohomology of $S^6$, so the h-cobordism theorem makes it a sphere, and $S^6$ has no exotic smooth structures.

The construction collides with earlier literature. Pulling back functions from $\mathbb{CP}^1$ gives $X$ non-constant meromorphic functions. Campana, Demailly and Peternell had argued that a complex $S^6$ could have none. One formalization repository lists a section of the paper titled "Refutation of CDP20." If the construction holds up, that earlier argument has a gap.

## What has been checked

There are two formalizations:

- [plby/HopfProblem](https://github.com/plby/HopfProblem) takes its statement from Google DeepMind's [Formal Conjectures](https://github.com/google-deepmind/formal-conjectures/blob/main/FormalConjectures/Mathoverflow/1973.lean) project:

  ```lean
  theorem mathoverflow_1973 :
      ∃ atlas : ChartedSpace (EuclideanSpace ℂ (Fin 3)) (unitSphere 6),
        letI := atlas
        IsManifold 𝓘(ℂ, EuclideanSpace ℂ (Fin 3)) 1 (unitSphere 6)
  ```

  Here `unitSphere 6` is the unit sphere in $\mathbb{R}^7$ with its usual topology. The statement asks for charts to $\mathbb{C}^3$ whose transition maps are complex-differentiable, which means holomorphic. The proof file is about 250,000 lines and contains no `sorry`. The repository's checker configuration allows only Lean's three standard axioms. This entry did not run the check.
- [drhodes/hopf-problem](https://github.com/drhodes/hopf-problem) follows the paper section by section. Its README says the fundamental group and cohomology computations are kernel-checked. It treats two classical theorems as stated assumptions rather than proving them: Newlander–Nirenberg, and the h-cobordism / exotic-sphere input.

A complete formal proof of the Formal Conjectures statement would settle the question, provided the statement means what it appears to mean. The statement is short and uses Mathlib's standard definitions, so a reader can check that part directly. The paper is a separate matter. Whether it's correct, and what it teaches, is for referees and readers.

## Reading

- The paper: [alpo.ge/s6.pdf](https://alpo.ge/s6.pdf) (about 108 pages).
- Background: the octonion structure on $S^6$ and the Nijenhuis tensor appear in most texts on complex manifolds. Huybrechts' *Complex Geometry* covers almost complex structures and integrability.
