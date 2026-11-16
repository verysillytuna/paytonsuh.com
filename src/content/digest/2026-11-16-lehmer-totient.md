---
title: "When φ(n) divides n − 1: Lehmer's totient problem"
date: 2026-11-16
summary: "Every prime p has φ(p) = p − 1, so φ(p) divides p − 1. D. H. Lehmer asked whether any composite number does the same. A few lines show such a number would be an odd, squarefree Carmichael number with at least three prime factors, and the question is still open."
tags: [number theory, Euler's totient, Carmichael numbers, open problems, Lean]
---

**TL;DR.** No new story from the last two days could be checked against a primary source, so this entry is an open problem worth knowing. For a prime $p$, Euler's totient is $\varphi(p) = p - 1$, so trivially $\varphi(p) \mid p - 1$. **Lehmer's totient problem** asks whether any *composite* $n > 1$ has $\varphi(n) \mid n - 1$. If none does, the divisibility characterizes the primes. Google DeepMind's `formal-conjectures` repository states the question in Lean and tags it as an open research problem.

## What a counterexample would have to look like

Suppose $n$ is composite and $\varphi(n) \mid n - 1$.

**$n$ is odd.** For $n > 2$, $\varphi(n)$ is even. If $n$ were even, $n - 1$ would be odd, and an even number can't divide it.

**$n$ is squarefree.** If $p^2 \mid n$, then $p \mid \varphi(n)$, because $\varphi(p^2) = p(p-1)$ divides $\varphi(n)$. Then $p \mid n - 1$, while also $p \mid n$, which is impossible.

**$n$ is a Carmichael number.** So $n$ is a product of distinct odd primes, and $\varphi(n)$ is the product of $q - 1$ over the primes $q \mid n$. For each prime $p \mid n$, the factor $p - 1$ divides $\varphi(n)$, hence divides $n - 1$. A squarefree composite $n$ with $p - 1 \mid n - 1$ for every prime $p \mid n$ is exactly a Carmichael number (Korselt's criterion): $a^{n-1} \equiv 1 \pmod n$ for every $a$ coprime to $n$. So a counterexample to Lehmer would be a very special Carmichael number, one where the *product* of all the $p - 1$ divides $n - 1$, not just each factor.

**$n$ has at least three prime factors.** Take $n = pq$ with odd primes $p < q$. Then
$$n - 1 = pq - 1 = (p-1)(q-1) + (p-1) + (q-1),$$
so $\varphi(n) = (p-1)(q-1)$ divides $n - 1$ only if it divides $p + q - 2$. But $p - 1 \ge 2$ gives $(p-1)(q-1) \ge 2(q - 1) > p + q - 2$, and $p + q - 2 > 0$. So two primes never work.

**The quotient is at least 2.** A composite $n$ has some $d$ with $1 < d < n$ and $d \mid n$, so at least two of $1, \dots, n$ (namely $d$ and $n$) share a factor with $n$, and $\varphi(n) \le n - 2 < n - 1$. A counterexample therefore needs $(n-1)/\varphi(n) \ge 2$, which forces $\prod_{p \mid n} (1 - 1/p) < 1/2$, so $n$ needs several smallish prime factors.

## Try it

I computed $\varphi(n)$ with a sieve for every $n \le 10^8$. No composite $n$ in that range has $\varphi(n) \mid n - 1$. The same run found 255 Carmichael numbers below $10^8$. Here are the first few, with the quotient that would have to be an integer:

| $n$ | factorization | $\varphi(n)$ | $(n-1)/\varphi(n)$ |
|---|---|---|---|
| 561 | $3 \cdot 11 \cdot 17$ | 320 | 1.75 |
| 1105 | $5 \cdot 13 \cdot 17$ | 768 | 1.4375 |
| 1729 | $7 \cdot 13 \cdot 19$ | 1296 | 1.333… |
| 2465 | $5 \cdot 17 \cdot 29$ | 1792 | 1.375 |
| 62745 | $3 \cdot 5 \cdot 47 \cdot 89$ | 32384 | 1.9375 |

The quotient is always above 1 (every Carmichael number is composite) and, in this range, always below 2. The last row comes closest: $62744 / 32384 = 31/16$. It is the only Carmichael number below $10^8$ whose quotient exceeds $1.75$, and it still falls short of 2.

**Why it's worth knowing.** Each step above is a one-line argument, and together they reduce the question to a narrow family of Carmichael numbers. The problem is still open anyway. It is good practice with $\varphi$, and it is a clean example of a gap that comes up often in number theory: the constraints pile up quickly, and still nobody can show that no number satisfies all of them.

## Read more

- [`FormalConjectures/Wikipedia/LehmerTotient.lean`](https://github.com/google-deepmind/formal-conjectures/blob/main/FormalConjectures/Wikipedia/LehmerTotient.lean) in [google-deepmind/formal-conjectures](https://github.com/google-deepmind/formal-conjectures), which states the problem (tagged `research open`, AMS 11) and points to the [Wikipedia article](https://en.wikipedia.org/wiki/Lehmer%27s_totient_problem).
