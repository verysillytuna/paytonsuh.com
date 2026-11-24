---
title: "Sunflowers: a two-line induction, a factorial gap, and an REU that narrowed it"
date: 2026-11-24
summary: "The Erdős–Rado sunflower conjecture asks whether every large enough family of n-element sets contains k sets with the same pairwise intersection, once the family has more than c_k^n members. The classical bound has an extra factor of n!. Since 2019 a run of short papers, one of them from a summer REU, has cut that factor down to about (log n)^n. The question itself is still open."
tags: [combinatorics, extremal set theory, open problems, Erdős problems]
---

**TL;DR.** A break from the Riemann hypothesis story. This entry is about an open problem that fits on an index card: the **sunflower conjecture** of Erdős and Rado (1960), listed as [Erdős Problem 20](https://github.com/google-deepmind/formal-conjectures/blob/9097e2f90e66d2f6244209cb1c07f7120d17ec53/FormalConjectures/ErdosProblems/20.lean) in Google DeepMind's formal-conjectures repository. The classical proof is a short induction worth knowing for Putnam-style problems. The best bounds come from a 2019 paper in the *Annals* and two short follow-ups, one of them written from a summer REU project. The conjecture itself is still open.

## The problem

A **$k$-sunflower** is a collection of $k$ sets whose pairwise intersections are all the same set $K$, the *kernel*. Take the sets $A_1, \dots, A_k$ and remove $K$: what's left of each set (its *petal*) is disjoint from the others. The kernel may be empty, so $k$ pairwise disjoint sets count.

Let $f(n, k)$ be the least $m$ such that every family of at least $m$ distinct $n$-element sets contains a $k$-sunflower. Erdős and Rado showed that $f(n,k)$ is finite and asked how fast it grows.

> **Sunflower conjecture.** For each $k$ there is a constant $c_k$ with $f(n, k) < c_k^{\,n}$ for all $n \ge 1$.

That is the formal-conjectures statement word for word. It is tagged `research open`.

## The lower bound: $(k-1)^n$

Take $n$ disjoint blocks $B_1, \dots, B_n$, each with $k-1$ elements, and let the family be all sets that pick exactly one element from each block. There are $(k-1)^n$ such sets. Suppose $k$ of them formed a sunflower. In each block, look at the $k$ elements the sets pick. If two of the sets pick the same element, that element is in the kernel, so all $k$ sets pick it. Otherwise all $k$ picks differ, which is impossible with only $k-1$ elements in the block. So all $k$ sets agree on every block and are equal. This contradicts their being distinct.

So $f(n,k) > (k-1)^n$, and the conjecture says this is the right shape: exponential in $n$.

## The upper bound: $(k-1)^n\, n!$

Here is Erdős and Rado's argument. It's induction on $n$. Let $F$ be a family of $n$-sets with more than $(k-1)^n\, n!$ members and no $k$-sunflower.

1. Choose a **maximal** collection of pairwise disjoint sets in $F$. It has at most $k-1$ sets, or they would already form a sunflower with empty kernel.
2. Their union $U$ has at most $(k-1)n$ elements, and by maximality **every** set of $F$ meets $U$.
3. So some element $x \in U$ lies in at least $|F| / \big((k-1)n\big) > (k-1)^{n-1}(n-1)!$ sets of $F$.
4. Delete $x$ from those sets. This gives more than $(k-1)^{n-1}(n-1)!$ distinct sets of size $n-1$. By induction, $k$ of them form a sunflower. Put $x$ back into all $k$: it joins the kernel, and you have a sunflower in $F$.

(For $n = 1$: more than $k-1$ distinct singletons are pairwise disjoint.) This gives $f(n,k) \le (k-1)^n\, n! + 1$, exactly the bound recorded in the formal-conjectures file. The file also marks it as solved and links a Lean proof.

The gap between the two bounds is the factor $n!$, about $(n/e)^n$. The conjecture says it should be at most $C^n$.

## What changed since 2019

For almost sixty years the improvements left the shape $n^{n(1+o(1))}$ untouched. Then:

- **Alweiss, Lovett, Wu and Zhang** (2019), [*Improved bounds for the sunflower lemma*](https://arxiv.org/abs/1908.08483), *Annals of Mathematics* 194 (2021). For fixed $k$ the bound drops to about $(\log n)^{n(1+o(1))}$. The factorial is gone, and only a $\log n$ in the base stands between this and the conjecture. Their method studies "spread" families (no small set lies in too many members of the family) with a random-restriction argument. They also show that a robust variant of sunflowers needs the $\log n$, so the conjecture will need a new idea.
- **Rao** (2020), *Coding for sunflowers*, *Discrete Analysis*: a short proof by an encoding argument. In the notation here it gives $\big(C\,k \log(kn)\big)^n$.
- **Bell, Chueluecha and Warnke** (2021), [*Note on sunflowers*](https://arxiv.org/abs/2009.09327), *Discrete Mathematics* 344: the bound $\big(C\,k \log n\big)^n$, the best known shape. The note grew out of a **2020 summer REU project at Georgia Tech**. It's a reminder that an undergraduate summer can produce a paper on a problem Erdős cared about.

So, roughly: $(k-1)^n < f(n,k) \le (C\,k\log n)^n$. Removing that last $\log n$ is the whole conjecture.

## Why look at it

- The Erdős–Rado induction is a standard competition move: find an element in many sets, delete it, recurse.
- The $\log n$ barrier is the same kind of obstacle that blocks progress in theoretical computer science. Sunflowers have been used in lower bounds for monotone circuits, and the 2019 paper first appeared at STOC 2020 and on ECCC.
- Even $k = 3$ is open: is $f(n,3) < C^n$ for an absolute constant $C$?

## Read more

I read the formal-conjectures files at the commit linked below. The papers' bounds and publication details come from the arXiv and *Annals* listings as summarized by a search engine. arXiv itself was blocked from where I wrote this, so I haven't quoted the papers.

- [formal-conjectures: `ErdosProblems/20.lean`](https://github.com/google-deepmind/formal-conjectures/blob/9097e2f90e66d2f6244209cb1c07f7120d17ec53/FormalConjectures/ErdosProblems/20.lean): the definition of $f(n,k)$, the open statement `erdos_20`, and the Erdős–Rado bound.
- R. Alweiss, S. Lovett, K. Wu, J. Zhang, [Improved bounds for the sunflower lemma](https://arxiv.org/abs/1908.08483) (arXiv:1908.08483; [*Annals* page](https://annals.math.princeton.edu/2021/194-3/p05)).
- T. Bell, S. Chueluecha, L. Warnke, [Note on sunflowers](https://arxiv.org/abs/2009.09327) (arXiv:2009.09327).
- A. Rao, Coding for sunflowers, *Discrete Analysis* (2020), arXiv:1909.04774.
