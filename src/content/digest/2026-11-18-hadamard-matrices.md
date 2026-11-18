---
title: "Hadamard matrices: the largest determinant a ±1 matrix can have"
date: 2026-11-18
summary: "An n×n matrix of ±1 entries has determinant at most n^(n/2), with equality exactly when its rows are orthogonal. Such Hadamard matrices force n = 1, 2 or a multiple of 4. Hadamard's conjecture says every multiple of 4 works; the smallest order nobody has built is 668."
tags: [combinatorics, linear algebra, number theory, open problems, Lean]
---

**TL;DR.** No new story from the last two days could be checked against a primary source, so this entry is an open problem worth knowing, and one you can work on with nothing past a first course in linear algebra. A **Hadamard matrix** of order $n$ is an $n \times n$ matrix $H$ with entries $\pm 1$ and $HH^{\top} = nI$: its rows are pairwise orthogonal. They exist only when $n = 1$, $2$ or $4k$. **Hadamard's conjecture** says they exist for every $n = 4k$. Google DeepMind's `formal-conjectures` repository states it in Lean and tags it as an open research problem, and Terence Tao's list of optimization constants records the smallest unsettled order: $668$.

## The determinant bound

**Hadamard's inequality.** If $M$ is an $n \times n$ real matrix with columns $v_1, \dots, v_n$, then
$$|\det M| \le \|v_1\| \, \|v_2\| \cdots \|v_n\|.$$

*Proof.* If the columns are dependent, $\det M = 0$. Otherwise run Gram–Schmidt *without normalizing*: replace $v_k$ by $w_k = v_k - p_k$, where $p_k$ is the orthogonal projection of $v_k$ onto $\operatorname{span}(v_1, \dots, v_{k-1})$. Each step subtracts a combination of earlier columns, so the determinant doesn't change: $\det M = \det W$. The $w_k$ are pairwise orthogonal, so $W^{\top} W$ is diagonal with entries $\|w_k\|^2$, and
$$(\det M)^2 = \det(W^{\top} W) = \prod_k \|w_k\|^2 \le \prod_k \|v_k\|^2,$$
because $v_k = w_k + p_k$ with $p_k \perp w_k$ gives $\|w_k\| \le \|v_k\|$. ∎

Equality holds exactly when every $p_k = 0$, that is, when the columns are already orthogonal. For a $\pm 1$ matrix each column has length $\sqrt{n}$, so
$$|\det M| \le n^{n/2},$$
with equality exactly for Hadamard matrices. (This is how the Lean file defines them; it also states the equivalence with $M^{\top} M = nI$.)

## Why $n$ must be a multiple of 4

Negating a column of a Hadamard matrix keeps it Hadamard, so we may assume the first row is all $+1$. Take $n \ge 3$ and look at rows 2 and 3. Sort the columns by their signs in those two rows, and let $a, b, c, d$ count the columns with signs $(+,+)$, $(+,-)$, $(-,+)$, $(-,-)$. Then

- $a + b + c + d = n$ (all columns),
- $a + b - c - d = 0$ (row 2 is orthogonal to row 1),
- $a - b + c - d = 0$ (row 3 is orthogonal to row 1),
- $a - b - c + d = 0$ (row 2 is orthogonal to row 3).

Adding the four equations gives $4a = n$. ∎

## Two ways to build them

**Doubling (Sylvester).** If $H$ is Hadamard of order $n$, then
$$\begin{pmatrix} H & H \\ H & -H \end{pmatrix}$$
is Hadamard of order $2n$: its product with its transpose is $\operatorname{diag}(2HH^{\top}, 2HH^{\top}) = 2nI$. Starting from $(1)$ gives every power of 2. More generally, the Kronecker product of Hadamard matrices of orders $m$ and $n$ is Hadamard of order $mn$, since $(H \otimes K)(H \otimes K)^{\top} = HH^{\top} \otimes KK^{\top}$.

**Quadratic residues (Paley).** Let $q$ be a prime with $q \equiv 3 \pmod 4$, and let $\chi(x)$ be the Legendre symbol: $0$ if $q \mid x$, $+1$ if $x$ is a nonzero square mod $q$, and $-1$ otherwise. Index rows and columns by $0, 1, \dots, q-1$ and set $Q_{ij} = \chi(j - i)$. Three facts:

