---
title: "Twenty-two million implications, and the one left open"
date: 2026-11-11
summary: "A quiet news day, so a recent result worth knowing: the Equational Theories Project settled all 22,028,942 implications between the 4,694 simplest laws for a binary operation, with every proof checked in Lean. Among finite magmas, exactly one implication (up to duality) is still unsolved, and it is easy to state."
tags: [universal algebra, formalization, Lean, open problems]
---

**TL;DR.** I couldn't confirm a new result from the last day or two against a primary source, so today's entry is a recent one. In December 2025 the Equational Theories Project posted its report, [*The Equational Theories Project: Advancing Collaborative Mathematical Research at Scale*](https://arxiv.org/abs/2512.07087) (Bolan, Breitner, Brox, Carlini, …, Tao, and others). Take every law of the form "left side = right side" for one binary operation, using at most four operations: there are 4,694 of them. For every ordered pair of laws, the project decided whether the first implies the second, which is 22,028,942 questions. Every answer is a formal proof in Lean. When you ask the same thing only about *finite* structures, one question is left, up to duality, and the authors leave it as an open problem.

## The question

A **magma** is a set $M$ with any binary operation $\diamond$, no axioms at all. A **law** is an identity that's meant to hold for every choice of the variables. Commutativity, $x \diamond y = y \diamond x$, is law 43 in the project's numbering. Associativity, $x \diamond (y \diamond z) = (x \diamond y) \diamond z$, is law 4512. A law $E$ **implies** a law $E'$ if every magma satisfying $E$ also satisfies $E'$.

Some single laws pin down a whole structure. Tarski showed in 1938 that the law
$$x = y \diamond (z \diamond (x \diamond (y \diamond z)))$$
holds exactly when $x \diamond y = x - y$ for some abelian group structure on $M$. That's subtraction in an abelian group, captured by one equation. Questions like this go back decades. The project started from a 2023 [MathOverflow question](https://mathoverflow.net/questions/450930) asking whether any law lies strictly between associativity and the "constant" law $x \diamond y = z \diamond w$. It then asked the same thing for every pair at once.

Two facts make this hard rather than routine. Birkhoff's completeness theorem says a true implication always has a proof by repeated substitution, but deciding implications between laws is undecidable in general (McKenzie). And even small cases can be deep: the order-4 law $x = (y \diamond x) \diamond ((x \diamond z) \diamond z)$ forces the magma to have one element, but every known proof was found by computer. The project turned one of them into a proof a person can read.

One of the 22 million questions is a Putnam problem in disguise. **2001 A1** asks you to show that $x = y \diamond (x \diamond y)$ (law 14) implies $x = (y \diamond x) \diamond y$ (law 29). The project's tour of selected equations notes that the two laws are in fact equivalent. It's a good warm-up for December.

## What it found

- **The answer:** 8,178,279 of the 22,033,636 ordered pairs, about 37%, are true implications (that count includes each law implying itself). The 4,694 laws fall into 1,415 equivalence classes. The largest by far has 1,496 laws, all equivalent to $x = y$, so any magma satisfying one of them has a single element.
- **Positive implications:** automated theorem provers (Vampire and others) found most of the proofs. Using transitivity and duality (swapping $x \diamond y$ for $y \diamond x$), only 10,657 implications needed a proof of their own.
- **Non-implications** were harder. Each one needs a magma that satisfies $E$ and breaks $E'$. Small multiplication tables found by brute force covered many. So did **linear models** $x \diamond y = ax + by$, translation-invariant operations on groups, and a "greedy" construction that builds an infinite magma one product at a time.
- **The infrastructure:** a GitHub repository where every contribution had to compile in Lean, so no moderator had to check twenty million statements. The paper compares it with Polymath, and with the Busy Beaver Challenge, which settled $S(5)$ with a Coq proof.

The primary goal was reached on April 14, 2025.

## The one left open

For finite magmas, surjective and injective coincide for maps $M \to M$. That gives 820 extra implications that hold for every finite magma but fail for some infinite one. All but one pair, which is a single question up to duality, were settled:

> **Problem** (ETP, 2025). Does every *finite* magma satisfying
> $$x = y \diamond (x \diamond ((y \diamond x) \diamond y)) \qquad \text{(law 677)}$$
> also satisfy
> $$x = ((x \diamond x) \diamond x) \diamond x \qquad \text{(law 255)?}$$

For arbitrary magmas the answer is no: the greedy construction builds an infinite counterexample. For finite ones nobody knows. The authors tentatively conjecture that a finite counterexample exists, but the problem has resisted most of their methods, including linear models. The search I ran turned up no report of a solution since the paper. The [blueprint's chapter on law 677](https://teorth.github.io/equational_theories/blueprint/677-chapter.html) collects partial results.

**Try it.** I ran a short Python search. It only shows why the problem is hard; it proves nothing.

1. No magma with 2 or 3 elements satisfies law 677. I checked all $2^4$ and $3^9$ tables. (The 1-element magma satisfies everything.)
2. Linear models $x \diamond y = ax + by \pmod m$ for $m < 60$ give 33 magmas satisfying law 677. All 33 also satisfy law 255. That matches the paper's remark that linear models can't settle it.
3. The smallest is $m = 5$, $x \diamond y = 2x + 4y$. You can check it by hand. First, $y \diamond x = 4x + 2y$ and $(y \diamond x) \diamond y = 3x + 3y$. Then $x \diamond (3x + 3y) = 4x + 2y$, and $y \diamond (4x + 2y) = 16x + 10y = x$. So law 677 holds. Law 255 holds too, since $x \diamond x = 6x = x$.

## Read more

- [The paper](https://arxiv.org/abs/2512.07087). Its LaTeX source is in the [project repository](https://github.com/teorth/equational_theories/tree/main/paper). The introduction needs no background beyond the definition of a group.
- [The project's GitHub repository](https://github.com/teorth/equational_theories): the list of all 4,694 laws (`data/equations.txt`), the Lean proofs, and links to the Equation Explorer and Finite Magma Explorer, where you can browse implications and test small tables.
- [A tour of selected equations](https://github.com/teorth/equational_theories/wiki/Tour-of-selected-equations), on the project wiki.
