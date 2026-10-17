---
title: "Ghys's conjecture on holomorphic Anosov maps, in complex dimension three"
date: 2026-10-17
summary: "A new preprint by Jiesong Zhang, reportedly found with heavy help from Shanghai AI Lab's Intern-S2 model and formalized in Lean at Peking University, says it settles Ghys's 1995 conjecture whenever the stable or unstable direction is one complex dimension. That covers every compact complex threefold."
tags: [dynamical systems, complex geometry, formal verification]
---

**TL;DR.** In 1995 Étienne Ghys conjectured that holomorphic Anosov diffeomorphisms (the most rigid kind of chaotic map) come only from linear algebra on tori and their close relatives. A new preprint, J. Zhang, *Codimension-one holomorphic Anosov diffeomorphisms* (arXiv:2609.37695), says it proves this when the stable or unstable direction has complex dimension one. In complex dimension 3 that is automatic, so the claim settles the three-dimensional case. A [public Lean 4 formalization](https://github.com/frenzymath/HolomorphicAnosov) of the paper's four main theorems is complete and accepted by the Lean comparator. On October 15 Shanghai AI Laboratory announced the result as found with its Intern-S2 model. The paper hasn't been refereed.

## Anosov maps, holomorphically

A diffeomorphism $f$ of a compact manifold is **Anosov** if every tangent space splits as $E^s \oplus E^u$: $Df$ shrinks vectors in $E^s$ exponentially and stretches vectors in $E^u$ exponentially. The standard example is Arnold's cat map, $\begin{pmatrix}2&1\\1&1\end{pmatrix}$ acting on the torus $\mathbb{R}^2/\mathbb{Z}^2$. It's an integer matrix with determinant $1$, so it maps the lattice to itself, and its eigenvalues $(3\pm\sqrt5)/2$ are off the unit circle.

Now ask for more: let $X$ be a compact *complex* manifold and $f$ a *holomorphic* Anosov map. Holomorphic maps are very rigid, and Ghys's conjecture says they're rigid enough that every example is, up to a biholomorphic change of coordinates, an affine map of a complex torus or of a complex infra-nilmanifold (a torus-like quotient of a nilpotent group).

Examples are easy to build. Take an integer matrix $A$ with determinant $\pm1$ and no eigenvalue of modulus $1$, and let it act complex-linearly on the complex torus $\mathbb{C}^d/(\mathbb{Z}[i])^d$. For the $3\times 3$ companion matrix of $x^3 - x - 1$, I checked numerically that the eigenvalues are one real root $\approx 1.3247$ and a complex pair of modulus $\approx 0.8688$. Their product is $1$, so $A \in SL(3,\mathbb{Z})$. Here $E^u$ is one complex line and $E^s$ is a complex plane.

## What the preprint claims

The Lean repository states the paper's theorems precisely. Here they are in words:

- **Theorem A.** If $X$ is a compact connected complex manifold and $f$ is a holomorphic Anosov diffeomorphism whose stable *or* unstable bundle has complex rank one, then $f$ is biholomorphically conjugate to a hyperbolic linear automorphism of a complex torus.
- **Theorem 1.3**, the step that makes this work: if $E^s$ has complex rank one, then $E^s$ and $E^u$ are *holomorphic* subbundles, of ranks $1$ and $d-1$. (For a general Anosov map these bundles are only guaranteed to be continuous, which is why this step is the hard part.)
- **Theorem 1.2:** on a manifold homeomorphic to a torus, holomorphic $E^s$ and $E^u$ force the linear model.

Why this is "the three-dimensional case": in complex dimension $d$, the ranks of $E^s$ and $E^u$ are positive and add up to $d$. For $d = 3$ they're $1+2$ or $2+1$, so one of them is always a line. For $d = 2$ both are lines, which is the surface case Ghys handled in the original paper (É. Ghys, *Holomorphic Anosov systems*, *Invent. Math.* **119**, 1995). From complex dimension 4 on, ranks $2+2$ are possible, and the conjecture stays open there.

## What the formalization checks

From the [repository README](https://github.com/frenzymath/HolomorphicAnosov), which I read in full along with the statement file:

- `Comparator/Challenge.lean` imports only Mathlib and states every definition and the four theorems (about 490 lines). The proofs live in a separate library. The [Lean comparator](https://github.com/leanprover/comparator) accepts the solution against the challenge, and the proofs use only Lean's three standard axioms.
- **One honest caveat, stated in the README:** Theorems A, 1.1 and 1.3 take as a *hypothesis* that, for $n \ge 5$, every closed smooth $n$-manifold homotopy equivalent to the torus $T^n$ is homeomorphic to it. That is a 1969 theorem of Hsiang and Wall, but it isn't in Mathlib, so the formalization assumes it rather than proving it. Ghys's own argument uses the same fact.
- The formalization was produced with Peking University's [SHEAF](https://github.com/frenzymath/SHEAF) autoformalization pipeline.

## The AI part, and what's uncertain

News reports from October 15–16 credit the discovery to human–AI collaboration with Shanghai AI Laboratory's model, which is variously called Intern-S2 or by its Chinese name (Shusheng). They also name a team at the lab and at Great Bay University, while the repository credits the paper to J. Zhang. I couldn't open the arXiv listing or the lab's announcement, so I can't say how the work was divided. Treat the AI-credit story as reported, not confirmed. The mathematics is a claim until referees or experts in the area weigh in. The formalization makes it much more trustworthy, but only for the statements as written, with the homotopy-torus hypothesis assumed.

## Why it's worth knowing

It's a clean example of a rigidity theorem: a dynamical condition (uniform hyperbolicity) plus a geometric one (holomorphic) pins down the whole space. Which manifolds carry Anosov maps at all is a question going back to Smale in the 1960s, and it's still open in general. And it's another data point in 2026's pattern: a claimed AI-assisted result arrives with a machine-checked proof, so what a reader has to trust shrinks to a statement file they can read in an afternoon.