1. $Q^{\top} = -Q$, because $\chi(-1) = (-1)^{(q-1)/2} = -1$ when $q \equiv 3 \pmod 4$ (Euler's criterion).
2. Every row of $Q$ sums to $0$: there are as many nonzero squares as non-squares mod $q$.
3. $QQ^{\top} = qI - J$, where $J$ is the all-ones matrix. The off-diagonal entries are $\sum_x \chi(x)\chi(x+d)$ with $d \ne 0$. For $x \ne 0$, $\chi(x)\chi(x+d) = \chi(x)^2 \chi(1 + d/x) = \chi(1 + d/x)$, and as $x$ runs over the nonzero residues, $1 + d/x$ runs over every residue except $1$. So the sum is $\sum_y \chi(y) - \chi(1) = -1$.

Now border $Q$: let $S$ be the $(q+1) \times (q+1)$ matrix with first row $(0, 1, \dots, 1)$, first column $(0, -1, \dots, -1)^{\top}$, and $Q$ in the remaining block. The three facts give $S^{\top} = -S$ and $SS^{\top} = qI$. Then $H = I + S$ has entries $\pm 1$ and
$$HH^{\top} = (I + S)(I - S) = I - S^2 = I + SS^{\top} = (q+1)I.$$
So there is a Hadamard matrix of order $q + 1$. With $q = 11$ this gives order 12, the size of the example in Hadamard's 1893 paper that the Lean file checks.

According to Tao's page, Paley's 1933 paper does this for every prime power $q \equiv 3 \pmod 4$, and also gives order $2(q+1)$ for prime powers $q \equiv 1 \pmod 4$.

## Try it

I checked all of this by computer. The $12 \times 12$ matrix in the Lean file satisfies $HH^{\top} = 12I$ and $|\det H| = 12^6$. Doubling works up to order 64. The Paley matrix above is Hadamard for every prime $q \equiv 3 \pmod 4$ up to $83$. An exhaustive search finds no Hadamard matrix of order 3, 5, 6 or 7. For $3 \times 3$ and $5 \times 5$ sign matrices, where $n^{n/2}$ isn't an integer, the largest determinants are $4$ and $48$, against bounds of about $5.20$ and $55.9$.

These constructions don't cover everything. Combining powers of 2, both Paley families (as stated on Tao's page) and Kronecker products, the multiples of 4 up to 300 they miss are
$$92,\ 116,\ 156,\ 172,\ 184,\ 188,\ 232,\ 236,\ 260,\ 268,\ 292.$$
All of these have been built by other methods (see below), but each needed an idea beyond the two above.

## Where it stands

According to the [optimization-constants page](https://github.com/teorth/optimizationproblems/blob/main/constants/23a.md), which cites Cati and Pasechnik's 2024 database of constructions:

- Hadamard matrices are known for every order $n \equiv 0 \pmod 4$ below $668$.
- Up to $1208$, the only unresolved orders are $668$, $716$, $892$ and $1132$.
- No finite upper bound for the first missing order is known. The conjecture says there isn't one.

The page's references show how slowly the gaps close: one 2005 paper is titled *A Hadamard matrix of order 428*.

**Why it's worth knowing.** It's a question about $\pm 1$ matrices that a first linear algebra course can state, prove the basic facts about, and test by computer, yet the constructions already pull in quadratic residues and finite fields. Hadamard's inequality is also the cleanest example of a determinant read as a volume: $|\det M|$ is the volume of the box spanned by the columns, and a box with given edge lengths has the most volume when its edges are perpendicular.

## Read more

- [`FormalConjectures/Wikipedia/Hadamard.lean`](https://github.com/google-deepmind/formal-conjectures/blob/main/FormalConjectures/Wikipedia/Hadamard.lean) in [google-deepmind/formal-conjectures](https://github.com/google-deepmind/formal-conjectures): the conjecture (tagged `research open`, AMS 15), the open question about order 668, Hadamard's $12 \times 12$ example with a Lean proof that it works, and a link to [Hadamard's 1893 paper on Gallica](https://gallica.bnf.fr/ark:/12148/bpt6k486252g/f400.image.r).
- [Constant 23a](https://teorth.github.io/optimizationproblems/constants/23a.html) in Terence Tao's [crowdsourced list of optimization constants](https://github.com/teorth/optimizationproblems): known bounds, the classical families, and references, including Cati and Pasechnik, [*A database of constructions of Hadamard matrices*](https://arxiv.org/abs/2411.18897).
