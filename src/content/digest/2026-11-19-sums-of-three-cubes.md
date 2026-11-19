---
title: "Sums of three cubes: which integers are x³ + y³ + z³?"
date: 2026-11-19
summary: "Cubes are 0 or ±1 mod 9, so no integer that is 4 or 5 mod 9 is a sum of three integer cubes. The conjecture is that every other integer is, but solutions can be enormous: the known ones for 33 and 42 use 16- and 17-digit cubes."
tags: [number theory, Diophantine equations, computation, open problems, Lean]
---

**TL;DR.** No new story from the last two days could be checked against a primary source, so this is an open problem worth knowing. Which integers $n$ can be written as
$$
n = x^3 + y^3 + z^3, \qquad x, y, z \in \mathbb{Z}?
$$
Negative cubes are allowed, which is what makes the question hard. A one-line congruence rules out $n \equiv 4, 5 \pmod 9$. Google DeepMind's `formal-conjectures` repository states the conjecture that *every other integer works* in Lean and tags it as an open research problem. Over $\mathbb{Q}$ the question is easy, and with five cubes it is easy; with three integer cubes the known solutions for some small $n$ have 16 or more digits.

## The obstruction mod 9

Every cube is $0$, $1$ or $-1 \pmod 9$. Write $x = 3q + s$ with $s \in \{0, 1, -1\}$; then
$$
x^3 = 27q^3 + 27q^2 s + 9 q s^2 + s^3 \equiv s^3 \pmod 9.
$$
A sum of three numbers from $\{0, 1, -1\}$ lies in $\{-3, \dots, 3\}$, which mod 9 is $\{0, 1, 2, 3, 6, 7, 8\}$. The residues $4$ and $5$ never appear. ∎

The Lean file proves exactly this by reducing to $\mathbb{Z}/9\mathbb{Z}$ and checking every case with `decide`.

## Three easy relatives

**Rational cubes.** Every rational $r$ is a sum of three rational cubes. The Lean file attributes this to Ryley (1825) and proves it with an explicit formula: for $r \ne 0$,
$$
x = \frac{r^6 + 45r^4 - 81r^2 + 27}{6r(r^2+3)^2}, \quad y = \frac{6r(3 - r^2)}{(r^2+3)^2}, \quad z = \frac{(r^2 + 6r + 3)(-r^2 + 6r - 3)}{6r(r^2+3)}.
$$
For $r = 4$ this gives $4 = \left(\tfrac{14347}{8664}\right)^3 + \left(-\tfrac{312}{361}\right)^3 + \left(\tfrac{215}{456}\right)^3$, even though $4$ is not a sum of three *integer* cubes. The mod 9 argument says nothing about rationals whose denominators are divisible by 3.

**Five integer cubes.** Every integer is a sum of five integer cubes. Expanding gives
$$
(k+1)^3 + (k-1)^3 + (-k)^3 + (-k)^3 = 6k.
$$
Since $n^3 - n = (n-1)n(n+1)$ is a product of three consecutive integers, it is divisible by 6. So $n - n^3 = 6k$ for some integer $k$, and $n = n^3 + 6k$ is a sum of five cubes. ∎

**Polynomial families.** Some $n$ have infinitely many representations because of polynomial identities. Two classical ones, true for every integer $t$:
$$
(9t^4)^3 + (3t - 9t^4)^3 + (1 - 9t^3)^3 = 1, \qquad (1 + 6t^3)^3 + (1 - 6t^3)^3 + (-6t^2)^3 = 2.
$$
Multiplying through by $m^3$ handles $m^3$ and $2m^3$ as well. For most $n$ no such family is known.

## How the big solutions are found

Brute force over a box $|x|, |y|, |z| \le N$ costs about $N^2$ steps, which is hopeless for 16-digit numbers. The search code in Andrew Sutherland's [SumsOfThreeCubes](https://github.com/AndrewVSutherland/SumsOfThreeCubes) repository (the implementation for Booker and Sutherland's paper *On a question of Mordell*) loops over $d = x + y$ instead. The idea fits in three steps:

