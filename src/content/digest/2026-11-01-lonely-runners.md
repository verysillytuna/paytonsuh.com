---
title: "The lonely runner conjecture, now up to ten runners"
date: 2026-11-01
summary: "Still no outside verdict on last week's AI claims, so here is an open problem that has moved recently. Runners with different constant speeds circle a track: does each one eventually get far from all the others? This was proved for seven runners in 2008. Computer-assisted proofs since September 2025 reach ten, and the ten-runner paper is now refereed."
tags: [number theory, combinatorics, open problems]
---

**TL;DR.** There's still no independent verdict on OpenAI's October 26 claims; experts named by OpenAI are reviewing the Exponential Time Hypothesis disproof. So today's entry is an open problem that has actually moved lately. The **lonely runner conjecture** (Jörg Wills, 1967; independently Thomas Cusick, as a problem about lines of sight) says that runners on a circular track, all starting together at distinct constant speeds, each get "lonely" at some moment: far from everyone else. For decades it was known only up to seven runners (Barajas and Serra, 2008). Between September and December 2025, Matthieu Rosenfeld and Tanupat Trakulthongchai posted computer-assisted proofs for eight, nine and ten runners. Trakulthongchai's paper on nine and ten has since appeared in a refereed journal. Below are the statement, two short proofs you can check by hand, and how the new results work.

## The statement

Put $n$ runners on a circular track of length $1$. They start at the same point and run forever at distinct constant speeds. A runner is **lonely** at time $t$ if every other runner is at distance at least $1/n$ along the track.

> **Lonely runner conjecture.** Each runner is lonely at some time.

Subtract one runner's speed from everyone's, and that runner stands still at $0$. Write $\|x\|$ for the distance from $x$ to the nearest integer. With $k = n-1$ remaining speeds, the conjecture becomes:

> For any distinct positive speeds $v_1, \dots, v_k$, there is a time $t$ with $\|v_i t\| \ge \dfrac{1}{k+1}$ for every $i$.

Here $k$ counts speeds and $n = k+1$ counts runners. Papers use both conventions, so "the case $k = 6$" and "seven runners" are the same result. It's known that one may assume the speeds are positive integers. Tao's 2017 paper (below) shows that integers of bounded size are enough.

## Two facts you can prove in five minutes

**The bound $1/(k+1)$ can't be improved.** Take speeds $1, 2, \dots, k$. For any $t$, the $k+1$ points $0, t, 2t, \dots, kt$ on the circle can't all be more than $1/(k+1)$ apart, so two of them, $it$ and $jt$, are within $1/(k+1)$. Then $\|(i-j)t\| \le 1/(k+1)$, and $|i-j|$ is one of the speeds. Equality holds at $t = 1/(k+1)$. So the conjecture, if true, is sharp.

**Half the bound is easy.** Assume integer speeds and set $\delta = 1/(2k)$. For one speed $v$, the set of $t \in [0,1)$ with $\|vt\| < \delta$ is $v$ intervals of length $2\delta/v$, so its measure is exactly $2\delta = 1/k$. The $k$ "bad" sets therefore have total measure at most $1$. They all contain a small interval $[0, \varepsilon)$, so they overlap, and their union has measure strictly less than $1$. Any $t$ outside the union has $\|v_i t\| \ge 1/(2k)$ for every $i$.

The whole difficulty is closing the gap between $1/(2k)$ and $1/(k+1)$. Small improvements to the constant are known, but nothing near the conjectured value for large $k$.

## What was known before 2025

