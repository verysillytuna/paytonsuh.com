---
title: 'The rationals are dense in the reals'
date: 2026-10-06
summary: 'A short proof from the Archimedean property, and why completeness is doing the real work.'
tags: [analysis]
draft: true # formatting template; not published
---

A first result in any analysis course: between any two real numbers there is a rational.

<div class="theorem" data-label="Theorem.">

For all $x, y \in \mathbb{R}$ with $x < y$, there exists $q \in \mathbb{Q}$ with $x < q < y$.

</div>

The engine is the **Archimedean property**: for every $a > 0$ and $b \in \mathbb{R}$ there is $n \in \mathbb{N}$ with $na > b$. This is itself a consequence of the least upper bound property. If $\{na : n \in \mathbb{N}\}$ were bounded above by $b$, it would have a supremum $s$, and $s - a$ would fail to be an upper bound, so some $na > s - a$, giving $(n+1)a > s$, a contradiction.

<div class="proof">

Since $y - x > 0$, the Archimedean property gives $n \in \mathbb{N}$ with $n(y - x) > 1$, that is, $ny - nx > 1$. Let $m$ be the least integer with $m > nx$ (it exists by the Archimedean property applied in both directions together with well-ordering). Then $m - 1 \le nx$, so

$$
nx < m \le nx + 1 < ny.
$$

Dividing by $n$ gives $x < m/n < y$.

</div>

The interesting point is that the argument never uses anything about $\mathbb{Q}$ beyond its being the field of fractions of $\mathbb{Z}$. All the content is in the ordered field $\mathbb{R}$ being Archimedean, which fails in, for example, the field $\mathbb{R}(t)$ of rational functions ordered so that $t$ is infinitely large.
