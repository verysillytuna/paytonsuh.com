---
title: "The fifth Busy Beaver, and the smallest open problems"
date: 2026-11-10
summary: "A quiet news day, so a recent result worth knowing: an online collaboration proved in Coq that the longest-running halting 5-state Turing machine stops after exactly 47,176,870 steps. The proof sorts 181 million machines, and the six-state frontier already contains Collatz-like problems nobody can solve."
tags: [computability, Turing machines, formalization, Collatz-type problems]
---

**TL;DR.** No new result from the last day or two that I could check from a primary source, so today's entry is a recent one. In September 2025 the bbchallenge Collaboration posted [*Determination of the fifth Busy Beaver value*](https://arxiv.org/abs/2509.12337) (revised March 2026), with a complete [Coq proof](https://github.com/ccz181078/Coq-BB5) that $S(5)=47{,}176{,}870$. In words: among all 5-state, 2-symbol Turing machines started on a blank tape, the ones that halt do so within 47,176,870 steps, and one machine takes exactly that many. It's the first new Busy Beaver value in over 40 years and the first one ever formally verified. The paper also shows why six states are a different world.

## The game

Tibor Radó defined it in 1962. Run every $n$-state Turing machine on the two symbols $0,1$, starting from an all-zero tape. Some machines halt and some run forever. $S(n)$ is the largest number of steps taken by a machine that halts. The function $S$ is not computable, and the reason is short: if you knew $S(n)$, you could decide whether any $n$-state machine halts by running it for $S(n)+1$ steps.

That doesn't stop us from computing *particular* values. Before this work, the known ones were $S(1)=1$, $S(2)=6$ (Radó, 1962), $S(3)=21$ (Lin, 1963) and $S(4)=107$ (Brady, 1983). For five states, Heiner Marxen and Jürgen Buntrock found a machine in 1989 that halts after 47,176,870 steps. Nobody beat it in 30 years, but nobody could prove it was the winner. Brady, who proved $S(4)$, predicted in 1990 that $S(5)$ would never be determined.

## How the proof works

The idea is brute force, made clever enough to finish. The [proof's guide](https://github.com/ccz181078/Coq-BB5/blob/main/CoqBB5/BB5/README.md) lays it out.

1. **Enumerate, but only what matters.** There are about $1.7\times10^{13}$ five-state machines. The proof builds them in *Tree Normal Form*: start with a machine whose transitions are all undefined, run it, and fill in a transition only when the machine actually reaches it. That cuts the search to 181,385,789 machines.
2. **Decide each one.** Every machine goes through a pipeline of *deciders*, algorithms that try to prove halting or non-halting. Each decider is written in Coq and proved correct in Coq. The cheapest check, looking for a repeating configuration, settles 175 million machines. Most of the rest are handled by "closed position sets": find a finite set of tape patterns that contains the start, never leads to a halt, and maps into itself. 183 machines are settled simply by running them for 47,176,870 steps.
3. **Prove the last 13 by hand.** Thirteen *sporadic machines* resisted every decider and got individual non-halting proofs. They're strange: one counts in a base built from Fibonacci numbers, one turns out to be an obfuscated Gray code, and one ("Skelet #1") behaves chaotically for more than $5.41\times10^{51}$ steps before settling into a cycle.

The whole proof compiles in about 45 minutes on 13 cores and depends on one standard axiom, functional extensionality. Most contributors were not professional mathematicians: the project ran on a Discord server and a wiki, in the spirit of the Polymath projects.

## Six states: Antihydra

Every $\Pi^0_1$ statement, one of the form "for every $n$, a checkable property holds", can be turned into a Turing machine that halts exactly when the statement is false. The paper notes that Goldbach's conjecture fits in 25 states and the Riemann hypothesis in 744. A machine that searches for a contradiction in ZF set theory has been built with 748 states, so by Gödel's second incompleteness theorem ZF can't prove the value of $S(748)$. That has since come down to 636 states, with a 432-state version awaiting verification.

The surprise is how early this begins. Among the roughly 1,200 six-state machines the collaboration still couldn't classify, according to the current manuscript, there's one they call **Antihydra**. It halts if and only if the following fails.

> **Conjecture.** Let $H(x)=3x/2$ for even $x$ and $H(x)=(3x-1)/2$ for odd $x$. Iterate $H$ starting from $x=8$. Then at no point have there been more than twice as many odd values as even ones.

Heuristically, each value is odd or even with probability about $1/2$, so odd values should run about level with even ones, far below twice as many. The paper's probabilistic estimate of the chance that Antihydra ever halts is about $5\times10^{-224{,}394{,}395}$. But proving it means controlling the parity of a $3x/2$ orbit forever, which is the same kind of question as the Collatz conjecture, and nobody knows how. That makes it, in the paper's words, among the smallest open problems in mathematics on the Busy Beaver scale. A dozen other six-state machines like it are known.

**Try it.** The orbit begins $8, 12, 18, 27, 40, 60, 90, 135, \dots$ A ten-line Python script (exact integer arithmetic) runs 100,000 steps in a few seconds. In my run there were 50,159 even values and 49,841 odd ones, nowhere near the line, and the numbers had grown to about 58,500 bits. That's evidence, not a proof. The current six-state record holder shows how far evidence can mislead: it runs for more than $2\uparrow\uparrow\uparrow5$ steps and then halts.

## Read more

- [The paper](https://arxiv.org/abs/2509.12337), and its [source repository](https://github.com/bbchallenge/bbchallenge-paper) with the live manuscript. The introduction reads well with no background; the appendix on "Cryptids" collects the six-state open problems.
- [Coq-BB5](https://github.com/ccz181078/Coq-BB5): the proof, which also gives $S(2,4)=3{,}932{,}964$ for 2-state, 4-symbol machines. The [BB(5) guide](https://github.com/ccz181078/Coq-BB5/blob/main/CoqBB5/BB5/README.md) has the table of which decider settled how many machines.
