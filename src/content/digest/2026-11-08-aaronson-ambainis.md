---
title: "The Aaronson–Ambainis conjecture: a claimed proof, checked in Lean"
date: 2026-11-08
summary: "A preprint from PSI claims a proof that every bounded low-degree polynomial on the Boolean cube has an influential variable, a 2008 conjecture that would mean quantum query speedups beyond polynomial need structure. The Lean formalization is complete and kernel-checked; the paper has not yet been refereed, and the proof, paper and code were produced by AI models."
tags: [Boolean functions, quantum computing, formalization, AI and mathematics]
---

**TL;DR.** On November 6, the company Physical Superintelligence (PSI) posted [*A proof of the Aaronson–Ambainis conjecture*](https://github.com/physical-superintelligence/aaronson-ambainis), a paper by David Turturean with a complete Lean 4 formalization. The claim: every function $f\colon\{-1,1\}^n\to[-1,1]$ of degree at most $d$ has a coordinate whose influence is at least $c\,\mathrm{Var}(f)^{5/2}/d^6$ for an absolute constant $c$. Before this, the known bounds for general bounded polynomials were exponential in $d$. The repository says the statements, the first draft of the paper and the formalization were produced by AI models, and that Turturean reviewed the paper and is responsible for its correctness. The Lean proof is kernel-checked. The paper itself is a preprint that hasn't been refereed, so treat the result as a strong claim for now.

## The statement

Put the uniform measure on the cube $\{-1,1\}^n$. For a function $f$ and a coordinate $j$, write $x^{j}$ for $x$ with its $j$-th coordinate flipped. The **influence** of $j$ measures how much flipping that coordinate moves $f$:
$$
\mathrm{Inf}_j(f) = \mathbb{E}_x\!\left[\left(\frac{f(x)-f(x^{j})}{2}\right)^{2}\right].
$$
Every function on the cube is a unique multilinear polynomial, and its **degree** is the degree of that polynomial. The conjecture, from a 2008 lecture of Scott Aaronson and printed in Aaronson and Ambainis, *The need for structure in quantum speedups* (Theory of Computing, 2014), says:

> If $|f|\le 1$ on the cube, $\deg f\le d$ and $\mathrm{Var}(f)\ge\varepsilon$, then some coordinate has $\mathrm{Inf}_j(f)\ge(\varepsilon/d)^{O(1)}$.

The paper proves it with the explicit bound
$$
\max_j \mathrm{Inf}_j(f)\;\ge\;\frac{\sqrt{15}}{500\,\pi^{4}}\cdot\frac{\mathrm{Var}(f)^{5/2}}{d^{6}}.
$$
In Aaronson and Ambainis's own normalization (polynomials with values in $[0,1]$ on $\{0,1\}^N$), this gives the clean form $\mathrm{Inf}_i[p]\ge(\varepsilon/d)^7$.

**Why the hypotheses matter.** For *Boolean* functions (values $0$ and $1$ only) the conjecture was already known. O'Donnell, Saks, Schramm and Servedio showed that a Boolean function has a variable of influence at least about $\mathrm{Var}(f)/D(f)$, where $D(f)$ is the depth of the best decision tree for $f$. Nisan and Szegedy showed that $D(f)$ is bounded by a polynomial in the degree. The hard case is a *bounded* real-valued polynomial, which can spread its variance thinly over many coordinates while staying between $-1$ and $1$. Ruling that out, with a loss polynomial in $d$, is the whole conjecture. It's also the case quantum algorithms produce.

## Why quantum computing cares

The acceptance probability of a quantum algorithm that makes $T$ queries to an input $X\in\{0,1\}^N$ is a polynomial in the bits of $X$ of degree at most $2T$, with values in $[0,1]$. That is a lemma of Beals, Buhrman, Cleve, Mosca and de Wolf. If such a polynomial always has an influential variable, a classical algorithm can query that variable, fix it, and repeat. Aaronson and Ambainis showed this simulates the quantum algorithm on *most* inputs with polynomially many classical queries.

So the result, if it holds, says: an exponential quantum speedup in the query model needs **structure**, a promise that only a tiny fraction of inputs satisfy. Simon's problem and Shor's period finding have exactly that kind of promise (the input encodes a periodic function), and they are untouched. What's ruled out is a superpolynomial speedup that works on a typical, unstructured input. The paper's explicit consequence: a $T$-query quantum algorithm can be approximated to within $\varepsilon$ on all but a $\delta$ fraction of inputs by a classical algorithm making at most $(4T)^{8}\varepsilon^{-14}\delta^{-8}$ queries. This is a statement about counting queries, not running time, so it says nothing directly about factoring or cryptography.

## The proof, in outline

The repository describes the proof as elementary, in four parts:

1. **An inequality for Boolean functions over all pairs of points.** It's derived from a determinant of a matrix of monomials, through a bijection theorem that the authors relate to Reimer's Butterfly Lemma (the key step in his proof of the van den Berg–Kesten conjecture).
2. **Integration over level sets.** A bounded $f$ is cut into the Boolean functions $\mathbf 1[f>t]$. The pairs inequality is applied to each, then integrated over $t$. This finishes a plan of Lovett and Zhang (ITCS 2023), whose own version left one inequality as a conjecture.
3. **Averaging over coordinates** turns a bound on the mean absolute increments $\mathbb{E}|f(x)-f(x^j)|$ into a bound on the influences.
4. **A degree bound on "certificates"**, from Markov's inequality for polynomials, Chebyshev polynomials and LP duality. This step is known with a better constant from Agarwal and Ben-David.

The odd-looking constant $\sqrt{15}/(500\pi^4)$ is just what these steps multiply out to. The $\pi^4$ comes from the Markov–Chebyshev step.

## What exactly was checked

The repository is unusually careful about this, and it's worth reading as a model of how to present a machine-checked claim.

- **The proof.** All four final theorems are proved with no `sorry` and no added axiom. `#print axioms` shows only Lean's standard three. Every declaration was replayed through the Lean kernel, and again through [lean4lean](https://github.com/digama0/lean4lean), an independent implementation of the kernel. The [Comparator](https://github.com/leanprover/comparator) tool also checked the theorems against a challenge file that imports nothing but the statement file.
- **The statement.** This is the part a person has to check. The Lean target `PrintedConjecture` is about twenty lines that use only Mathlib's polynomials and finite sums, and `problem_statement.md` sets it beside the printed conjecture. Read that file next to the definition of influence above: the hypotheses (degree, boundedness on the cube, variance) and the conclusion line up.
- **Not checked.** The paper's prose, its sections on consequences and earlier work, and the Lean foundations themselves.

So the right reading is "a formally verified proof of a carefully stated theorem, plus an unrefereed paper explaining it." What's still missing is the community's verdict on the paper, and on whether the theorem is the one people meant. I haven't found public comments from Aaronson or Ambainis yet.

**If you want to look yourself.** The influence and degree definitions above are Chapter 2 of Ryan O'Donnell's [*Analysis of Boolean Functions*](https://www.cs.cmu.edu/~odonnell/boolean-analysis/), free online. The conjecture appears there too, in the notes to Chapter 8. With that chapter in hand, `problem_statement.md` in the repository is a twenty-minute read.

## Read more

- D. Turturean (PSI), [*A proof of the Aaronson–Ambainis conjecture*](https://github.com/physical-superintelligence/aaronson-ambainis), paper and Lean 4 formalization, November 2026. Start with the README and `problem_statement.md`.
- S. Aaronson and A. Ambainis, [*The need for structure in quantum speedups*](https://arxiv.org/abs/0911.0996), Theory of Computing 10 (2014). This is where the conjecture comes from.
- R. O'Donnell, [*Analysis of Boolean Functions*](https://www.cs.cmu.edu/~odonnell/boolean-analysis/), the standard free textbook.
