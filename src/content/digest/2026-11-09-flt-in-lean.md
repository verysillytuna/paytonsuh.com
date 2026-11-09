---
title: "Fermat's Last Theorem in Lean: what is actually being formalized"
date: 2026-11-09
summary: "A quiet news day, so a project worth knowing: Kevin Buzzard's open-source effort to teach the proof of Fermat's Last Theorem to the Lean proof assistant. Its first goal, by 2029, is a formal proof that FLT follows from results known by the end of 1989. Here is the route it takes and where the hard part sits."
tags: [number theory, formalization, Galois representations]
---

**TL;DR.** No new result from the last day or two that I could check from primary sources, so today's entry is a project rather than a paper. Since late 2024 an open-source team led by Kevin Buzzard at Imperial College London has been formalizing a proof of Fermat's Last Theorem in [Lean](https://lean-lang.org/), funded by an EPSRC grant until September 2029. The [project's own description](https://github.com/ImperialCollegeLondon/FLT/blob/main/GENERAL.md) is precise about the scope. The first phase does *not* aim at a proof from the axioms. It aims at a complete formal proof that FLT follows from theorems published by 31 December 1989, which are assumed. When the project began, FLT was also the only one of the 100 theorems on Freek Wiedijk's formalization challenge list that no proof assistant had done.

## The route, in three steps

The project's [blueprint](https://github.com/ImperialCollegeLondon/FLT/tree/main/blueprint/src) is the map of the proof, written in LaTeX with links to the Lean code. Its chapters are meant to be read out of order, but the logic runs like this.

1. **Reduce to primes $p\ge5$.** A counterexample $a^n+b^n=c^n$ with $n\ge3$ gives one with $n=4$ or with $n$ an odd prime. Fermat's own descent rules out $n=4$, and Euler's argument rules out $n=3$. Both are already in [mathlib](https://github.com/leanprover-community/mathlib4), Lean's mathematics library; the $n=3$ case was formalized by a team at a Luminy conference in March 2024.
2. **Build the Frey curve.** A counterexample with $p\ge5$ can be normalized into a *Frey package*: pairwise coprime nonzero integers with $a\equiv3\pmod 4$, $b$ even and $a^p+b^p=c^p$. From it one builds the elliptic curve $y^2=x(x-a^p)(x+b^p)$ and looks at how the absolute Galois group $G_{\mathbb Q}=\mathrm{Gal}(\overline{\mathbb Q}/\mathbb Q)$ acts on its $p$-torsion points. That action is a representation $\bar\rho\colon G_{\mathbb Q}\to\mathrm{GL}_2(\mathbb Z/p\mathbb Z)$.
3. **Get a contradiction.** A theorem of Mazur (1970s) says $\bar\rho$ is irreducible. A theorem of Wiles says it can't be. More precisely, the blueprint reduces FLT, modulo Mazur and some easier steps, to the statement that there is no irreducible "hardly ramified" 2-dimensional representation $G_{\mathbb Q}\to\mathrm{GL}_2(\mathbb Z/\ell\mathbb Z)$ for a prime $\ell\ge5$. Note that this no longer mentions elliptic curves at all.

Everything that remains goes into that last statement, and that's where the project spends its effort.

## Why it isn't Wiles's 1994 proof

The blueprint follows a route designed by Richard Taylor in discussions with Buzzard, a "21st-century proof" built on later work of Diamond, Fujiwara, Khare–Wintenberger, Skinner–Wiles, Kisin and others. The central idea is still Wiles's: a *deformation ring* $R$, which parametrizes the Galois representations lifting $\bar\rho$, is isomorphic to a *Hecke algebra* $T$, which parametrizes the modular ones. But the setting is moved to suit Lean. Modularity is taken to mean coming from automorphic forms on a *totally definite quaternion algebra* over a totally real field $F$ of even degree. Those forms are functions on a finite set, so they're far more concrete than classical modular forms. The plan is:

- **Potential modularity.** Find a suitable totally real field $F$ over which $\bar\rho$ becomes modular. This uses Moret-Bailly's theorem on points of curves, class field theory and the Jacquet–Langlands correspondence, all pre-1990 and so assumed in phase one.
- **A modularity lifting theorem.** If $\bar\rho$ is modular, then so is every lift $\rho$ with the right local properties (determinant the cyclotomic character, controlled ramification, flat at $\ell$). This is the one new-style ingredient, proved by the Skinner–Wiles trick followed by the Taylor–Wiles method with Kisin's refinements.

The blueprint is candid about distance. Of the lifting theorem it says: "Right now we are very far from even stating this theorem in Lean." That's the real content of the project. Many of the objects of modern number theory (adele rings, automorphic representations, Hecke operators, Galois cohomology of local fields) didn't exist in any proof assistant until recently, so they have to be defined before anything about them can be stated. Much of the blueprint is side projects that build exactly these: adeles, Haar characters, Frobenius elements, quaternion algebras, Hecke operators.

## Where AI comes in

The project's 2023 description said AI tools could not really help with this kind of formalization, and that it would be "interesting to see how different things will be in September 2029." The blueprint's introduction has since been updated. It now says that until 2026 the computer "would only start filling in details of arguments by itself once the arguments are mathematically utterly obvious," and that AI is making it better at filling in arguments itself. That fits the pattern in recent digest entries: AI systems formalizing large bodies of existing mathematics. The modularity lifting theorem is a good test of how far that goes, because the hard part there is choosing the right definitions, not filling in steps.

**For a student.** The blueprint is a good guided tour of what a number theory PhD builds toward: elliptic curves, Galois representations, class field theory, automorphic forms. Each chapter states its goal at the top. One reference the blueprint gives for the lifting theorem is a set of [notes from Richard Taylor's 2018 Stanford course](https://math.berkeley.edu/~fengt/249A_2018.pdf), hosted at math.berkeley.edu.

## Read more

- [ImperialCollegeLondon/FLT](https://github.com/ImperialCollegeLondon/FLT): the repository. Start with the README and [GENERAL.md](https://github.com/ImperialCollegeLondon/FLT/blob/main/GENERAL.md) (what, why, which proof).
- The blueprint source, [chapters 1, 2 and 4](https://github.com/ImperialCollegeLondon/FLT/tree/main/blueprint/src/chapter): introduction, first reductions, overview of the proof. The rendered version is linked from the README.
