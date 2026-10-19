---
title: "The union-closed sets conjecture: a one-line question, and how far entropy gets"
date: 2026-10-19
summary: "No new result I could confirm this weekend, so here's an open problem worth knowing instead. Frankl's 1979 conjecture is easy to state. Since 2022, a short entropy argument has pushed the provable fraction from nothing to about 38%, and the method seems to stop there."
tags: [combinatorics, open problems, information theory]
---

**TL;DR.** I couldn't confirm any big story from the last two days, so this entry covers an open problem instead. A family of sets is *union-closed* if the union of any two of its sets is also in the family. Frankl conjectured in 1979 that some element then lies in at least half of the sets. For more than forty years nobody could prove even "some element is in 1% of them." In November 2022 Justin Gilmer did exactly that, with a short argument from information theory ([arXiv:2211.09055](https://arxiv.org/abs/2211.09055)). Within weeks other authors pushed the constant to about $0.38$. The conjecture itself, $1/2$, is still open.

## The question

Let $\mathcal{F}$ be a finite family of finite sets, with at least one nonempty set, such that $A, B \in \mathcal{F}$ implies $A \cup B \in \mathcal{F}$. **Conjecture (Frankl):** some element belongs to at least $|\mathcal{F}|/2$ of the sets.

The power set of $\{1,\dots,n\}$ shows that $1/2$ can't be improved: every element is in exactly half the subsets. Small cases are a good exercise. I checked by brute force that on a ground set of at most 4 elements, all 4,958 union-closed families satisfy the conjecture, and the best element is never in less than exactly half the sets. Of course this proves nothing in general. The conjecture is hard because a union-closed family can be very far from a power set.

## Gilmer's idea, in one paragraph

Pick $A$ and $B$ independently and uniformly at random from $\mathcal{F}$. Then $A \cup B$ is again a set in $\mathcal{F}$. A random variable that takes values in $\mathcal{F}$ has entropy at most $\log |\mathcal{F}|$, and the uniform $A$ attains that maximum. So $H(A \cup B) \le H(A)$. Now suppose every element is *rare*, lying in less than a $p$ fraction of the sets. Then taking a union makes each element more likely to appear: roughly, its probability goes from $p_i$ to $1-(1-p_i)^2$. Gilmer showed that when all the $p_i$ are below $0.01$, this spreading-out forces $H(A \cup B) > H(A)$, which contradicts the inequality above. So some element must be in at least 1% of the sets. The whole argument fits in a few pages, and the only tools are entropy and conditional entropy.

## How far the method goes

- **About 0.38197.** Gilmer suggested his method could reach $\psi = (3-\sqrt5)/2 \approx 0.38197$. Several groups confirmed this within days. That number is the root in $(0,1)$ of $(1-x)^2 = x$. One way to remember it: an element at frequency exactly $\psi$ is missing from $A \cup B$ with probability $(1-\psi)^2 = \psi$. For an approximate version of the problem, $\psi$ is the best possible constant. That's why the argument as first written can't reach $1/2$.
- **About 0.38234.** Sawin showed the method can go slightly past $\psi$. [arXiv:2212.00658](https://arxiv.org/abs/2212.00658), "Dimension-free bounds for the union-closed sets conjecture," made that improvement computable. It evaluates to about $0.38234$. A later paper attributes this value to Yu and to Cambie.
- **About 0.38271.** Jingbo Liu used a different coupling of $A$ and $B$ and reached about $0.38271$, under hypotheses checked numerically ([arXiv:2306.08824](https://arxiv.org/abs/2306.08824)).

So the gap is now $0.383$ versus $0.5$, and every improvement since late 2022 has been in the third decimal place. Closing it seems to need a new idea, not a better coupling.

## Why it's worth knowing

It's a clean example of a method from one field (Shannon entropy) cracking a problem from another (extremal set theory). Similar entropy arguments now show up all over combinatorics. You can follow the 2022 argument with only basic probability. If you want a combinatorics problem to think about, the brute-force check above is a good starting point: extend it to five elements, where there are far too many families to list naively, and find out what that takes.

*Sources: the arXiv abstracts above, read through search listings (arXiv itself was unreachable from here). The brute-force count and the identity $(1-\psi)^2=\psi$ are my own checks.*
