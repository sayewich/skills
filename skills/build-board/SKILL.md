---
name: build-board
description: This skill should be used when the user wants to assemble a board/panel from existing voices (advisors, judges, editors, personas, profiles, entities), to create or update a single voice file (a generic persona, a real researched profile, or an abstract entity), to create/update a Brief grounding a board's sessions in the user's real situation, or to export a voice/board as a plain copy-paste prompt for a platform with no file access, for use with ask-the-board. Triggers on requests like "build a board", "make a new panel", "add a voice", "create a persona for X", "research a profile of X", "update Y's profile", "make this a judge", "build a rubric", "create a brief", "export this as a prompt", "give me a copy-paste version".
---

# Build Board

## Overview

Four modes, one shared file format. Full definitions of every term (Voice, Board, Hat, Mode,
Rubric, Brief, Persona, Profile, Entity, Roster, Tier, Take, Rebuttal Round, Vote, Verdict,
Threshold, Basis, Releasable, Source trail, Personal lens) and the exact file formats live in
[references/schema.md](./references/schema.md) — read it before doing anything in any mode.

**Assemble a board** — pick existing voices, name a board, write its roster, choose a mode.
**Create or update a voice** — author a generic persona/entity, or research a real profile.
**Create or update a Brief** — interview the user to capture their real situation, grounding
every future board session that touches this project.
**Export a portable prompt** — flatten a voice or board into plain prose for a platform with no
file access (Gemini, ChatGPT, any single-turn chat).

Ask the user which mode they want if it isn't obvious from their request.

There is no separate "create a judge" or "create a rubric" workflow. A judge is just a voice; its
rubric is the same Core model / Vocabulary / Recurring stances / Likely-take heuristic every
voice already has. The only difference for a voice meant to score artifacts (used on a `judge`
mode board) is making that heuristic explicit and scored — see "Rubric dimensions" under Mode 2
below.

## Discovery order (both modes)

Voices and boards are discovered in two tiers:

1. **Project-local** — `./boards/<name>/` and `./voices/<name>.md` in the current project.
   Personal, private by default.
2. **`ask-the-board`'s bundled tier** — the `boards/` and `voices/` directories inside the
   `ask-the-board` skill's own directory. This is where the generic, shareable defaults (the
   OOTB personas and example boards) live. `build-board` reads this tier but does not own a
   bundled tier of its own.

New boards and voices are written to the **project-local tier** by default. Writing into
`ask-the-board`'s bundled tier — i.e. contributing a new default to the shared/giveaway set — is
an explicit, separate action the user must ask for; never do it as the default target.

## Mode 1: Assemble a board

1. List available voices across both tiers, grouped by kind (persona / profile / entity), noting
   which tier each came from.
2. Ask the user to name the new board and pick voices for its Roster (or take their selection if
   already given). For each voice, confirm whether it answers from its primary Hat or a named
   secondary Hat on this board.
   - **Push back on near-duplicate rosters.** A board's value comes from genuinely differing
     rubrics looking at the same question from different angles — a board where every voice
     would predictably agree isn't earning its keep. If the requested voices look like they'll
     converge on everything (same kind of stance, same vocabulary, same priorities), say so and
     suggest a voice that would add a real, different angle, rather than silently assembling it
     as asked. A single-voice "board of one" is a legitimate exception to this — it's not trying
     to generate disagreement.
3. Ask which **Mode** this board runs in: `deliberate` (default — an open question, independent
   takes with optional deeper rounds) or `judge` (score a submitted artifact against every
   voice's rubric). If `judge`, also ask for the **Threshold** — the stated pass condition (e.g.
   "five stars across every dimension"). Confirm every voice going onto a `judge` board actually
   has a Rubric dimensions subsection (see Mode 2) — if one doesn't, flag it before writing the
   board, since it'll only have its implicit heuristic to score with.
4. Write `./boards/<board-name>/BOARD.md` (project-local tier) with a `name`, a one-line
   `purpose`, the `mode`, `threshold` if applicable, and the Roster, per the format in
   `references/schema.md`.
5. Confirm the board was written and tell the user they can now `ask-the-board` it.

## Mode 2: Create or update a voice

### Determine the kind

- **persona** — a generic, synthesized role, representing no specific individual. Author
  directly from the user's description; no external research needed. Must carry a **Basis**
  statement (source *types*, not citations) instead of a Source trail.
  - If a persona is distilled directly from the user's own prior original material (a script,
    prompt, or document they authored themselves, not third-party research), keep the raw
    original under `knowledge/raw/archive/<topic>.md` and reference it from the Basis statement.
    This is distinct from the `profile` convention below — it's the user's own authored source,
    not a citation to someone else's public work, and there's no Source trail requirement to
    satisfy.
- **profile** — a real, named person or organization. Research it (via the `research` skill or
  web search) and write a **Source trail** citing every claim. Before treating the result as
  eligible for public release, apply the provenance rule in `references/schema.md`: every
  citation must be public, or public sourcing plus a structurally separated **Personal lens**
  section. Any non-public source (a private transcript, an internal conversation, the user's own
  unpublished synthesis blended into the main sections) makes the voice local/personal-only by
  default — say so plainly rather than silently marking it releasable.
  - If raw source material (transcripts, downloaded articles, notes) backs the Source trail,
    keep it under `knowledge/raw/profile/<voice-name>/` and link to it from the Source trail
    entries. This is a `profile`-specific convention, not a general-voice one — `persona` and
    `entity` voices use a Basis statement instead, with no linked raw material expected.
