---
title: "The Stacks Project in Lean: algebraic geometry, machine-checked"
date: 2026-11-07
summary: "Axiom has released a Lean 4 formalization of the Stacks Project, the open reference for modern algebraic geometry. It says every tag with formalizable content is now covered and kernel-checked. The catch is in the README's two tiers: the human-reviewed core and a much faster-growing AI-written tier still waiting for review."
tags: [algebraic geometry, formalization, Lean, AI and mathematics]
---

**TL;DR.** The AI company Axiom has released [a Lean 4 formalization of the Stacks Project](https://github.com/AxiomMath/Stacks), built on Mathlib. The [Stacks Project](https://stacks.math.columbia.edu/) is the open, collaboratively written reference for modern algebraic geometry, the language of schemes. The repository says Axiom has "formalized every tag of the Stacks Project with formalizable content." Lean's kernel checks every proof, with no `sorry` and no `native_decide`, and the only axioms are the standard three. That is a very strong claim about the *proofs*. The open question is the *statements*: whether each Lean theorem says what the Stacks Project says. Most of the code sits in an AI-written tier that the README describes as needing review. So read the release as "a huge library of checked proofs, of statements that are partly reviewed."

## What the Stacks Project is

Algebraic geometry since Grothendieck studies **schemes**: spaces glued from pieces of the form $\operatorname{Spec} R$, where $R$ is a commutative ring and
$$
\operatorname{Spec} R = \{\, \mathfrak p \subset R : \mathfrak p \text{ a prime ideal} \,\}
$$
carries the Zariski topology, whose closed sets are $V(I) = \{\mathfrak p : \mathfrak p \supseteq I\}$ for ideals $I$. A first exercise gives the flavor: $\operatorname{Spec} R$ is always **quasi-compact**. If the open sets $D(f_i) = \operatorname{Spec} R \setminus V(f_i)$ cover it, then no prime contains every $f_i$. So the $f_i$ generate the unit ideal, $1 = \sum a_i f_i$ is a *finite* sum, and finitely many $D(f_i)$ already cover. Statements like this are short. The full theory (sheaves, cohomology, flatness, descent, algebraic spaces, stacks) runs to thousands of pages, and the classical sources (Grothendieck's EGA and SGA) are famously hard to navigate.

The Stacks Project, maintained by Johan de Jong at Columbia, rebuilds this foundation from scratch in one open document. Every result has a permanent four-character **tag**, so other papers can cite a specific lemma and the citation never goes stale.

## What was released

From the repository's README and CONTRIBUTING files:

- **Coverage.** Every tag with formalizable content is formalized. A Lean declaration carries `@[stacks TAG]`, and tags Mathlib already covers are registered on the Mathlib declaration. Examples, exercises and remarks that aren't formalized yet are listed as tasks for contributors. Declarations are also tagged with the EGA and SGA items they prove, with a note when they prove only a special case, some of the clauses, or something more general.
- **Trust base.** Every proof is checked by Lean's kernel. The rules forbid `sorry`, `admit`, `native_decide` and new axioms, so `#print axioms` should list only `propext`, `Classical.choice` and `Quot.sound`.
- **Scale.** About 63,000 Lean modules. The README warns that a full build takes "a long time and a lot of memory."
- **Two tiers.** *StacksCore* holds human-reviewed formalizations, "checked against the Stacks Project and brought to Mathlib standards." *StacksFrontier* holds formalizations "written by AI agents." The README calls it the tier "where review is most needed before code moves into StacksCore." Four named maintainers review every pull request, and contributors claim a task by posting a blueprint: the exact statement, the Lean statement, and a proof outline.
- **Independence.** It is Axiom's own project, licensed Apache 2.0. The Stacks Project itself is under the GNU Free Documentation License and is maintained separately.

## How to read this

A kernel-checked proof settles one question completely: the Lean statement follows from the axioms. It says nothing about whether that statement is the theorem you meant. In algebraic geometry the gap can be subtle. A lemma might be stated for Noetherian rings when the source allows any ring, or a "scheme" might quietly be assumed separated, or a definition might differ from the source in a way that makes a hard statement trivial. CONTRIBUTING.md names exactly this risk: "Do not weaken a statement to make it provable," and moving code into StacksCore means "checking that its statements faithfully capture the source." So the two tiers are the honest summary. The proofs are checked, and how many statements match their tags is still being reviewed by people.

Even so, this matters. If the statements hold up, Mathlib users get the foundations of scheme theory in one integrated library, and research formalization in arithmetic geometry no longer has to build them first. It's also a stress test of a new way of working: machines write the code, and the human job shifts to reviewing statements. The numbers to watch are how fast code moves from Frontier into Core, and what reviewers find on the way.

**If you want to look yourself.** The [Stacks Project](https://stacks.math.columbia.edu/) is free online. Its chapters on commutative algebra and on schemes are good companions to an undergraduate algebra course. In the Lean repository, searching for a tag shows the Lean statement next to the original.

## Read more

- AxiomMath, [*The Stacks Project in Lean*](https://github.com/AxiomMath/Stacks) (repository README and CONTRIBUTING.md), November 2026.
- [The Stacks Project](https://stacks.math.columbia.edu/), maintained by Johan de Jong.
- [Mathlib](https://github.com/leanprover-community/mathlib4), the Lean library it builds on.
