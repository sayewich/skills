---
name: ask-the-board
description: This skill should be used when the user wants input from a panel of voices — an advisory board, a judging panel, an editorial board, a marketing panel, or any other "run this past a group" decision — on a decision, plan, or piece of work (e.g. "ask the board", "what would the panel say", "run this by the judges", "score this against the rubric"). It resolves a named board's roster of voices, and either deliberates an open question (independent takes, optional rebuttal round, optional vote, then a synthesis) or judges a submitted artifact (each voice scores it against its own rubric).
---

# Ask The Board

## Overview

A **board** is a named roster of **voices** — generic personas, real researched profiles, or
abstract entities — kept as plain files, not hardcoded. Every voice already carries a **rubric**:
its core model, vocabulary, recurring stances, and likely-take heuristic, together. A board has a
**mode** that decides what happens with that rubric:

- **`deliberate`** (default) — an open question is put to every voice, each reasoning from its
  own rubric as reasoning prose, producing an independent take, with two further rounds available
  on request.
- **`judge`** — a submitted artifact is scored by every voice against that same rubric, made
  explicit and scored (named dimensions, a rating), producing a verdict instead of a take.

This works for an advisory board, a judging panel, an editorial board, a marketing panel, a
one-off "run this past them" review, or a solo "board of one" (one voice, one rubric, one
artifact or question) — the mechanism is identical either way.

Full definitions of every term below (Voice, Board, Hat, Mode, Rubric, Persona, Profile, Entity,
Take, Rebuttal round, Vote, Verdict, Threshold, Roster, Tier, Synthesis, Basis, Releasable,
Source trail, Personal lens) live in [references/schema.md](./references/schema.md). Read it
before the first board resolution in a session, or whenever a detail of the file formats or
round mechanics is unclear.

**Portability note:** every instruction below is plain prose — no tool-specific syntax is load-
bearing. The whole procedure can be copy-pasted as system-prompt material into another
assistant's UI (a custom GPT, a Gemini Gem, a raw chat); only the file-discovery step needs local
adaptation to whatever file access that environment offers.

## Step 1: Resolve the board

Boards and voices are discovered in two tiers, checked in order:

1. **Project-local** — `./boards/<name>/` and `./voices/<name>.md` in the current project.
   Personal, checked first; overrides a bundled board/voice of the same name.
2. **Skill-bundled** — `boards/` and `voices/` inside this skill's own directory (this is where
   the OOTB "C-Suite" and "Security Leadership" boards and their personas live).

List boards from both tiers:

```bash
ls ./boards/ 2>/dev/null                    # project-local tier
ls <this-skill-directory>/boards/           # skill-bundled tier — this skill's own boards/ folder
```

The invocation context names this skill's own directory (e.g. "Base directory for this
skill: ..."); use that path for the bundled-tier listing.

- If the user named a board, resolve it against the project tier first, falling back to the
  bundled tier. Match against the directory name, the `BOARD.md` frontmatter `name`, or any
  listed `aliases` (case-insensitively) — e.g. "cse" can resolve to a board named "Customer
  Security Evangelism" if that board lists it as an alias.
- If no board was named and exactly one board exists across both tiers, use it without asking.
- If no board was named and more than one exists, list them (noting which tier each came from)
  and ask which one to use.
- If a named board doesn't exist in either tier, say so — do not improvise a board or its
  voices from general knowledge.

Read the resolved board's `BOARD.md` to get its **Mode** (`deliberate` if the field is absent),
its **Threshold** (judge mode only), and its **Roster** — the list of voice names, each
optionally tagged with a specific Hat to answer from.

## Step 2: Resolve each voice on the roster

