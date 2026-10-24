---
title: "The Unique Games Conjecture, claimed"
date: 2026-10-24
summary: "A paper in OpenAI's October release claims to prove Khot's Unique Games Conjecture, which would make the Goemans–Williamson Max-Cut algorithm, the factor-two Vertex Cover algorithm, and semidefinite programming for every constraint problem provably optimal unless P = NP. The repository has a Lean statement of the main theorem; the paper is not refereed."
tags: [complexity theory, approximation algorithms, Fourier analysis, AI and mathematics, formal verification]
---

**TL;DR.** Family 102 in [OpenAI's math repository](https://github.com/openai/math) (see the [October 8 entry](/digest/2026-10-08-openai-math-catalog)) contains *The Unique Games Theorem*, dated September 23, 2026. It claims a proof of **Khot's Unique Games Conjecture (2002)**, the central open problem in hardness of approximation. If the proof is right, a long list of results that were proved "assuming UGC" become plain NP-hardness theorems. Among them: no polynomial-time algorithm beats the Goemans–Williamson ratio $\approx 0.878$ for Max-Cut, or factor $2$ for Vertex Cover, unless $\mathrm P = \mathrm{NP}$. The repository also has a Lean statement of the main theorem, wired to a proof module. The paper hasn't been refereed, and I couldn't read any specialist's assessment, so this is a claim.

## The problem

A **Unique Game** is a set of variables $x_v$ taking values in a finite alphabet $K$, together with constraints of the form $x_v = \pi(x_u)$, where each $\pi$ is a permutation of $K$. The simplest example is a system of equations
$$
x_v - x_u \equiv c_{uv} \pmod q .
$$
"Unique" means that fixing one endpoint's label forces the other's.

That makes the fully satisfiable case easy. Pick a vertex, try each of its $|K|$ labels, and propagate along edges: every constraint forces the next value, so you either get a satisfying labeling or a contradiction in linear time. The **Unique Games Conjecture** says the *almost* satisfiable case is hopeless. For every $\varepsilon, \delta > 0$ there is an alphabet size for which it is NP-hard to tell instances where a $1-\varepsilon$ fraction of constraints can be satisfied from instances where no labeling satisfies more than a $\delta$ fraction.

## Why people care

UGC turned out to be the missing piece that explains *exactly* how well many problems can be approximated:

- **Max-Cut.** Goemans and Williamson's 1995 semidefinite-programming algorithm cuts at least $\alpha_{\mathrm{GW}} \approx 0.87856$ of the optimum. Khot, Kindler, Mossel and O'Donnell showed that, under UGC, doing any better is NP-hard. Their proof used the *Majority Is Stablest* theorem from Boolean Fourier analysis.
- **Vertex Cover.** Taking both endpoints of a maximal matching gives a factor-$2$ approximation, which is a nice exercise. Khot and Regev showed that, under UGC, nothing does better.
- **Every constraint satisfaction problem.** Raghavendra (2008) showed that, under UGC, one basic semidefinite relaxation is the optimal polynomial-time algorithm for *every* CSP.

So the conjecture says that, for a huge class of problems, semidefinite programming is the end of the story. That's also why many people expected it to be false. Arora, Barak and Steurer found a subexponential-time algorithm for Unique Games in 2010, which rules out the most extreme forms of hardness.

The closest result before this was the **2-to-2 theorem** of Khot, Minzer and Safra (2018), building on work with Dinur and Kindler. It is built on a hard expansion theorem about the Grassmann graph of subspaces of $\mathbb F_2^n$. As the paper's introduction explains, it gives Unique Games hardness with completeness near $\tfrac12$ rather than near $1$. The remaining gap was getting completeness from $\tfrac12$ up to $1-\varepsilon$.

## What the paper claims, and how

I read the abstract, the introduction (Sections 1.1–1.4) and the start of Section 8. The main theorem (Theorem 1.1) gives, for fixed $\varepsilon, \delta \in (0, \tfrac12)$, a deterministic polynomial-time reduction from 3SAT to explicit, unweighted, bipartite Unique Games over $K = \mathbb F_2^s$. Every constraint is a translation $x_v = x_u + c$. Satisfiable formulas give value $\ge 1-\varepsilon$; unsatisfiable ones give value $\le \delta$.

The introduction pins the $\tfrac12$ barrier on a single line of algebra. In the matrix "shortcode" test of Barak, Kothari and Steurer, a table on binary matrices $M$ is checked against a rank-one update $M + a l^{\top}$. The honest answer $f_z(M) = Mz$ changes by $a\,(l^{\top} z)$, which is nonzero about half the time, so the honest strategy loses half the constraints. The paper's fix is a **nonlinear gadget** (Lemma 3.1). It is a map $C$ on a larger binary space, built from recursive quadratic blocks, together with a special noise distribution. $C$ commutes with translations by $K$, and the noise moves $C$'s output with probability at most a prescribed $p$. Yet any linear observation of high enough rank still detects the noise with probability at least $\tfrac18$. Passing honest answers through $C$ brings completeness back near $1$. That $\tfrac18$ is what lets soundness reduce to the Grassmann-based inverse theorem, which the paper takes from Khot–Minzer–Safra as its one external input.

The rest of the soundness argument follows the 2-to-2 playbook: Fourier decoding of "advice" strategies, a sparse comparison of questions with $\beta = k^{-2/3}$, and the Dinur–Steurer parallel repetition bound for projection games. Two incompatible bounds result: decoded strategies agree with probability at least a fixed $\gamma > 0$, while on unsatisfiable inputs every strategy agrees with probability at most $e^{-ck^{1/3}}$. That's a contradiction for large $k$.

Section 8 then applies the theorem to the known conditional reductions (Max-Cut, Vertex Cover, Raghavendra's CSP theorem, ordering problems, Min-UnCut, and clustering). It credits the reductions themselves to their original authors. Four companion papers in the same family claim *direct* proofs of the Max-Cut, Vertex Cover, Min-UnCut and directed feedback vertex set hardness results. Those proofs start from established PCP results rather than from the new theorem.

## What has been checked

- **Lean.** The [scope note for family 102](https://github.com/openai/math/blob/main/lean/docs/102.md) says the formalization covers the Unique Games reduction and all four direct hardness results. I read the [statement file](https://github.com/openai/math/blob/main/lean/ComparatorChallenges/UniqueGamesTheorem.lean). It defines Unique Games instances as explicit lists of permutation tables and 3SAT as a bit-encoded language. The theorem asks for a reduction, carried out by a Turing machine with a polynomial running-time bound, meeting the $1-\varepsilon$ / $\delta$ gap. The comparator configuration allows only Lean's three standard axioms. I followed the proof module far enough to see that it uses a proved theorem named `kms_expansion` for the Grassmann expansion input, rather than assuming it. I didn't run the checker, so I can't confirm that it builds.
- **People.** A Lean statement checks that *some* theorem is proved, but only experts can say whether that statement is the one they mean. I found mentions of reactions from complexity theorists in search results but couldn't open any of them, so I'm not reporting them.

## Why it's worth knowing

UGC sits where combinatorics, Fourier analysis on the hypercube, and geometry (Gaussian noise stability) meet. A short, honest route in for an analysis student is the Majority Is Stablest theorem. It says that among balanced Boolean functions with no influential variable, majority is the most robust to random bit flips. It is the analytic heart of the Max-Cut result, and O'Donnell's free book *Analysis of Boolean Functions* covers it. Whether or not this proof survives refereeing, that theorem and the 2-to-2 story are now standard material.

## Sources

- OpenAI, *The Unique Games Theorem* ([PDF](https://github.com/openai/math/blob/main/preprints/The-Unique-Games-Theorem-September-23-2026/paper.pdf)), September 23, 2026. Abstract, Section 1 and the start of Section 8 read.
- OpenAI math repository, [catalogue entry 102](https://github.com/openai/math/blob/main/CONTENTS.md) (companion paper abstracts), the [Lean scope note](https://github.com/openai/math/blob/main/lean/docs/102.md), and the [Lean statement file](https://github.com/openai/math/blob/main/lean/ComparatorChallenges/UniqueGamesTheorem.lean).
