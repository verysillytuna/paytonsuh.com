---
title: "Erdős's first problem, disproved in Lean"
date: 2026-11-12
summary: "A quiet news day, so a recent result worth knowing: Erdős problem #1, which he dated to 1931, is false. A sum-distinct set of n numbers can fit in {1, …, N} with N/2ⁿ as small as you like. The disproof was found by an AI model and checked in Lean; one of its building blocks is a short argument you can follow by hand."
tags: [additive combinatorics, number theory, formalization, Lean, AI and mathematics]
---

**TL;DR.** I couldn't confirm a new result from the last day or two against a source I could read, so today's entry is a recent one. A set $A \subseteq \{1, \dots, N\}$ is **sum-distinct** if different subsets of $A$ have different sums. Erdős asked whether such a set of size $n$ forces $N \geq C \cdot 2^n$ for some absolute constant $C > 0$. He called it "perhaps my first serious problem", dated it to 1931, and offered \$500. The answer is **no**. A Lean proof posted in September 2026 shows that $N / 2^n$ can be made smaller than any $\varepsilon > 0$. A pre-release OpenAI model found the proof on its own while being tested on a benchmark of open Erdős problems. The proof is machine-checked, but the paper describing it hasn't been refereed. The argument is also ineffective: it gives no bound on how large $n$ must be for a given $\varepsilon$.

## The problem

The powers of two, $\{1, 2, 4, \dots, 2^{n-1}\}$, are sum-distinct: subset sums are binary expansions. That gives $N = 2^{n-1}$. You can do a little better. The best sets for small $n$ are known; for example $\{3, 5, 6, 7\}$ is sum-distinct with $N = 7 < 2^3$. Before this year the best construction (Bohman, 1998) reached about $0.22 \cdot 2^n$.

In the other direction, the $2^n$ subset sums are distinct integers between $0$ and $nN$, so $N \geq (2^n - 1)/n$. Erdős and Moser (1956) improved this to $N \gg 2^n / \sqrt{n}$ with a variance argument, and the constant has been pushed up since. The current record is $\sqrt{2/\pi}$, from unpublished work of Elkies and Gleason. So the truth was known to lie between $2^n/\sqrt{n}$ and $0.22 \cdot 2^n$, and Erdős conjectured it was the upper end. The new result says the truth is $o(2^n)$. Where it lies between $2^n/\sqrt{n}$ and $o(2^n)$ is still open.

## How the disproof goes

The argument has two parts. The first is elementary; the second is where the work is.

**Binary blocks.** Suppose $a_1, \dots, a_m$ are positive integers with no relation $\sum_i c_i a_i = 0$ in which the integers $c_i$ are not all zero and satisfy $|c_i| < 2^k$. Then the $n = mk$ numbers
$$a_i \cdot 2^j, \qquad 1 \leq i \leq m, \quad 0 \leq j < k,$$
are sum-distinct. Here's why. A subset sum has the form $\sum_i c_i a_i$, where $c_i$ is the number between $0$ and $2^k - 1$ whose binary digits record which of $a_i, 2a_i, 4a_i, \dots$ you took. Two different subsets give different digit patterns, so different vectors $(c_i)$. If the two sums were equal, subtracting would give a relation with coefficients $|c_i - c_i'| < 2^k$, not all zero. That's ruled out.

For example, $3$ and $5$ have no relation with coefficients below $4$ (the smallest is $5 \cdot 3 - 3 \cdot 5$), so $\{3, 6, 5, 10\}$ is sum-distinct. But $2$ and $3$ satisfy $3 \cdot 2 - 2 \cdot 3 = 0$, and $\{2, 4, 3, 6\}$ fails: $2 + 4 = 6$.

**Small determinants.** The largest element of such a set is $\max_i a_i \cdot 2^{k-1}$, so you want weights $a_i$ that are as small as possible while still avoiding short relations. The proof gets them from linear algebra. It builds a sequence of $n \times n$ rational matrices with special properties whose determinants tend to $0$, and turns each one into a large sum-distinct set. Thomas Bloom, who runs erdosproblems.com, reinterpreted the construction in terms of lattices; according to the repository, his sketch is on the problem page. The second machine proof uses a cyclic-lattice construction, and the benchmark paper judges the two to be essentially the same argument.

## How it was found and checked

The proof came out of **FrontierMath Erdős** (Adamczewski and Bloom, 2026), a benchmark of 68 open Erdős problems stated in Lean. Each attempt runs autonomously in a network-isolated container under a fixed budget. The repository reports two independent successful attempts, the cheaper at about \$400 and 27 hours of working time. The statement checked is word for word the negation of Google DeepMind's [Formal Conjectures](https://github.com/google-deepmind/formal-conjectures/blob/main/FormalConjectures/ErdosProblems/1.lean) version of the problem. A tool called Comparator confirms that the proved theorem matches that statement and uses only Lean's standard axioms.

Two cautions, both from the repository itself. First, Lean certifies the theorem, not the exposition: the README says its proof summaries "are not a human verification of the mathematics beyond what Comparator establishes". Second, it hasn't been established whether the ideas are new relative to the literature. The repository says only that the problem was listed as open as of August 2026.

**Try it.** I ran a short exhaustive search in Python. It proves nothing about large $n$; it only shows the numbers involved. The smallest $N$ admitting a sum-distinct set of size $n$ is $1, 2, 4, 7, 13, 24$ for $n = 1, \dots, 6$, so $N / 2^n$ goes $0.5, 0.5, 0.5, 0.44, 0.41, 0.375$. It drifts down slowly. The disproof says it eventually drops below any $\varepsilon$, without saying when.

## Read more

- [The Lean disproof and its README](https://github.com/tadamcz/erdos1) (Tom Adamczewski). `Challenge.lean` is the short statement to audit; the README explains the provenance, cost, and how to rerun the check.
- [The Formal Conjectures statement](https://github.com/google-deepmind/formal-conjectures/blob/main/FormalConjectures/ErdosProblems/1.lean), with the known lower bounds stated as variants.
- [The Erdős problems database](https://github.com/teorth/erdosproblems) on GitHub, which now records problem #1 as disproved, with a Lean proof.