- **entity** — an abstract stakeholder or lens with no person/org behind it (a market segment, a
  regulator, a theme, a concept). Author directly, like a persona, and give it a Basis statement.

### Hats

Ask whether this voice needs more than one Hat (most don't). If it does, get the primary Hat and
any secondary Hats, and for each, whether it should `extends` an existing persona. A voice with
multiple Hats can extend a different persona per Hat — resolve and confirm each independently.

### Extending a generic persona

If the user wants to build a personal variant of an existing generic persona ("my real CFO,
based on the generic CFO"), set `extends: <persona name>` on the relevant Hat and only write the
sections that differ from the base persona — don't re-author the whole thing from scratch.

### Rubric dimensions (only if this voice will judge artifacts)

Every voice's Likely-take heuristic is already its rubric, in reasoning-prose form — that's
enough for `deliberate` mode. If this voice will also sit on a `judge` mode board, ask the user
to help make that heuristic explicit and scored: a short list of named dimensions (e.g.
"Technical accuracy," "Business framing," "Audience-appropriate communication"), each with a
one-line description and a rating scale (a 1-5 star scale is a reasonable default). Distill this
from whatever real precedent exists — past evaluations, known winning examples, a stated
standard — the same way a real judging rubric gets built, rather than inventing dimensions from
nothing. Write it as a `### Rubric dimensions` subsection under Likely-take heuristic; it is not
a separate section or a different kind of voice.

### Update mode

If the voice already exists (project-local or bundled), read it first. Append new findings to
its existing Source trail rather than silently overwriting it; extend or revise other sections in
place. Never delete established Source trail entries without telling the user why.

### Write the file

Follow the voice file schema in `references/schema.md` exactly — frontmatter, then all eight
sections in order (Why this voice is on the board / relevant here, Core model / perspective,
Vocabulary, Recurring stances, Signature stories / illustrations, Likely-take heuristic, Tensions
and limits, then Source trail or Basis as appropriate, plus an optional Personal lens for
profiles). Write to `./voices/<name>.md` (project-local tier) by default.

Look at existing voice files (in either tier) for the depth and tone this schema expects before
writing a new one — a thin file with only bullet-point stances is not enough; it needs a real
Likely-take heuristic and real Tensions and limits, or `ask-the-board` will have nothing to work
with when the voice is actually asked a question.

## Mode 3: Create or update a Brief

A Brief is freeform — there's no fixed schema to fill in, unlike a Voice. Interview the user
directly, one question at a time, to surface what's actually relevant: real numbers and
constraints, non-negotiables, current strategic focus, near-term pressures — whatever would
change how a voice should reason about a question in this project, that isn't already obvious
from the code or other project docs. Don't ask about anything already answered elsewhere in the
project (`CONTEXT.md`, ADRs, other docs) — check first, and only ask what's still missing.

Write the result to `./brief/<topic>.md` (project-local only — a Brief is never bundled or
shareable). Multiple Brief files are fine if they cover genuinely separate topics (e.g. a
business-context brief and a separate values-and-boundaries brief); don't force everything into
one file.

**Before writing anything derived from an existing private document** (a personal working file,
notes, a journal), ask explicitly whether it's safe for every voice — including ones the user
might later share or extend from a generic default — to see everything in it verbatim. Personal,
interpersonal, or otherwise sensitive detail that isn't actually load-bearing for grounding advice
should be generalized or dropped, not carried in for convenience. When in doubt, draft the Brief
and show it before writing, rather than writing first and asking after.

Update mode: read the existing Brief first, and revise in place rather than appending
indiscriminately — a Brief should stay a current snapshot of the situation, not an accumulating
log.

## Mode 4: Export a portable prompt

Resolve the named voice or board via the discovery order, then flatten it into plain prose — no
mention of files, paths, tiers, or any of this framework's internal terms (Voice, Board, Hat,
Mode, Rubric, Tier). The target is a single self-contained block someone can paste as a system
prompt anywhere, including a platform with no file access at all.

**A single voice** (a board of one, most commonly a Judge): inline its Why-relevant framing, Core
model, Vocabulary, Recurring stances, and Likely-take heuristic (its Rubric dimensions if it has
one). If it has Rubric dimensions, end with an instruction to score against them and report
against whatever Threshold its board states, never rewriting the artifact itself. If it doesn't,
end with an instruction to answer the user's question directly, in that voice. Close with a
short "ready" line naming what input to send next (a question, or an artifact).

**A board of several voices** (`deliberate` mode): stack one flattened block per voice, then add
the round procedure in plain steps — independent takes first, agreement/disagreement stated
plainly, a rebuttal round only if explicitly asked for, a vote only if disagreement survives that
*and* it's explicitly asked for, then a closing synthesis that can disagree with the board's own
vote. Never default to running the rebuttal round or the vote in the exported instructions
themselves — the exported prompt should preserve the same opt-in-by-request shape `ask-the-board`
uses, not collapse it into always running every round.

**Output**: show the flattened prompt directly in the response — this is the default and the
usual case. Only write it to a file if the user explicitly asks to save it, and if so, say
plainly that the saved copy is a snapshot that will drift if the source voice/board changes —
regenerating via this mode is cheaper and more reliable than hand-maintaining a saved copy.
