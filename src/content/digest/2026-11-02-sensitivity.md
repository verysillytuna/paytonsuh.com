---
title: "The sensitivity conjecture, in two pages of linear algebra"
date: 2026-11-02
summary: "No outside verdict yet on last week's AI claims, so here is a result every linear algebra student can read in full. A thirty-year-old question about Boolean functions came down to one fact about the cube graph, and Hao Huang proved that fact in 2019 with a signed matrix whose square is n times the identity."
tags: [combinatorics, linear algebra, theoretical computer science]
---

**TL;DR.** The October 26 claims (the Exponential Time Hypothesis and the rest) are still being checked; the reviewers have said their involvement isn't a certification. Rather than repeat unverified news, today's entry is a short, complete proof. The **sensitivity conjecture** (Nisan and Szegedy, early 1990s) asked whether two ways of measuring how "spread out" a Boolean function is are polynomially related. Gotsman and Linial had shown in 1992 that it is equivalent to a statement about the $n$-dimensional cube graph. In July 2019 Hao Huang proved that statement in a seven-page paper ([arXiv:1907.00847](https://arxiv.org/abs/1907.00847); *Annals of Mathematics* 190 (2019), no. 3, 949–955, [journal page](https://annals.math.princeton.edu/2019/190-3/p06)). The core argument uses nothing beyond eigenvalues and the dimension of a subspace, and it's below in full.

## The question

Let $f : \{0,1\}^n \to \{0,1\}$. Write $x^{(i)}$ for $x$ with bit $i$ flipped.

- The **sensitivity** of $f$ at $x$ is the number of $i$ with $f(x^{(i)}) \ne f(x)$. The sensitivity $s(f)$ is the largest of these over all $x$.
- **Block sensitivity** allows flipping disjoint *blocks* of bits at once: $\mathrm{bs}(f)$ is the largest number of disjoint blocks $B_1, \dots, B_k$ such that flipping any one block changes $f(x)$, for some $x$.

Single bits are blocks, so $s(f) \le \mathrm{bs}(f)$. Block sensitivity was already known to be polynomially related to many other complexity measures (decision-tree depth, certificate complexity, the degree of $f$ as a real polynomial). The conjecture said sensitivity belongs to the same family: $\mathrm{bs}(f) \le s(f)^C$ for some constant $C$. Before 2019 the best general bound was exponential.

Gotsman and Linial showed the conjecture follows from (and is equivalent to) a statement about the **cube graph** $Q_n$: vertices $\{0,1\}^n$, with an edge when two strings differ in one bit.

## Huang's theorem

> **Theorem (Huang, 2019).** Let $S$ be any set of $2^{n-1}+1$ vertices of $Q_n$. Then some vertex of $S$ has at least $\sqrt{n}$ neighbours inside $S$.

The number $2^{n-1}+1$ is the point where this first becomes interesting: the $2^{n-1}$ strings with an even number of 1s contain no edges at all, so one vertex fewer can give degree $0$. Huang notes that $\sqrt{n}$ is best possible, and his bound replaced a logarithmic one (Chung, Füredi, Graham and Seymour, 1988). From it he derives $s(f) \ge \sqrt{\deg f}$, and with earlier bounds of the form $\mathrm{bs}(f) \le c \cdot (\deg f)^2$ this gives $\mathrm{bs}(f) \le c \cdot s(f)^4$. So the conjecture is true with $C = 4$, up to a constant factor.

## The proof

**Step 1: a signed cube.** Define $2^n \times 2^n$ matrices by
$$
A_1 = \begin{pmatrix} 0 & 1 \\ 1 & 0 \end{pmatrix}, \qquad
A_n = \begin{pmatrix} A_{n-1} & I \\ I & -A_{n-1} \end{pmatrix}.
$$
Index the rows by $\{0,1\}^n$, with the first block for strings starting with $0$ and the second for those starting with $1$. By induction, $A_n$ has entries $0, \pm 1$, and its nonzero entries sit exactly on the edges of $Q_n$: the diagonal blocks are the edges inside each half (signed), and the identity blocks join $x$ to the string that differs from it only in the first bit. So $A_n$ is the adjacency matrix of $Q_n$ with some edges given the sign $-1$.

**Step 2: $A_n^2 = nI$.** By induction, using $A_{n-1}^2 = (n-1)I$:
$$
A_n^2 = \begin{pmatrix} A_{n-1}^2 + I & A_{n-1} - A_{n-1} \\ A_{n-1} - A_{n-1} & I + A_{n-1}^2 \end{pmatrix} = nI.
$$
The signs are the whole trick: they make the off-diagonal blocks cancel.

**Step 3: the eigenspaces.** $A_n$ is symmetric and satisfies $t^2 - n = 0$, so it is diagonalizable with eigenvalues in $\{\sqrt{n}, -\sqrt{n}\}$. Its trace is $0$ (the trace of $A_n$ is $\operatorname{tr} A_{n-1} - \operatorname{tr} A_{n-1}$), so each eigenvalue has multiplicity $2^{n-1}$. Let $E$ be the $\sqrt{n}$-eigenspace: $\dim E = 2^{n-1}$.

**Step 4: a dimension count.** Let $W$ be the space of vectors supported on $S$ (zero outside $S$). Then $\dim W = 2^{n-1} + 1$, and
$$
\dim E + \dim W = 2^n + 1 > 2^n,
$$
so $E \cap W$ contains a nonzero vector $v$.

**Step 5: read off a degree.** Pick $u \in S$ with $|v_u|$ as large as possible; $v_u \ne 0$ because $v \ne 0$ is supported on $S$. Look at row $u$ of $A_n v = \sqrt{n}\, v$:
$$
\sqrt{n}\,|v_u| = \Bigl|\sum_{w} (A_n)_{uw} v_w\Bigr| \le \sum_{\substack{w \in S \\ w \sim u}} |v_w| \le \deg_S(u)\,|v_u|.
$$
The middle step uses that $(A_n)_{uw}$ is $\pm 1$ on edges and $0$ elsewhere, and that $v_w = 0$ off $S$. Divide by $|v_u|$: $\deg_S(u) \ge \sqrt{n}$. $\blacksquare$

## Why it's worth knowing

- **It's a 115-level proof of a research theorem.** Every step is in a first linear algebra course: block matrices, diagonalizability from a polynomial with distinct roots, trace as the sum of eigenvalues, and $\dim(E \cap W) \ge \dim E + \dim W - \dim V$.
- **The idea transfers.** Putting signs on a graph's edges, so that the signed adjacency matrix has a large eigenvalue with a large eigenspace, is now a standard tool. A dimension count against "vectors supported on $S$" is a common move in olympiad-style problems about subsets of the cube.
- **Step 5 is the only inequality.** A largest coordinate of an eigenvector controls the eigenvalue by a degree. It's worth remembering by itself.

## Sources

- Hao Huang, *Induced subgraphs of hypercubes and a proof of the Sensitivity Conjecture*, [arXiv:1907.00847](https://arxiv.org/abs/1907.00847), and the [*Annals of Mathematics* page](https://annals.math.princeton.edu/2019/190-3/p06) (vol. 190, no. 3, pp. 949–955, November 2019).
