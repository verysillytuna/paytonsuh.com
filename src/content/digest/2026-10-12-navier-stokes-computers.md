---
title: 'Can a fluid compute?'
date: 2026-10-12
summary: 'A claim in OpenAI’s catalog: smooth forces can make a Navier–Stokes flow run any Turing machine, so that one fluid particle reaches a box exactly when the machine halts. What the Lean statement says, why the force makes the equation easy, and where the hard part lies.'
tags: [PDE, fluid dynamics, computability, formalization]
---

**TL;DR.** Family 376 in OpenAI's catalog claims that a viscous, incompressible fluid in three dimensions can be pushed by a smooth external force so that it carries out any computation. One fixed particle enters one fixed box exactly when a given Turing machine halts. This is a claim. It hasn't been refereed, and it is not the Millennium Prize problem: the force is free to choose, and the fluid starts at rest. The interesting part is how the statement is set up, and the Lean file makes that easy to see. The repository's [history page](https://github.com/openai/math/blob/main/history.md) still ends at its October 7 corrections, and none of them touch this family (checked October 12, UTC).

## Why fluids and computers

The idea comes from Terence Tao. In 2014 he built a modified ("averaged") Navier–Stokes equation, with the same energy identity as the real one, whose solutions can blow up in finite time ([Tao, JAMS 2016](https://arxiv.org/abs/1402.0290)). The construction works like a machine, passing energy to smaller and smaller scales on schedule. He suggested that a real blow-up might come from a fluid that behaves like a computer and builds a smaller copy of itself. In 2021 Cardona, Miranda, Peralta-Salas and Presas took a step that way: a steady Euler flow (no viscosity) on a 3-sphere with a specially chosen metric that is Turing complete ([PNAS 2021](https://arxiv.org/abs/2012.12828)). (For both papers, only the abstracts and publication details were checked, through search.)

Family 376 moves this to viscous Navier–Stokes on flat space, the torus, or $\mathbb{R}^2 \times$ a circle, at any fixed positive viscosity, but with a force.

## What the Lean statement says

The [comparator statement](https://github.com/openai/math/blob/main/lean/ComparatorChallenges/ForcedNavierStokesComputation.lean) for the main result reads, in words: for every finite machine $M$ and input $w$ there are smooth fields $U$, $f_0$, $f_1$ such that

- $f_0 = \partial_t U + (U \cdot \nabla) U$ and $f_1 = -\Delta U$,
- for every viscosity $\nu > 0$, $U$ with **zero pressure** solves Navier–Stokes from rest with force $f = f_0 + \nu f_1$,
- the particle that $U$ carries from a fixed starting point enters a fixed open set at some time **if and only if** $M$ halts on $w$,
- $U$ is the only solution in a stated class ($u \in C_t H^2_x \cap C^1_t L^2_x$, with $u$ and $\nabla u$ bounded on finite time intervals),
- and the force is computable from $(M, w)$ whenever $\nu$ is.

```lean
f₀ M w = inertialCoefficient (U M w) ∧
f₁ M w = viscousCoefficient (U M w) ∧
...
((∃ t : ℝ, 0 ≤ t ∧ X M w t fixedLabel ∈ observer) ↔ Halts M w) ∧
∀ ν : ℝ, 0 < ν →
  let f := affineForce (f₀ M w) (f₁ M w) ν
  ZeroDataSolution ν f (U M w) (fun _ _ => 0) ∧ ...
```

The first two lines are the key. With $p = 0$, the equation $\partial_t U + (U\cdot\nabla)U = -\nabla p + \nu \Delta U + f$ just *defines* $f$. Any smooth velocity solves forced Navier–Stokes if you're allowed to pick the force afterward. So the equation is not the hard part here. The hard part is building a **divergence-free** flow whose particle paths follow a machine's instructions step by step, forever, with every derivative under control. The papers do that with localized swirls that move boxes of fluid like a recorder storing a tape. Uniqueness then says this flow is *the* solution for that force, not just one of several.

One consequence follows from the statement: since the force is computed from $(M, w)$ and halting is undecidable, no algorithm can take such a force and decide whether the particle ever reaches the box. Long-time questions about forced fluids can be undecidable.

A [second statement](https://github.com/openai/math/blob/main/lean/ComparatorChallenges/NavierStokesVelocity.lean) moves the test from one particle to the velocity field itself: on the torus, the machine halts exactly when the vertical velocity exceeds $1/2$ somewhere in a fixed strip. The family's [formalization notes](https://github.com/openai/math/blob/main/lean/docs/376.md) list which pieces are formalized and say one paper's detector is outside the formal scope.

## Why read the statement, not just the badge

"Formalized in Lean" certifies that the formal theorem is proved, not that it's the theorem in the paper, or the one in the headline. A preprint posted October 6, [*Navier–Stokes lost in translation*](https://arxiv.org/abs/2610.08144) by Bastounis, Circelli and Hansen, makes this point using OpenAI's separate September Navier–Stokes blow-up announcement. According to its abstract, as reported in search results (arXiv wasn't reachable for this entry), the Lean statements there can impose conditions the paper's statements don't, and the authors say they are not claiming the proof itself is wrong. Family 376 is a good example of why reading the statement pays off. Its Lean file shows plainly that the force is built from the velocity, which tells you where the real content is and isn't.

## Reading

- The claim: [catalog entry 376](https://github.com/openai/math/blob/main/CONTENTS.md), [formalization notes](https://github.com/openai/math/blob/main/lean/docs/376.md), and the Lean statements for the [particle test](https://github.com/openai/math/blob/main/lean/ComparatorChallenges/ForcedNavierStokesComputation.lean) and the [velocity test](https://github.com/openai/math/blob/main/lean/ComparatorChallenges/NavierStokesVelocity.lean).
- Background: [Tao's averaged Navier–Stokes blow-up](https://arxiv.org/abs/1402.0290) and [Turing complete Euler flows](https://arxiv.org/abs/2012.12828).
- The critique of autoformalization: [arXiv:2610.08144](https://arxiv.org/abs/2610.08144).
