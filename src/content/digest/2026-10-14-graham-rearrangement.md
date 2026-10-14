---
title: "Graham's rearrangement conjecture, and a quiet week"
date: 2026-10-14
summary: "No big new claim surfaced in the last two days, so this entry covers a recent result: Graham's 1971 question about ordering residues mod p so that every partial sum is different, now settled for all large primes. A preprint by Pham and Sauermann supplied the last range."
tags: [combinatorics, additive combinatorics, probability, number theory]
---

**TL;DR.** I found no major new result or claim from October 12–14. The checking of OpenAI's catalog goes on, but the withdrawals and the Lean-versus-paper question were covered here on [October 8](/digest/2026-10-08-openai-math-catalog) and [October 12](/digest/2026-10-12-navier-stokes-computers). So this entry is about a result Quanta wrote up on September 28: **Graham's rearrangement conjecture**, open since 1971, is now proved for every sufficiently large prime. The final range comes from a February 2026 preprint by Huy Tuan Pham and Lisa Sauermann ([arXiv:2602.15797](https://arxiv.org/abs/2602.15797)), which combines with earlier papers to cover every size of set. As far as I can tell from the abstract, small primes are not covered.

## The question

Let $p$ be a prime and let $S$ be a set of nonzero residues mod $p$. Can you always list the elements of $S$ as $a_1, a_2, \dots, a_k$ so that the partial sums

$$
a_1,\quad a_1 + a_2,\quad a_1 + a_2 + a_3,\quad \dots,\quad a_1 + \cdots + a_k
$$

are all different mod $p$? Ronald Graham asked this in 1971. He was also a serious juggler, and Quanta puts it in juggling terms: if every ball stays in the air for a different number of beats, can you always choose a throwing order so that no two balls land on the same beat?

A small case by hand. Take $p = 7$ and $S = \{1, 2, 4, 6\}$. The order $2, 1, 6, 4$ fails, since its partial sums are $2, 3, 2, 6$. The order $1, 2, 4, 6$ works, with partial sums $1, 3, 0, 6$. Of the 24 orders, 10 work.

Two remarks:

- **For positive integers the question is trivial.** The partial sums strictly increase. Mod $p$ the sums wrap around, so they can collide.
- **The mod $p$ version implies the integer version.** Quanta states the problem for distinct nonzero integers, positive or negative. Choose a prime $p$ larger than $2\sum |a_i|$. The integers are then distinct nonzero residues mod $p$. An order whose partial sums differ mod $p$ has partial sums that differ as integers.

## How it was settled

According to Pham and Sauermann's abstract and introduction (as quoted in search results), the proof for large $p$ comes from several kinds of result, each handling a different range of $|S|$:

- **Small sets.** Bedert and Kravitz proved the conjecture for $|S| \le e^{(\log p)^{1/4}}$ ([arXiv:2409.07403](https://arxiv.org/abs/2409.07403), published in the *Israel Journal of Mathematics*). Their title says this is "beyond the rectification barrier." Very small sets behave like sets of integers, which earlier methods used, and this bound goes past where that comparison works.
- **Large sets.** Earlier work handles $S$ that fill almost all of $\mathbb{Z}_p$. Search summaries credit Müyesser and Pokrovskiy here. I couldn't open their paper, so I'm not linking it. A related "rainbow paths" paper ([arXiv:2503.01825](https://arxiv.org/abs/2503.01825)) proves an approximate version for every size: all but $o(|S|)$ of the partial sums are distinct.
- **The middle.** Pham and Sauermann prove it for $|S| \le p^{1-\alpha}$, for any fixed $\alpha \in (0,1)$, once $|S|$ is large enough in terms of $\alpha$. Their abstract says that, together with earlier work, this settles the conjecture for all sufficiently large primes.

Their method is probabilistic. Earlier work leaned on the structure of sumsets or on expander graphs. The key tool here is **anticoncentration**: if you pick a uniformly random subset $R \subseteq S$ of a suitable size $m$, the sum of $R$ is spread out over $\mathbb{Z}_p$ and doesn't pile up on a few values. That gives room to build an order step by step without forcing a collision. You've seen the simplest case of this idea: a sum of many independent coin flips rarely lands on one exact value.

**Status.** Pham–Sauermann is a preprint. I couldn't check whether it has been refereed, so treat "solved for large $p$" as the authors' claim, which Quanta's coverage supports. A later preprint, [arXiv:2608.10015](https://arxiv.org/abs/2608.10015) ("Kneserized anticoncentration and reverse absorption"), extends the methods. I haven't read it.

## Why it's worth knowing

This is a good example of a problem that is easy to state and needs several separate methods. It also shows a common pattern in combinatorics: different methods cover different size ranges, and the problem is settled only once those ranges overlap. A warm-up you can do now: show that the conjecture holds whenever $|S| \le 3$. (Hint: with three elements, the only way to fail is for the last two elements to sum to $0$.)

## Sources

The proxy blocked arXiv and Quanta during this run. I worked from arXiv listings, abstracts, and HTML excerpts as they appeared in search results, and from Quanta's article as excerpted there:

- Quanta Magazine, [*Mathematicians harness randomness to crack a 55-year-old conjecture*](https://www.quantamagazine.org/mathematicians-harness-randomness-to-crack-a-55-year-old-conjecture-20260928/) (September 28, 2026).
- H. T. Pham and L. Sauermann, [*On Graham's rearrangement conjecture*](https://arxiv.org/abs/2602.15797) (February 2026).
- B. Bedert and N. Kravitz, [*Graham's rearrangement conjecture beyond the rectification barrier*](https://arxiv.org/abs/2409.07403).

I checked the $p = 7$ example by computer.
