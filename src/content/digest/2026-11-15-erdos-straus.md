---
title: "Four over n: the Erdős–Straus conjecture"
date: 2026-11-15
summary: "Every 4/n with n > 2 should be a sum of three distinct unit fractions. Four one-line identities settle every n except those whose prime factors are all 1 mod 24, which is where the problem stays open."
tags: [number theory, Egyptian fractions, open problems, Lean]
---

**TL;DR.** No new story this weekend could be checked against a primary source, so this entry is an open problem worth knowing. The **Erdős–Straus conjecture** says that for every integer $n > 2$,
$$\frac4n = \frac1x + \frac1y + \frac1z \quad\text{with integers } 1 \le x < y < z.$$
It is Erdős Problem 242, and Google DeepMind's `formal-conjectures` repository states it in Lean as an open research problem. A few lines of algebra reduce it to primes $p \equiv 1 \pmod{24}$. That reduction is the easy part, and no one has found a way through the last residue class.

## Reducing to primes

**Multiples are free.** If $4/m = 1/x + 1/y + 1/z$, then dividing by $k$ gives $4/(km) = 1/(kx) + 1/(ky) + 1/(kz)$, and the denominators stay distinct. Every $n > 2$ is a multiple of $4$ or of an odd prime, and $4/4 = 1/2 + 1/3 + 1/6$. So it is enough to handle odd primes $p$.

**Three easy classes.** Each identity below gives three distinct denominators.

- $p \equiv 3 \pmod 4$. Put $a = (p+1)/4$. Then $4/p = 1/a + 1/(pa)$, and splitting $1/m = 1/(m+1) + 1/(m(m+1))$ gives
$$\frac4p = \frac1a + \frac1{pa+1} + \frac1{pa(pa+1)}.$$
- $p \equiv 2 \pmod 3$. Put $b = (p+1)/3$. Then
$$\frac4p = \frac1b + \frac1p + \frac1{pb}.$$
- $p \equiv 5 \pmod 8$. Put $c = (p+3)/4$, which is even because $8 \mid p+3$. Then $4/p - 1/c = 3/(pc)$, and $3/(pc) = 2/(pc) + 1/(pc)$, so
$$\frac4p = \frac1c + \frac1{pc/2} + \frac1{pc}.$$

A prime that falls into none of these classes is $1 \bmod 4$, $1 \bmod 3$ and $1 \bmod 8$, so it is $1 \bmod 24$. All the difficulty sits there. The conjecture holds for every $n > 2$ unless all of the odd prime factors of $n$ are $1 \bmod 24$ and $4 \nmid n$.

**Try it.** I checked each identity with exact rational arithmetic for every prime below 5000 outside that class. A brute-force search then found a decomposition for every $n$ from 3 to 3000. Here are the first primes $\equiv 1 \pmod{24}$ and the decomposition with the smallest $x$:

| $p$ | $x$ | $y$ | $z$ |
|---|---|---|---|
| 73 | 20 | 210 | 30660 |
| 97 | 25 | 810 | 392850 |
| 193 | 50 | 1380 | 1331700 |
| 241 | 62 | 2139 | 1030998 |

No pattern in these rows gives a formula. Each identity above handles a whole residue class at once. The open question is whether some combination of such classes, or a different argument, covers every prime $\equiv 1 \pmod{24}$. Until then the problem stays open, even though each single case is easy to check.

## A generalization

The same Lean file also states **Schinzel's generalization**: for each fixed $a \ge 1$, the fraction $a/n$ is a sum of three distinct unit fractions once $n$ is large enough. Both statements in the file end in `sorry` and carry the tag `research open`.

**Why it's worth knowing.** The problem takes one line to state and one afternoon to reduce, and the reductions above are good practice with congruences. It is also a clean example of a gap that comes up often in number theory: a statement that is easy to check case by case, with no argument that covers every case.

## Read more

- [`FormalConjectures/ErdosProblems/242.lean`](https://github.com/google-deepmind/formal-conjectures/blob/main/FormalConjectures/ErdosProblems/242.lean) in [google-deepmind/formal-conjectures](https://github.com/google-deepmind/formal-conjectures), which states the conjecture and Schinzel's variant. The file cites [erdosproblems.com/242](https://www.erdosproblems.com/242) and Sierpiński's 1956 paper in *Mathesis*.
