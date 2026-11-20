---
title: "Gilbreath's conjecture: the triangle of prime differences that always starts with 1"
date: 2026-11-20
summary: "Write the primes in a row, take absolute differences of neighbours, and repeat. Every new row seems to begin with 1. Nobody can prove it, but a two-line argument shows why checking it is cheap, and an experiment suggests it has more to do with small gaps than with primes."
tags: [number theory, primes, computation, open problems, Lean]
---

**TL;DR.** No new story from the last two days could be checked against a primary source, so this entry is an open problem you can explore in an afternoon. Write the primes in a row. Under them write the absolute differences of neighbours, then the absolute differences of *those*, and so on. **Gilbreath's conjecture** says every row after the first begins with $1$. Google DeepMind's `formal-conjectures` repository states it in Lean and tags it as an open research problem. Below: the triangle, two short proofs about its structure, and a computer experiment.

## The triangle

Let $d^0(n) = p_n$, the $n$-th prime counting from $p_0 = 2$, and
$$
d^{k}(n) = \left| d^{k-1}(n+1) - d^{k-1}(n) \right|.
$$
The conjecture is that $d^k(0) = 1$ for every $k \ge 1$. The first rows:

```text
2  3  5  7  11  13  17  19  23  29  31  37
 1  2  2  4   2   4   2   4   6   2   6
  1  0  2  2   2   2   2   2   4   4
   1  2  0  0   0   0   0   2   0
    1  2  0  0   0   0   2   2
     1  2  0  0   0   2   0
      1  2  0  0   2   2
       1  2  0   2   0
```

Two things stand out: the left edge is all $1$s, and after the first couple of rows almost everything else is $0$ or $2$.

## Two facts you can prove

**Parity.** In every row $k \ge 1$, every entry except the first is even. Every prime after $2$ is odd, so row $1$ is $1$ followed by differences of odd numbers, which are even. If a row is (odd, even, even, …), the next row starts with |even − odd|, which is odd, and the rest are differences of even numbers, which are even. ∎

So the conjecture only asks whether the leading odd number is $1$ rather than $3, 5, \dots$. Suppose row $k$ starts with $1$ and its second entry is $a$. Row $k+1$ starts with $|a - 1|$, and $a$ is even, so

$$
d^{k+1}(0) = 1 \iff d^{k}(1) \in \{0, 2\}.
$$

**The 0–2 zone persists.** Suppose row $k$ is $1, a_1, a_2, \dots, a_m$ with every $a_i \in \{0, 2\}$. Then row $k+1$ is $|a_1 - 1| = 1$ followed by differences of numbers in $\{0, 2\}$, which are again $0$ or $2$. By induction every later row of the triangle also starts with $1$. ∎

This is why checking the conjecture by computer is cheap. You don't need to compute the whole triangle: once one row consists of a $1$ followed only by $0$s and $2$s, every row below it is settled.

## Try it

I computed the triangle for the first $20{,}000$ primes (up to $224{,}737$) with NumPy. Every one of its $19{,}999$ rows begins with $1$. Better, the persistence argument kicks in early. The table shows, for row $k$, where the first entry bigger than $2$ is (counting the leading $1$ as position $0$).

| Row $k$ | First entry $> 2$ at position |
|---|---|
| 1 | 3 |
| 2 | 8 |
| 3 | 14 |
| 10 | 59 |
| 30 | 870 |
| 100 | none (the row has 19,900 entries) |

So by row $100$ the whole row is a $1$ followed by $0$s and $2$s, and the remaining $19{,}899$ rows follow from the argument above without being looked at.

## Is it about primes at all?

A natural guess is that the conjecture has little to do with primality, and much more to do with the gaps: they are even, and small compared with the numbers themselves. Here is a quick test. Keep the true primes below some starting point $S$, then continue with fake "primes": add even gaps drawn at random with mean about $1$, $2$ or $4$ times $\ln p$ (real prime gaps near $p$ average about $\ln p$). For each setting I built 20 sequences of 3,000 terms and checked whether every row begins with $1$.

Failures out of 20 sequences:

| Real primes kept | Gaps $\times 1$ | Gaps $\times 2$ | Gaps $\times 4$ |
|---|---|---|---|
| none (start $2, 3$) | 11 | 18 | 19 |
| below $100$ | 1 | 3 | 10 |
| below $1000$ | 0 | 0 | 0 |

Every failure happens early, by row $57$ at the latest. A random start can open with a big gap (the sequence $2, 3, 9$ already fails at row $2$), but once the sequence has begun with the real primes up to $1000$, even gaps four times too large never broke it in these trials. This is an experiment, not a theorem, and the model of the gaps is crude. It does suggest what any proof has to explain: why the beginning of the sequence is tame enough, rather than some deep property of primes far out.

## Where it stands

- Proved (above): every entry after the first in rows $k \ge 1$ is even, the conjecture for row $k+1$ is equivalent to $d^k(1) \in \{0, 2\}$, and a row made of a $1$ followed only by $0$s and $2$s settles every row beneath it.
- Open: whether $d^k(0) = 1$ for every $k \ge 1$. In `formal-conjectures`, `gilbreath_conjecture` is tagged `research open` and its proof is `sorry`.

**Why it's worth knowing.** It's a conjecture whose statement fits on one line, whose computer check is a ten-line program, and whose structure (parity, an invariant that propagates down the triangle) is the kind of argument that shows up in Putnam problems. It's also a good lesson in asking which hypothesis a conjecture really uses.

## Read more

- [`Gilbreath.lean`](https://github.com/google-deepmind/formal-conjectures/blob/main/FormalConjectures/Wikipedia/Gilbreath.lean) in [google-deepmind/formal-conjectures](https://github.com/google-deepmind/formal-conjectures): the definition of the difference rows and the open statement.
