---
title: "A counterexample to Wormald's conjecture, checked by computer"
date: 2026-10-18
summary: "A September preprint says Wormald's 1987 conjecture on splitting cubic graphs into two isomorphic linear forests is false, with a 16-vertex disconnected counterexample. I rebuilt the graph and confirmed by exhaustive search that no such split exists. The connected case is still open."
tags: [graph theory, combinatorics, counterexamples]
---

**TL;DR.** A *linear forest* is a graph whose components are paths. Every cubic graph (every vertex of degree 3) can have its edges split into two linear forests, and Wormald conjectured in 1987 that when the number of vertices is a multiple of 4, the two forests can be chosen *isomorphic*. A preprint by James Alexander Schreib, *A Counterexample to Wormald's Conjecture* ([arXiv:2610.00086](https://arxiv.org/abs/2610.00086)), says it's false. The counterexample is a 16-vertex graph with two components, and adding copies of $K_4$ gives one of every order $16 + 4t$. I couldn't open arXiv from here, so what I know of the paper comes from its indexed abstract. But the claim is small enough to check directly, and I did: neither the 16-vertex nor the 20-vertex graph has the required split. The paper hasn't been refereed. The conjecture for *connected* cubic graphs is untouched.

## The conjecture

Split the edges of a cubic graph $G$ into red and blue so that each colour class is a linear forest. At every vertex the three edges split $2+1$ or $1+2$, since three of one colour would make a branch point. So each colour class is a *spanning* linear forest: every vertex lies on a red path and on a blue path, possibly as an endpoint.

A cubic graph on $n$ vertices has $3n/2$ edges. For the two classes to be isomorphic they need the same number of edges, so $3n/4$ must be a whole number. That is why the conjecture asks for $4 \mid n$. Wormald's conjecture says that's the only obstruction: for $4 \mid n$, some split makes the red and blue forests isomorphic, meaning they have the same multiset of path lengths.

Small cases work. $K_4$ splits into two Hamiltonian paths. The 3-cube splits into a red path on 6 vertices plus a red edge, and the same shape in blue.

## The counterexample

According to the abstract, the graph is the disjoint union of:

- $K_{3,3}$ (6 vertices), and
- a 10-vertex graph with a bridge: take two copies of $K_4$, subdivide one edge in each with a new vertex, and join the two new vertices by an edge.

Each piece is cubic, and the total is 16 vertices, a multiple of 4. Neither piece alone has a multiple of 4 vertices, which is the loophole: the hypothesis is on the whole graph, but colourings act component by component.

The abstract describes a parity obstruction: any valid split forces every monochromatic path to have an even number of vertices. I haven't seen how the paper proves that, but the step after it is easy to see. Each side of the bridge has 5 vertices. Say the bridge is red. Then every blue edge at those 5 vertices stays on that side, so the blue paths through them are contained in that side and cover it. Five vertices can't be covered by paths of even order, so the split fails.

## What I checked

I built the graph and searched every red/blue colouring of its 24 edges, pruning any vertex with three edges of one colour and any monochromatic cycle. No colouring gives isomorphic linear forests. The same search on the 20-vertex graph (one extra $K_4$, 30 edges) also finds none. As a control, the program does find isomorphic splits for $K_4$, $K_4 \sqcup K_4$, the 3-cube, $K_{3,3} \sqcup K_{3,3}$, and $K_{3,3} \sqcup K_{3,3} \sqcup K_4$. So the 16- and 20-vertex claims hold for the graph as the abstract describes it. The abstract also says a Lean 4 formalization covers the whole family; I haven't seen it.

## What's still open

The counterexample needs a component whose order isn't a multiple of 4, so it says nothing about connected graphs. There, Gal Kronenberg, Shoham Letzter, Alexey Pokrovskiy and Liana Yepremyan proved the conjecture for all *large* connected cubic graphs, according to listings for their 2022 seminar talks, which I saw only as search excerpts (the paper's abstract also cites the result). Small connected cubic graphs are still open.

It's also a reminder of how much depends on the exact wording of a conjecture. "Cubic graph" quietly includes disconnected ones, and when a conjecture fails on a technicality, the natural next step is to restate it as the authors meant it: here, for connected graphs.