1. Factor $x^3 + y^3 = (x + y)(x^2 - xy + y^2)$. So $d = x + y$ divides $n - z^3$, which means $z^3 \equiv n \pmod d$: $z$ is a **cube root of $n$ modulo $d$**.
2. There are few cube roots mod $d$, and they can be computed from the prime factorization of $d$. The code's comments describe exactly this: lists of cube roots of $k$ mod $d$, lifted and combined by the Chinese remainder theorem.
3. Given $d$ and $z$, the pair $(x, y)$ is forced. With $P = (n - z^3)/d = x^2 - xy + y^2 = d^2 - 3xy$, we get $xy = (d^2 - P)/3$, so $x$ and $y$ are the roots of $t^2 - dt + xy$.

The win is that $d$ is much smaller than $x$ and $y$ when they nearly cancel. In the Lean file's solution for $33$,
$$
33 = 8866128975287528^3 + (-8778405442862239)^3 + (-2736111468807040)^3,
$$
$d = x + y = 87{,}723{,}532{,}425{,}289$ has 14 digits while $x$ has 16. I checked that $z^3 \equiv 33 \pmod d$ and that steps 1–3 recover $x$ and $y$ exactly from $d$ and $z$.

## Try it

A direct search with $|x|, |y|, |z| \le 3000$ (a few seconds in NumPy) finds a representation for every $n$ from $0$ to $100$ that isn't $4$ or $5 \pmod 9$ except
$$
30,\ 33,\ 39,\ 42,\ 52,\ 74,\ 75,\ 84,\ 87.
$$
These aren't counterexamples; their solutions just lie far outside the box. The Lean file records the ones for $33$ (above) and $42$:
$$
42 = (-80538738812075974)^3 + 80435758145817515^3 + 12602123297335631^3.
$$
Both identities check by exact integer arithmetic. The number $3$ shows how sparse solutions can be. The same search finds only $1^3 + 1^3 + 1^3$ and $4^3 + 4^3 + (-5)^3$, yet
$$
3 = 569936821221962380720^3 + (-569936821113563493509)^3 + (-472715493453327032)^3,
$$
which also checks exactly.

## Where it stands

- Proved: $n \equiv 4, 5 \pmod 9$ is impossible, and every rational is a sum of three rational cubes.
- Open: whether every integer that isn't $4$ or $5 \pmod 9$ is a sum of three integer cubes. In `formal-conjectures` the statement `isSumOfThreeCubes_iff_mod_9` is tagged `research open`, and its proof is `sorry`.
- The README of Sutherland's code gives its input range as cubefree $k \equiv \pm 3 \pmod 9$ up to $1000$: hard cases are attacked one $k$ at a time, with large computations.

**Why it's worth knowing.** Everything above uses only congruences and factoring, the material of a first number theory or abstract algebra course: cubes mod 9, the factorization of $x^3 + y^3$, and cube roots modulo $d$ via the Chinese remainder theorem. It's also a clean example of the gap between rational and integer solutions, and of how much a better way of organizing a search can matter.

## Read more

- [`SumOfThreeCubes.lean`](https://github.com/google-deepmind/formal-conjectures/blob/main/FormalConjectures/Wikipedia/SumOfThreeCubes.lean) in [google-deepmind/formal-conjectures](https://github.com/google-deepmind/formal-conjectures): the open conjecture, Lean proofs of the mod 9 obstruction and of Ryley's rational theorem, and the representations of 33 and 42.
- [AndrewVSutherland/SumsOfThreeCubes](https://github.com/AndrewVSutherland/SumsOfThreeCubes): C search code for Booker and Sutherland's [*On a question of Mordell*](https://arxiv.org/abs/2007.01209), with comments on the cube-roots-mod-$d$ method.
