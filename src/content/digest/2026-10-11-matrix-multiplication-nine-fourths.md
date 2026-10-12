---
title: 'Is the matrix multiplication exponent at most 9/4?'
date: 2026-10-11
summary: 'Another claim from OpenAI’s catalog: the exponent of matrix multiplication is at most 9/4, far below the record of about 2.371. What ω is, why the number had barely moved in decades, and what the Lean statement says.'
tags: [complexity, algebra, AI and mathematics]
---

**TL;DR.** Family 107 in OpenAI's catalog claims $\omega \le 9/4$: two $n \times n$ complex matrices can be multiplied with $O(n^{9/4+\varepsilon})$ arithmetic operations, for every $\varepsilon > 0$. The record before this week was about $2.371$. This is still a claim. It hasn't been refereed, though its Lean proof has been rebuilt by someone outside OpenAI. The repository's [history page](https://github.com/openai/math/blob/main/history.md) still lists only the October 7 corrections (checked October 11, UTC), and none of them touch this family.

## What ω is

The schoolbook method multiplies two $n \times n$ matrices with about $n^3$ multiplications. The exponent $\omega$ is the smallest $\tau$ such that, for every $\varepsilon > 0$, some algorithm does it in $O(n^{\tau + \varepsilon})$ operations. Every entry of the output has to be written down, so $\omega \ge 2$. The open question is whether $\omega = 2$.

The upper bound has moved slowly:

- **1969.** Strassen multiplied $2 \times 2$ matrices with 7 multiplications instead of 8. Applied recursively to blocks, that gives $\omega \le \log_2 7 \approx 2.807$.
- **1990.** Coppersmith and Winograd reached about $2.376$.
- **2010s to now.** A long series of refinements of the same idea, the "laser method," brought it to about $2.371$. One of the latest is $\omega < 2.371339$ ([Alman, Duan, Vassilevska Williams, Xu, Xu, Zhou](https://arxiv.org/abs/2404.16349), SODA 2025).

So in 35 years the bound dropped by about $0.005$. A claim of $2.25$ is a jump of a different kind.

## What is claimed

Family 107's [manuscript map entry](https://github.com/openai/math/blob/main/CONTENTS.md) lists three results:

- $\omega \le 9/4$ over $\mathbb{C}$.
- The **dual exponent** $\alpha > 0.465$. $\alpha$ is the largest $k$ such that an $n \times n^k$ matrix times an $n^k \times n$ matrix takes only $n^{2+o(1)}$ operations. The best previous bound was $\alpha > 0.321334$ ([Vassilevska Williams, Xu, Xu, Zhou](https://arxiv.org/abs/2307.07970), SODA 2024).
- Over *every* field, including finite fields, $\omega < 2.371054886006746$. That is a small improvement on the old record, and it holds in every characteristic.

The headline paper, [An Upper Bound of 9/4 for the Matrix Multiplication Exponent](https://github.com/openai/math/blob/main/preprints/Matrix-Multiplication-Nine-Fourths-October-2-2026/paper.pdf), is dated October 2. Two longer September write-ups prove the weaker bound $\omega < 2.258$ and the all-fields bound.

## What the Lean files say

The [comparator statement](https://github.com/openai/math/blob/main/lean/ComparatorChallenges/MatrixMultiplication.lean) defines $\omega$ from scratch. An algorithm is a straight-line program whose steps are constants, inputs, $+$, $-$, and $\times$, each costing 1. It must be correct for every pair of input matrices. An exponent $\tau$ is admissible if, for every $\varepsilon > 0$, one constant $C$ works at every size $n$:

```lean
def AdmissibleExponent (F : Type*) [Field F] (τ : ℝ) : Prop :=
  ∀ ε : ℝ, 0 < ε → ∃ C : ℝ, 0 < C ∧
    ∀ n : ℕ, 1 ≤ n → ∃ P : MatrixAlgorithm F n n n,
      P.Correct ∧ (P.cost : ℝ) ≤ C * (n : ℝ) ^ (τ + ε)

def omega (F : Type*) [Field F] : ℝ := sInf {τ : ℝ | AdmissibleExponent F τ}

theorem complex_omega_le_nine_quarters :
    Arithmetic.omega ℂ ≤ (9 : ℝ) / 4
```

That is the standard definition. Division isn't allowed, which only makes the statement stronger. The family's [formalization notes](https://github.com/openai/math/blob/main/lean/docs/107.md) say all three bounds over $\mathbb{C}$ and the all-fields bound are formalized, with no numerical inequalities left as hypotheses.

An [independent rebuild](https://github.com/erenciracioglu-dotcom/openai-math-9-4-lean-check) on a Windows PC reports that the proof compiles without `sorry` and uses only Lean's three standard axioms. It also reports that the three theorem statements match the challenge file exactly. Its README is careful about the limits. It didn't run OpenAI's sandboxed checker or a second kernel, and it isn't an expert review of the mathematics.

## What it would and wouldn't mean

The bound counts arithmetic operations, not running time on real hardware. Every known algorithm near the record is "galactic": its hidden constants are so large that it only pays off for matrices far bigger than anything a computer stores. Nothing here says this one is different. Even if the proof holds, GPUs will keep using the schoolbook method and Strassen-style tricks.

The mathematical question is the interesting one. If the proof is right, it has to get around the known barrier results. Those show that the techniques behind the recent records can't reach $\omega = 2$, and some versions of them can't go much below today's numbers. A jump to $2.25$ suggests a different idea, and that idea would be worth learning. The 13-page paper is short enough to try.

## Reading

- The claim: [paper](https://github.com/openai/math/blob/main/preprints/Matrix-Multiplication-Nine-Fourths-October-2-2026/paper.pdf), [formalization notes](https://github.com/openai/math/blob/main/lean/docs/107.md), and the [Lean statement](https://github.com/openai/math/blob/main/lean/ComparatorChallenges/MatrixMultiplication.lean).
- The independent check: [openai-math-9-4-lean-check](https://github.com/erenciracioglu-dotcom/openai-math-9-4-lean-check).
- The previous records: [More Asymmetry Yields Faster Matrix Multiplication](https://arxiv.org/abs/2404.16349) and [New Bounds for Matrix Multiplication: from Alpha to Omega](https://arxiv.org/abs/2307.07970).
