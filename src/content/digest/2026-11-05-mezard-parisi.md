---
title: "The Mézard–Parisi formula: a claimed proof for sparse spin glasses"
date: 2026-11-05
summary: "Dmitry Panchenko has posted a claimed proof of the Mézard–Parisi formula for the free energy of random K-SAT and diluted spin glasses, supplying the missing lower bound for a formula physicists predicted twenty-five years ago. Also: Imperial College announces a Langlands Lab for AI-assisted mathematics."
tags: [probability, spin glasses, statistical physics, AI and mathematics]
---

**TL;DR.** On October 29, Dmitry Panchenko posted [*The Mézard–Parisi formula*](https://arxiv.org/abs/2610.39545) (math.PR). It claims a proof of the physicists' formula for the free energy of **sparse** spin glasses, including random K-SAT, for a general class of models under symmetry and integrability assumptions. One half of the formula, the upper bound, was already known (Franz and Leone). The new paper supplies the matching lower bound. The acknowledgements say two AI systems helped with the rewriting. It is a preprint and hasn't been refereed, so treat it as a claim for now. Separately, Imperial College London announced a £5 million grant from XTX Markets for a new laboratory for AI-assisted mathematics, led by Kevin Buzzard.

## The story: from dense to sparse spin glasses

A **spin glass** is a probability distribution on configurations $\sigma \in \{-1, +1\}^N$ with random interactions. You weight each configuration by $e^{-\beta H_N(\sigma)}$, where $H_N$ is a random energy function and $\beta$ is the inverse temperature. The central quantity is the **free energy**
$$
F_N = \frac{1}{N}\,\mathbb{E}\log \sum_{\sigma} e^{-\beta H_N(\sigma)},
$$
and the question is what $F_N$ tends to as $N \to \infty$.

- **Dense models.** In the Sherrington–Kirkpatrick model, every pair of spins interacts. Parisi predicted the limit in 1979–80 with a formula that physicists derived by a non-rigorous method (the "replica trick"). Mathematicians took about twenty-five years to prove it: Guerra proved the upper bound and Talagrand the lower bound (around 2003–2006). Panchenko later proved the formula for mixed $p$-spin models through the ultrametricity of overlaps ([arXiv:1112.4409](https://arxiv.org/abs/1112.4409), published in the *Annals of Probability*).
- **Sparse ("diluted") models.** Here each spin interacts with only a bounded number of others on average, as on a sparse random graph. Random K-SAT fits this picture. Take a random formula with about $\alpha N$ clauses, each on $K$ variables, and let the energy count the violated clauses. Mézard and Parisi gave a formula for this case too, built on their *cavity method*. Franz and Leone proved that it is an upper bound. The lower bound has been open since.

## What the new paper claims

From the abstract and the HTML version:

- It proves the free-energy **lower bound** for a general class of diluted models, under symmetry and integrability assumptions. With the Franz–Leone upper bound, that gives the Mézard–Parisi formula for the **diluted even-$p$-spin** and **random K-SAT** models it covers.
- The main new ingredient is an **approximate form of the Mézard–Parisi reproducibility hypothesis**. It is proved without assuming that the overlap distribution has finite support.
- Why the dense proof doesn't carry over directly: in a diluted model, the limiting structure depends on the whole spin distribution (all the "multioverlaps"), not only on pairwise overlaps. So ultrametricity of overlaps covers only part of what's needed.
- A companion preprint on Ghirlanda–Guerra identities and cavity equations for diluted models ([arXiv:2610.39542](https://arxiv.org/abs/2610.39542)) provides details of the cavity lower bound.

**The AI part, stated carefully.** The paper's acknowledgements thank ChatGPT Astra and Claude Fable for help with the rewriting. The paper also notes that, a few days after its proof was found, OpenAI released another proof of the formula. I haven't read that second proof, and accounts of how much of the first proof the AI systems produced come from secondary sites, so I won't repeat them. What matters mathematically is whether the argument checks out, and that is now up to referees.

## Why it's worth knowing

- **It's a template for "physics predicts, mathematics catches up."** Parisi's formula and the cavity method gave exact answers decades before anyone could prove them. Proving them took new probability, including ultrametricity and the Ghirlanda–Guerra identities.
- **It reaches into computer science.** Random K-SAT is the standard model for asking when random constraint problems stop being satisfiable. Its free energy is a positive-temperature relative of the count of satisfying assignments.
- **Background you'll have soon.** The prerequisites are graduate measure-theoretic probability and some comfort with Gaussian processes. Panchenko's book *The Sherrington–Kirkpatrick Model* is the standard entry point, and you can find it through the library.

## Also recent: a Langlands Lab at Imperial

Imperial College London [announced](https://www.imperial.ac.uk/news/articles/admin-services/giving/2026/5-million-grant-to-establish-new-laboratory-for-ai-assisted-mathematics-at-imperial/) a £5 million grant from XTX Markets for a laboratory for AI-assisted mathematics, the **Langlands Lab**, led by Kevin Buzzard. Buzzard is known for leading the effort to formalize Fermat's Last Theorem in the Lean proof assistant. According to the announcement, the lab will study how AI can advance research and how PhD training should change. It will also develop AI-assisted ways to explain and communicate mathematics. The training question is the one he stresses most.

## Read more

- D. Panchenko, *The Mézard–Parisi formula*, [arXiv:2610.39545](https://arxiv.org/abs/2610.39545) (October 29, 2026).
- Companion preprint: *Ghirlanda–Guerra identities and cavity equations for diluted spin glass models*, [arXiv:2610.39542](https://arxiv.org/abs/2610.39542).
- D. Panchenko, *The Parisi formula for mixed p-spin models*, [arXiv:1112.4409](https://arxiv.org/abs/1112.4409), for the dense case.
- Imperial College London, [£5 million grant to establish new laboratory for AI-assisted mathematics at Imperial](https://www.imperial.ac.uk/news/articles/admin-services/giving/2026/5-million-grant-to-establish-new-laboratory-for-ai-assisted-mathematics-at-imperial/).