- **Up to four runners** ($k \le 3$): Betke and Wills.
- **Five runners**: Cusick and Pomerance, with a computer check. Bienia and coauthors later gave a shorter proof.
- **Six runners**: Bohman, Holzman and Kleitman, [*Six lonely runners*](https://www.combinatorics.org/ojs/index.php/eljc/article/view/v8i2r3), Electron. J. Combin. 8(2) (2001). Renault later simplified it.
- **Seven runners**: Barajas and Serra, [*The lonely runner with seven runners*](https://arxiv.org/abs/0710.4495) (Electron. J. Combin., 2008).
- **Reduction to a finite check.** Terence Tao, [*Some remarks on the lonely runner conjecture*](https://arxiv.org/abs/1701.02048), Contrib. Discrete Math. (2018), shows it suffices to check integer speeds of size $n^{O(n^2)}$. Malikiosis, Santos and Schymura, [*Linearly-exponential checking is enough for the Lonely Runner Conjecture and some of its variants*](https://arxiv.org/abs/2411.06903), Forum Math. Sigma (2025), bring the bound down to about $n^{2n}$. Giri and Kravitz independently proved a bound of the same type.

So for each fixed number of runners, the conjecture is "just" a finite computation. But the bound is far too large to search directly.

## Eight, nine and ten runners

**Matthieu Rosenfeld**, [*The lonely runner conjecture holds for eight runners*](https://arxiv.org/abs/2509.14111) (arXiv, September 2025). His abstract says the proof "relies on a computer verification and on recent results that allow bounding the size of a minimal counterexample". The strategy is to show that in any counterexample with $k = 7$, the *product* of the speeds would have to exceed the bound coming from the finite-check results, so there is no counterexample. Coverage of the follow-up work describes the key step as pinning down prime divisors that a counterexample's speeds would be forced to have.

**Tanupat Trakulthongchai**, [*Nine and ten lonely runners*](https://arxiv.org/abs/2511.22427) (arXiv, November 2025). In the paper's words, it refines Rosenfeld's approach "with a sieve" to get computer-assisted proofs for 9 and 10 runners. It was published in [*Electron. J. Combin.* 33(2), P2.46](https://www.combinatorics.org/ojs/index.php/eljc/article/view/v33i2p46) (June 2026). Rosenfeld independently posted [*The lonely runner conjecture holds for nine runners*](https://arxiv.org/abs/2512.01912) (December 2025). Coverage I saw describes Trakulthongchai as an undergraduate at St John's College, Oxford ([college news item](https://www.sjc.ox.ac.uk/discover/news/st-johns-undergraduate-advances-longstanding-mathematical-conjecture/)).

The ten-runner result has been refereed. I haven't confirmed that Rosenfeld's two papers have, so treat them as preprints. Both authors say the method gets much more expensive with every extra runner. Eleven runners, and the general case, are open.

## Why it's worth knowing

It looks like a puzzle, but it sits where several areas meet: Diophantine approximation (how well multiples $v_i t$ avoid the integers), the geometry of numbers (Cusick's view-obstruction version asks whether a ray from the origin must hit a lattice of small cubes), and graph colouring (it is closely tied to colouring distance graphs on the integers). The two proofs above are pure Putnam-style pigeonhole and measure counting. A good exercise before December 5: prove the conjecture for $k = 2$ by hand. Show that for distinct positive integers $a, b$ there's a $t$ with $\|at\|, \|bt\| \ge 1/3$.

## Sources

- Rosenfeld, [arXiv:2509.14111](https://arxiv.org/abs/2509.14111) (eight runners) and [arXiv:2512.01912](https://arxiv.org/abs/2512.01912) (nine runners).
- Trakulthongchai, [arXiv:2511.22427](https://arxiv.org/abs/2511.22427); published version in [Electron. J. Combin. 33(2) (2026), P2.46](https://www.combinatorics.org/ojs/index.php/eljc/article/view/v33i2p46).
- Tao, [arXiv:1701.02048](https://arxiv.org/abs/1701.02048).
- Malikiosis, Santos and Schymura, [arXiv:2411.06903](https://arxiv.org/abs/2411.06903).
- Bohman, Holzman and Kleitman, [*Six lonely runners*](https://www.combinatorics.org/ojs/index.php/eljc/article/view/v8i2r3).
- Barajas and Serra, [arXiv:0710.4495](https://arxiv.org/abs/0710.4495).
- On the AI claims: [Washington Times, Oct 27](https://www.washingtontimes.com/news/2026/oct/27/openai-says-model-refuted-exponential-time-hypothesis/) (reviewers named, no verdict yet).

*This entry is based on search summaries of these papers and pages. The runner couldn't reach arXiv, the journal or Quanta directly. The two proofs were written out and checked here.*