For each entry on the Roster, resolve the named voice file using the same two-tier order (project
`./voices/<name>.md` first, then the skill's bundled `voices/<name>.md`). If the voice declares
`extends`, also resolve and read the extended persona; inherit its base fields and apply the
local voice's overrides on top. If a roster entry doesn't resolve to any voice file in either
tier, say so rather than inventing that voice's views.

Determine which Hat to answer from: the Roster entry's explicit override if given, otherwise the
voice's primary Hat. Never volunteer a secondary Hat's take unless the Roster entry or the user's
question explicitly calls for it.

**Board of one:** a single-voice Roster is valid and common. Skip straight to that voice's
response (Step 4 or the Judge procedure); there is no one else to hold a rebuttal round or a vote
with, and no agreement/disagreement to flag.

### Check for a Brief

Check `./brief/` in the current project for freeform markdown files describing the user's real
situation. If present, read all of them and ground every voice's response in those facts — this
is briefing, not peer contamination, so it applies in every round including Round 1 without
weakening independence. If `./brief/` doesn't exist, proceed silently; don't flag its absence.

## Deliberate mode

### Step 3: Get the question

Use the decision or question as given in the invocation. If the skill was invoked with no
question (just "ask the board"), ask what decision or situation to put to the board before
proceeding.

### Step 4: Round 1 — independent Takes

For each resolved voice, write a **Take** that:

- Speaks in first person as that voice.
- Reasons using *that voice's specific* vocabulary and core model — pull from its "Recurring
  stances" and "Likely-take heuristic" sections, but apply them to the actual question, not just
  restate the file's general philosophy.
- Reaches an actual position on the question, not a survey of considerations.
- Stays inside that voice's documented "Tensions and limits" — if its lens doesn't cover
  something relevant to this question, name that limit rather than overreaching past it.
- Is written blind to what any other voice on this Roster is about to say — no voice's Take may
  reference or anticipate another's.

Keep each Take short enough to scan — a few sentences to a short paragraph. This is a board
session, not a set of essays.

### Step 5: Flag agreement and disagreement

After all Round 1 Takes, state plainly:

- Where the voices converge — same conclusion, possibly by different reasoning.
- Where they genuinely diverge. Never manufacture disagreement for balance, and never paper over
  real disagreement. If the board actually agrees on everything relevant, say so.

If the Roster has only one voice, skip this step — there is nothing to compare.

### Step 6 (opt-in): Rebuttal round

Only run this when the user asks for it — "have them respond to each other," "let them argue
this out," "go deeper," or similar. Do not run it by default; a quick read of the board should
stay cheap.

Show every voice the complete set of Round 1 Takes, and have each one respond by explicitly:

- **Holding** its position, briefly saying why the others didn't move it, or
- **Rebutting** a specific point another voice made, or
- **Revising** its position, with the specific reason it changed.

Re-state where the board converges and diverges now that this round has run — this may have
changed from Step 5.

### Step 7 (opt-in): Vote

Only run this when disagreement genuinely survives the Rebuttal round *and* the user asks for a
decisive read — "put it to a vote," "what does the board actually decide." Never run this as the
default path to resolving disagreement; most disagreement should just be reported honestly in the
Synthesis, not forced to a tally.

Put the live, concrete options to every voice. Each backs exactly one. Report the tally as a
count and a margin, plus which voice(s) dissented and why — a lightweight tally, not a formal
motion-and-second procedure.

### Step 8: Synthesize

Close with a decisive **Synthesis**, in the assistant's own voice, not attributed to any voice on
the board. It should:

- Resolve the disagreement flagged above, not just restate both sides. If a Vote ran, treat its
  result as one input, not the final word — the Synthesis can still disagree with the board's
  tally, and should say so plainly if it does.
- Be concrete and near-term — what to actually do, not a restated philosophy.
- Account for constraints already known about the user's actual situation (from other project
  context — steering docs, ADRs, `CONTEXT.md`) when directly relevant, so the board's advice
  lands in the user's real situation, not a generic one.

## Judge mode

Used when the resolved board's `mode` is `judge`. The input is a submitted **artifact** (a
document, a design, a plan), not an open question.

### Step 3j: Get the artifact

Use the artifact as given in the invocation. If none was given, ask what to evaluate before
proceeding.

### Step 4j: Score independently

For each resolved voice, produce a **Verdict**:

- A rating per dimension in that voice's Rubric (its "Rubric dimensions" subsection if it has
  one; otherwise apply its Likely-take heuristic as an implicit rubric and make the resulting
  judgment explicit).
- Specific, actionable gaps — what's missing or weak, concretely, not a vague quality comment.
- No rewrite of the artifact itself. The voice evaluates; closing the gaps is the user's work.

Judges never see each other's Verdicts and never cross-talk — this mirrors how real judging
panels (and the Virtual Judge this mode is modeled on) actually score: independently, every time.

If more than one voice is on the Roster, report every Verdict individually, plus a simple
aggregate (e.g. average rating per dimension).

### Step 5j: Report against the Threshold

State plainly whether the artifact clears the board's stated Threshold. If not, summarize the
concrete gaps standing between the artifact and that Threshold — this is the list the user acts
on before resubmitting.

There is no further round and no auto-loop here. When the user has revised the artifact, they
resubmit it as a fresh invocation of this same board, scored again from Step 4j.
