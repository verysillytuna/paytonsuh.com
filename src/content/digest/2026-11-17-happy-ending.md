---
title: "Five points make a quadrilateral: the happy ending problem"
date: 2026-11-17
summary: "Any five points in the plane, no three on a line, contain the corners of a convex quadrilateral. Erdős and Szekeres asked how many points force a convex n-gon. They guessed 2^(n−2) + 1, proved it is at least that, and the upper bound is still only known up to a lower-order term in the exponent."
tags: [combinatorics, discrete geometry, Ramsey theory, open problems, Lean]
---

**TL;DR.** No new story from the last two days could be checked against a primary source, so this entry is an open problem worth knowing. Let $f(n)$ be the smallest number such that any $f(n)$ points in the plane, no three on a line, contain $n$ points forming a convex $n$-gon. Erdős and Szekeres conjectured $f(n) = 2^{n-2} + 1$. Google DeepMind's `formal-conjectures` repository states this in Lean as Erdős Problem 107 and tags it as an open research problem. Below: why $f(4) = 5$, and a complete proof of the original upper bound.

## Four points: $f(4) = 5$

Four points aren't enough: take a triangle and one point inside it. No four of them are in convex position.

Five points are enough. Look at their convex hull.

- If the hull has 4 or 5 corners, any 4 hull corners form a convex quadrilateral.
- If the hull is a triangle $abc$, the other two points $d, e$ lie inside it. The line through $d$ and $e$ misses the corners (no three points are collinear), so it leaves two corners on one side. Those two corners, together with $d$ and $e$, form a convex quadrilateral.

So $f(4) = 5$, and the Lean file proves $f(3) = 3$ as a test case.

## Cups and caps

Rotate the picture so that all $x$-coordinates differ, and read points from left to right. A **$k$-cup** is $k$ points whose consecutive slopes increase (a convex chain, bending up). A **$k$-cap** is $k$ points whose consecutive slopes decrease. A cup or a cap is in convex position, so finding an $n$-cup or an $n$-cap gives a convex $n$-gon.

**Lemma (Erdős–Szekeres).** Any $\binom{k+l-4}{k-2} + 1$ points in general position contain a $k$-cup or an $l$-cap.

*Proof.* Write $g(k,l)$ for the smallest number that works. Any three points form a 3-cup or a 3-cap. If $l$ points have no 3-cup, every three consecutive points form a cap, so the slopes decrease all the way and the $l$ points form an $l$-cap. So $g(3,l) = l$, and by symmetry $g(k,3) = k$. These match the formula.

For the induction step, take $g(k-1,l) + g(k,l-1) - 1$ points. Let $A$ be the set of points that are the right end of some $(k-1)$-cup.

- If at least $g(k-1,l)$ points are outside $A$, those points contain a $(k-1)$-cup or an $l$-cap. The cup is impossible, because its right end would lie in $A$. So there is an $l$-cap.
- Otherwise $A$ has at least $g(k,l-1)$ points, so $A$ contains a $k$-cup (done) or an $(l-1)$-cap. Let $p$ be the left end of that cap and $r$ the next point of the cap. Since $p \in A$, it ends a $(k-1)$-cup, whose second-to-last point is some $q$. No three points are collinear, so the slopes of $qp$ and $pr$ differ. If slope $qp$ is smaller, the cup continues through $r$: a $k$-cup. If slope $qp$ is larger, $q$ can be put in front of the cap: an $l$-cap.

So $g(k,l) \le g(k-1,l) + g(k,l-1) - 1$, and Pascal's rule finishes the induction. ∎

Taking $k = l = n$ gives the 1935 bound
$$f(n) \le \binom{2n-4}{n-2} + 1.$$

## Try it

I checked the lemma by computer for every $3 \le k, l \le 6$: 300 random point sets of the stated size each, and a dynamic program over pairs of points found a $k$-cup or an $l$-cap every time. Random search also found 6 points with no 4-cup and no 4-cap, so the lemma's count $\binom{4}{2} + 1 = 7$ can't be lowered for $k = l = 4$. (Random sets are a sanity check, not a proof; the proof is the argument above.)

The lemma's bound is about cups and caps, though, not convex polygons, and it is far from the conjecture:

| $n$ | conjecture $2^{n-2} + 1$ | 1935 upper bound $\binom{2n-4}{n-2} + 1$ |
|---|---|---|
| 4 | 5 | 7 |
| 5 | 9 | 21 |
| 6 | 17 | 71 |
| 10 | 257 | 12871 |

## Where it stands

According to the Lean file:

- Erdős and Szekeres (1960/61) built point sets showing $f(n) \ge 2^{n-2} + 1$, so the conjecture is the best possible value.
- Suk (J. Amer. Math. Soc., 2017) proved $f(n) \le 2^{(1+o(1))n}$, matching the conjecture in the exponent's leading term.
- Holmsen, Mojarrad, Pach and Tardos (JEMS, 2020) improved the error term:
$$f(n) \le 2^{n + O(\sqrt{n \log n})}.$$

Whether $f(n) = 2^{n-2} + 1$ for every $n$ is still open.

**Why it's worth knowing.** The cup–cap lemma is a Ramsey argument you can teach in ten minutes: split the points by a property of their right ends, apply induction to one side, and glue at a single point. The same shape appears in the Erdős–Szekeres theorem on monotone subsequences. The gap between $\binom{2n-4}{n-2}$, about $4^n$, and the conjectured $2^n$ took more than eighty years to close in the exponent.

## Read more

- [`FormalConjectures/ErdosProblems/107.lean`](https://github.com/google-deepmind/formal-conjectures/blob/main/FormalConjectures/ErdosProblems/107.lean) in [google-deepmind/formal-conjectures](https://github.com/google-deepmind/formal-conjectures): the statement (tagged `research open`, AMS 52), the bounds with references, and a Lean proof of $f(3) = 3$. It links [erdosproblems.com/107](https://www.erdosproblems.com/107).
- [`FormalConjectures/Wikipedia/HappyEndingProblem.lean`](https://github.com/google-deepmind/formal-conjectures/blob/main/FormalConjectures/Wikipedia/HappyEndingProblem.lean), which points to the same statement and to the [Wikipedia article](https://en.wikipedia.org/wiki/Happy_ending_problem).
