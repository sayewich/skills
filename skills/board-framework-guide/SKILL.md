---
name: board-framework-guide
description: This skill should be used when a user is new to, or confused about, the ask-the-board/build-board/extract-source system and wants to know how to start, how to customize it (add a voice, extend a persona), or how to extend it (assemble a new board, deepen a profile from a book/transcript). Triggers on requests like "how does this board thing work", "how do I use ask-the-board", "I don't get how voices and boards fit together", "how do I add a new advisor", "getting started with the board framework", "walk me through this". Does not trigger on a direct request to actually run a board or build a specific voice/board — hand those to ask-the-board / build-board / extract-source directly.
---

# Board Framework Guide

## Purpose

`ask-the-board`, `build-board`, and `extract-source` are three separate skills that share one
file format and one mental model. Each one's own SKILL.md explains itself well to someone who
already knows the vocabulary — none of them is written for someone meeting Voices, Boards, and
Hats for the first time, or someone who technically knows the terms but doesn't know which of the
three skills (or which Mode inside `build-board`) actually does the thing they want. That gap is
this skill's whole job.

This skill teaches; it does not do the work itself. Once the user knows which skill/Mode they
need, hand off to it directly rather than performing its steps from inside this skill.

## Step 1: Ground yourself in the current, real state — don't recite from memory

Before saying anything to the user, read (in this order):

1. `ask-the-board`'s `SKILL.md` and `build-board`'s `SKILL.md` and `references/schema.md`, and
   `extract-source`'s `SKILL.md` — wherever they're actually installed. Check, in order:
   project-local `.claude/skills/`; any installed plugin/marketplace location; and sibling
   project directories (e.g. a `../skills/skills/<name>` giveaway-repo layout) — this project's
   own copies were deliberately moved out of `.claude/skills/` during a public/private split, so
   don't assume "not in `.claude/skills/`" means "not installed." These are the source of truth
   for terminology and Mode numbers; do not assume they match what's summarized below, since
   skills evolve.
2. The "Board Framework" section of this project's `CONTEXT.md`, if it exists — the canonical
   glossary. If a term here conflicts with what you read there, `CONTEXT.md` wins.
3. This project's own `./voices/*.md` and `./boards/*/BOARD.md` (project-local tier), plus the
   bundled tier shipped inside `ask-the-board`'s own `voices/`/`boards/` directories. You want
   real, concrete, already-installed examples to point at — a generic explanation is much less
   useful than "you already have a Jesse Cole voice and a Customer Security Evangelism Advisors
   board, here's what running it would look like."

Skim, don't deep-read everything — you're building enough of a live map to teach from, not
memorizing every voice file.

## Step 2: Ask what they actually want, in plain terms

Don't dump the full tour unprompted. Ask one short question first: are they trying to (a) **use**
something that already exists, (b) **customize** — add a new voice or vary an existing one, or
(c) **extend** — build a new board, or deepen a voice from a big source like a book. If they
genuinely don't know, give the three-option framing above as the answer to "where do I start,"
then let their reply pick a branch.

Keep every explanation in plain language first, with the framework's own vocabulary introduced
only as needed and defined inline the first time it's used — a newcomer doesn't yet know what a
"Hat" or a "Tier" is, and shouldn't have to hold four new terms in their head before getting a
straight answer.

## Step 3: Teach the branch they picked, using this project's real files as examples

### (a) Start — use an existing Board

Explain: a Board is a named group of Voices assembled for one purpose; asking it a question runs
`ask-the-board`. Name one or two Boards that actually exist in this project right now (from Step
1) and what each is for, then explain the two things a user actually decides when invoking it:
which Board, and whether they want more than the default first round (a Rebuttal Round, a Vote —
both opt-in, only worth mentioning if the resolved board has more than one Voice).

If nothing exists yet in this project, say so plainly and pivot to (c) — there's no "start" without
at least one Board to ask.

### (b) Customize — add or vary a Voice

This is `build-board`'s Mode 2. Explain the three Voice kinds in one line each (persona = generic
synthesized role, profile = a real named person/org, entity = an abstract lens/stakeholder), and
the two most common on-ramps:

- **A brand-new generic voice** — author directly from their description, no research needed
  (persona/entity).
- **A personal variant of something that already exists** — "my real CFO based on the generic
  CFO," or a specific practitioner reused for a different Hat — via `extends` on a Hat, writing
  only what differs. The persona being extended more often lives in the **bundled** tier (e.g.
  `ask-the-board`'s own `voices/cfo.md`) than the project-local one — check both tiers, not just
  this project's own `./voices/`, before naming what to extend. Point at a real *project-local*
  `extends:` example only if one actually exists — check for an `extends:` field in project voice
  files before claiming one does; as of this writing this project has none, so don't assert
  otherwise from memory. Voices with `Rubric dimensions` (for judge-mode use) are more likely to
  exist — name the actual file if one fits.

Mention Rubric dimensions only if they mention judging/scoring an artifact — most voices don't
need one.

### (c) Extend — a new Board, or a deeper Voice from a big source

Two different things live under "extend," and they're easy to conflate:

- **A new Board** (`build-board` Mode 1) — pick existing Voices, name the Board, choose a Mode
  (`deliberate` default, or `judge` with a stated Threshold), write the roster. If they want
  `judge` mode, flag up front that every Voice on the roster needs its own `Rubric dimensions`
  subsection already written — most Voices don't have one yet (check which of their chosen
  Voices actually do before promising judge mode will just work).
- **Deepening an existing profile from a book/transcript too big to read in one pass**
  (`extract-source`) — this only applies to `profile`-kind voices that already exist; it doesn't
  create a voice from nothing. If they want a brand-new voice from a big source, that's still (b)
  first (create the lightweight base profile), then this.

## Step 4: Hand off, don't perform

Once the user knows what they want, tell them plainly which skill (and Mode, if `build-board`) to
invoke next, and stop — actually creating the voice/board is that skill's job, not this one's.
The one exception: if the user asks this skill to just go ahead and do it, that's an implicit
invocation of the target skill — proceed under its own instructions, not this skill's.

## A note on staying current

Never hard-code a list of this project's specific voices/boards, Mode numbers, or terminology
into this file as a substitute for Step 1 — that list will drift the moment someone adds a voice
or a Mode gets renumbered. This file's only job is the *procedure* for orienting a confused user
live, every time, against whatever the three skills and this project's files actually say today.
