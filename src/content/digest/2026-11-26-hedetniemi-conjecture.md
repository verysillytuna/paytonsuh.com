---
title: "Hedetniemi's conjecture: fifty-three years, then a five-page counterexample"
date: 2026-11-26
summary: "Hedetniemi conjectured in 1966 that coloring the tensor product of two graphs takes as many colors as the easier factor needs. It held in the small cases and resisted everyone until Yaroslav Shitov's 2019 counterexample, which rests on one trick: a graph paired with its own exponential graph is always easy to color."
tags: [combinatorics, graph theory, counterexamples]
---

**TL;DR.** No big story broke in the last day or two that this digest hasn't already covered (the Riemann hypothesis claim had three entries, Nov 21–23), so here is a finished problem worth knowing nine days before the Putnam. **Hedetniemi's conjecture** (1966) said that the chromatic number of a tensor product of two graphs is the smaller of their two chromatic numbers. It stood for 53 years. In 2019 Yaroslav Shitov disproved it in a five-page paper in the *Annals of Mathematics*. The statement, the known cases and the references below are read from Google DeepMind's [formal-conjectures file](https://github.com/google-deepmind/formal-conjectures/blob/ea8e3e198ded6fc73efb7f5653b74b28ac4ae1a8/FormalConjectures/Wikipedia/HedetniemiConjecture.lean), which tags it `research solved`.

## The problem

The **tensor product** $G \times H$ of two graphs has vertex set $V(G) \times V(H)$, and $(a,b)$ is adjacent to $(a',b')$ when $a \sim a'$ in $G$ **and** $b \sim b'$ in $H$.

> **Hedetniemi's conjecture.** For finite graphs $G$ and $H$, $\ \chi(G \times H) = \min\{\chi(G), \chi(H)\}$.

One direction is free. A proper coloring $\varphi$ of $G$ gives the coloring $(a,b) \mapsto \varphi(a)$ of $G \times H$: if $(a,b) \sim (a',b')$ then $a \sim a'$, so the colors differ. The same works for $H$. So $\chi(G \times H) \le \min\{\chi(G),\chi(H)\}$ always, and the formal-conjectures file proves this in Lean. The conjecture said you can never do better.

## The cases that hold

- **Minimum at most 3.** If $\chi(G), \chi(H) \ge 3$, both graphs contain odd cycles, say $C_m$ and $C_n$. Walk around $C_m$ $n$ times and around $C_n$ $m$ times, in step. That is a closed walk of odd length $mn$ in $G \times H$, so $G \times H$ contains an odd cycle and isn't bipartite. (Filling in the details is a good exercise.)
- **Minimum equal to 4.** El-Zahar and Sauer (1985) proved that the product of two 4-chromatic graphs is 4-chromatic. That proof is much harder, and nobody got past 4.

## Shitov's starting point: exponential graphs

Fix a graph $G$ and a number of colors $c$. The **exponential graph** $K_c^G$ has as vertices *all* functions $f : V(G) \to \{1,\dots,c\}$, proper colorings or not. Two functions $f, g$ are adjacent when $f(u) \ne g(v)$ for every edge $uv$ of $G$.

Here is the trick. The product $G \times K_c^G$ is always $c$-colorable, by the evaluation coloring

$$(u, f) \;\longmapsto\; f(u).$$

It's proper: if $(u,f) \sim (v,g)$, then $u \sim v$ in $G$ and $f \sim g$, so $f(u) \ne g(v)$ by the definition of adjacency.

So to disprove the conjecture it is enough to find one graph $G$ and one $c$ with

$$\chi(G) > c \quad\text{and}\quad \chi(K_c^G) > c.$$

Then $\chi(G \times K_c^G) \le c < \min\{\chi(G), \chi(K_c^G)\}$. This reformulation was known long before 2019. Shitov's contribution was to choose $G$ well and prove the second inequality.

## After Shitov

The formal-conjectures file records two follow-ups:

- **Zhu** (2021, *J. Combin. Theory Ser. B*) found considerably smaller counterexamples.
- **Tardif** (2022, *Combinatorica*) showed that the product of two 14-chromatic graphs can be 13-colorable.

Search summaries also describe work by He and Wigderson showing the gap can be a constant factor. I haven't read that paper, so I'm reporting it as a summary and not linking it.

## Why look at it

- The evaluation coloring $(u,f) \mapsto f(u)$ is a one-line argument that turns a 53-year-old question into a question about one specific graph. Moves like that show up in Putnam problems.
- The odd-cycle argument above is a Putnam-style exercise on its own.
- A conjecture can hold in every small case, be checked for decades, and still be false.

## Read more

I read the formal-conjectures file at the commit linked below. The paper details come from that file's references and from search summaries. quantamagazine.org and arxiv.org weren't reachable from where I wrote this, so I haven't quoted either.

- [formal-conjectures: `Wikipedia/HedetniemiConjecture.lean`](https://github.com/google-deepmind/formal-conjectures/blob/ea8e3e198ded6fc73efb7f5653b74b28ac4ae1a8/FormalConjectures/Wikipedia/HedetniemiConjecture.lean): the statement, the El-Zahar–Sauer and Shitov results, and a Lean proof of the easy inequality.
- Y. Shitov, [Counterexamples to Hedetniemi's conjecture](https://arxiv.org/abs/1905.02167) (arXiv:1905.02167; *Ann. of Math.* 190 (2019), 663–667).
- X. Zhu, [Relatively small counterexamples to Hedetniemi's conjecture](https://arxiv.org/abs/2004.09028) (arXiv:2004.09028; *J. Combin. Theory Ser. B* 146 (2021), 141–150).
