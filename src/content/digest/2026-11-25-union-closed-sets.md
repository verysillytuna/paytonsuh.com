---
title: "Union-closed families: an entropy proof gets to 38%, and the conjecture says 50%"
date: 2026-11-25
summary: "Frankl's union-closed sets conjecture says that in any finite family of sets closed under unions (other than {∅}), some element lies in at least half of the sets. Nobody could prove even a fixed constant fraction until Justin Gilmer's 2022 entropy argument gave 1%. Within days others pushed it to (3−√5)/2 ≈ 38%. The 1/2 is still open."
tags: [combinatorics, extremal set theory, information theory, open problems]
---

**TL;DR.** Another open problem that fits on an index card, and a good one to know ten days before the Putnam: the **union-closed sets conjecture** (Frankl, around 1979). In November 2022 Justin Gilmer, then at Google Research, proved the first constant bound, 1%, with an argument from information theory. Within about a week several groups sharpened it to $(3-\sqrt5)/2 \approx 0.382$. The conjectured $1/2$ is still open. The statement and the solved special cases below are read from Google DeepMind's [formal-conjectures file](https://github.com/google-deepmind/formal-conjectures/blob/9097e2f90e66d2f6244209cb1c07f7120d17ec53/FormalConjectures/Wikipedia/UnionClosed.lean), which tags the main statement `research open`.

## The problem

A finite family $\mathcal F$ of finite sets is **union-closed** if $X, Y \in \mathcal F$ implies $X \cup Y \in \mathcal F$.

> **Union-closed sets conjecture.** If $\mathcal F$ is union-closed and $\mathcal F \ne \{\varnothing\}$, then some element lies in at least half of the sets of $\mathcal F$.

The exclusion is needed: in $\{\varnothing\}$ no element lies in anything. And $1/2$ can't be raised. In the family of *all* subsets of an $n$-element set, every element lies in exactly $2^{n-1}$ of the $2^n$ sets. The formal-conjectures file proves this sharpness in Lean.

## A one-paragraph case: a singleton in the family

If $\{i\} \in \mathcal F$, then $i$ works. Split $\mathcal F$ into the sets $B$ that miss $i$ and the sets $C$ that contain $i$. The map $X \mapsto X \cup \{i\}$ sends $B$ into $C$, because $\mathcal F$ is union-closed and $\{i\} \in \mathcal F$. It is injective on $B$, because you can recover $X$ by removing $i$. So $|B| \le |C|$, and $|C| \ge |\mathcal F|/2$. The Lean file contains exactly this proof.

The same "add an element and inject" move is a standard competition tool. The hard part of the conjecture is that a general union-closed family need not contain any small set to anchor the injection.

## What was known before 2022

For forty years the results were of two kinds:

- **Small cases.** The conjecture holds when the ground set has at most 12 elements (Vučković and Živković, 2017), and when the family has at most 50 sets (Roberts and Simpson, 2010, combined with the 12-element case). Both are recorded as solved variants in the formal-conjectures file.
- **Weak general bounds.** Some element lies in a fraction of the sets that shrinks like $1/\log_2|\mathcal F|$. That goes to zero, so it isn't a constant.

## Gilmer's entropy argument

Gilmer's idea, in outline: pick two sets $A$ and $B$ **independently and uniformly** from $\mathcal F$. Then $A \cup B$ is again a set of $\mathcal F$. The Shannon entropy of a random element of $\mathcal F$ is at most $\log|\mathcal F|$, and the uniform $A$ attains that maximum. So

$$H(A \cup B) \;\le\; \log |\mathcal F| \;=\; H(A).$$

Now suppose every element lies in fewer than 1% of the sets. Then each coordinate of $A$ is rarely "on," and taking a union of two independent samples turns many more coordinates on. Gilmer proved that this *increases* entropy: $H(A \cup B) > H(A)$. That contradicts the display, so some element must lie in at least 1% of the sets.

The structure of this proof is common in modern combinatorics: assume the family is "spread out," show a random operation that stays inside the family would have to create information, and get a contradiction from the counting bound.

## The race to 38%

Gilmer's paper appeared on arXiv on November 16, 2022. Within days:

- **Chase and Lovett**, **Alweiss, Huang and Sellke**, and **Sawin** independently sharpened the entropy inequality and reached the constant $\dfrac{3-\sqrt5}{2} \approx 0.382$, a value Gilmer had predicted his method could give. Chase and Lovett also showed that $(3-\sqrt5)/2$ is the right answer for an "approximate" version of the problem, so this method alone can't reach $1/2$.
- Sawin sketched how to beat $0.382$ slightly by using dependent rather than independent samples, and showed that a stronger conjecture of Gilmer's, which would have implied the full result, is false.
- **Yu** (2023, *Entropy*) proved a constant of about $0.38234$. The formal-conjectures file records this as the current solved variant.

So, as of the file's latest version: some element lies in at least about $38.2\%$ of the sets, and the conjecture says $50\%$.

## Why look at it

- The singleton case is a clean exercise in injections. Try the next case on your own: what if $\mathcal F$ contains a two-element set?
- It's a recent example of a long-stuck problem moved by a researcher from outside the field (Gilmer worked in machine learning) using a tool from another area.
- The formal-conjectures file also lists an open refinement: if the bound $1/2$ is attained exactly, must $|\mathcal F|$ be a power of 2?

## Read more

I read the formal-conjectures file at the commit linked below. The paper details come from arXiv listings as summarized by a search engine. arXiv itself was blocked from where I wrote this, so I haven't quoted the papers.

- [formal-conjectures: `Wikipedia/UnionClosed.lean`](https://github.com/google-deepmind/formal-conjectures/blob/9097e2f90e66d2f6244209cb1c07f7120d17ec53/FormalConjectures/Wikipedia/UnionClosed.lean): the statement, the solved variants (Yu, the 12-element and 50-set cases), and Lean proofs of the singleton case and of sharpness.
- J. Gilmer, [A constant lower bound for the union-closed sets conjecture](https://arxiv.org/abs/2211.09055) (arXiv:2211.09055).
- Z. Chase, S. Lovett, [Approximate union closed conjecture](https://arxiv.org/abs/2211.11689) (arXiv:2211.11689).
- L. Yu, [Dimension-free bounds for the union-closed sets conjecture](https://arxiv.org/abs/2212.00658) (arXiv:2212.00658; *Entropy* 25 (2023), 767).
