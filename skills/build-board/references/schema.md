# Voice and board file formats

## Core concepts

**Voice** — a single reusable participant: a generic persona, a real researched profile, or an
abstract entity. Board-agnostic. Lives in a shared library, not inside any one board.

**Board** — a named grouping that references voices by name for a specific purpose (an advisory
board, a judging panel, an editorial board, a one-off "run this past them" review). A board owns
no copies — only a roster.

**Hat** — a role/lens a voice can answer from. Every voice has exactly one primary hat and zero
or more secondary hats. Only the primary hat answers by default; a secondary hat must be asked
for explicitly.

**Mode** — a board's interaction pattern: `deliberate` (an open question, independent takes with
optional deeper rounds) or `judge` (score a submitted artifact against a voice's rubric). Set in
`BOARD.md`'s frontmatter; defaults to `deliberate`.

**Rubric** — the criteria a voice applies when forming a take or a verdict: its Core model,
Vocabulary, Recurring stances, and Likely-take heuristic, together. Every voice already has one —
left as reasoning prose for `deliberate` mode, or made explicit and scored (named dimensions with
a rating scale) for `judge` mode. Not a separate file or voice kind; the same schema serves both.

**Brief** — one or more project-local, freeform markdown files under `./brief/` describing the
user's real situation (business facts, non-negotiables, constraints). Read by every voice before
forming a take or verdict, in every round — this is briefing, not peer contamination, so it does
not weaken Round 1 independence (see Modes, below). Optional: proceed silently if `./brief/`
doesn't exist. Always project-local; there is no bundled, shareable equivalent — a brief is
inherently personal.

## Voice kind taxonomy

Three fixed kinds:

| Kind      | What it is                                                                 |
|-----------|-----------------------------------------------------------------------------|
| `persona` | A generic, synthesized role (e.g. the OOTB CFO/CEO/CISO)                   |
| `profile` | A real, named person or organization, built from actual research           |
| `entity`  | An abstract stakeholder or lens that isn't a person/org (a market segment, a regulator, a theme, a concept) |

No fourth kind for "company" or "theme" — both fold into `profile`/`entity` respectively.

## Voice file schema

One markdown file per voice, any kind, same shape:

```markdown
---
name: <display name>
kind: persona | profile | entity
primary_hat: <role label, e.g. "CFO">
secondary_hats: [<role label>, ...]     # optional, zero or more
extends: <voice name>                    # optional — a generic persona this voice builds on
---

## Why this voice is on the board / relevant here

## Core model / perspective

## Vocabulary

## Recurring stances

## Signature stories / illustrations

## Likely-take heuristic
<how to derive this voice's position on a new, specific question from the above>

### Rubric dimensions            # optional — only for a voice used in `judge` mode
<a short list of named dimensions, each with a one-line description and a rating scale
(e.g. 1-5 stars); the same heuristic above, made explicit and scored, not a separate concept>

## Tone calibration               # optional — see "Tone calibration" below
<a handful of named dials, each anchored at low/mid/high with a one-line description of how the
voice actually sounds at that setting>

## Tensions and limits
<where this voice's lens runs out, or where it's known to overreach>

## Source trail                       # required for kind: profile
<links/citations for every claim about this voice's real views>

## Basis                              # used for kind: persona or entity, in place of Source trail
<a short, honest statement of derivation — e.g. "composite archetype synthesized from
public industry research on X priorities"; no citations required, but name source types>

## Personal lens                      # optional, only on profile voices
<the author's own interpretation, visibly separated — its own heading, never blended into
the voice's documented/attributed views>
```

`extends` inheritance: a voice with `extends: <name>` inherits the base fields (core model,
vocabulary, recurring stances) of the named generic persona, overriding only the sections it
defines locally. Each hat (primary or secondary) can independently declare its own `extends`
target — a voice can extend a different persona per hat.

## Board file format

```
boards/<board-name>/
  BOARD.md
```

```markdown
---
name: <board display name>
purpose: <one line>
mode: deliberate | judge                # optional, defaults to deliberate
threshold: <pass condition>              # judge mode only, e.g. "five stars across every dimension"
aliases: [<short name>, ...]             # optional — additional names this board resolves under
---

## Roster

- <voice name>                          # answers from its primary hat
- <voice name> (as <hat label>)         # explicitly invoke a secondary hat for this board
```

A board is just this roster file — no per-member copies.

**Aliases:** an optional `aliases` list gives a board extra names it resolves under (e.g. a short
initialism for a long board name) — resolution matches the directory name, the frontmatter
`name`, or any listed alias, case-insensitively, with the same two-tier order as any other board
lookup.

**Board of one:** a roster with a single voice is valid and common (this was the shape of the
original Virtual Judge — one judge, one rubric, one artifact). A single-voice board only ever
runs Round 1 (or, in `judge` mode, produces one Verdict) — there is no one to hold a rebuttal
round or a vote with.

## Discovery order

Applies identically to `boards/` and `voices/`. Two tiers, checked in order:

1. **Project-local** — `./boards/<name>/` and `./voices/<name>.md` in the current project.
   Personal, private by default, checked first. Overrides a bundled board/voice of the same name.
2. **Skill-bundled** — `boards/` and `voices/` inside this skill's own directory. The generic,
   shareable defaults that ship with the skill.

## Public-release provenance rule

A `profile`-kind voice is eligible for public release only if every entry in its Source trail is
public (published books, talks, interviews, articles). Any non-public source makes it
local/personal-only by default, regardless of the subject's public fame. Exception: a profile
citing only public sources may also carry a Personal lens section and remain releasable, as long
as the separation is structural (its own heading).

`persona` and `entity` voices carry no such restriction, but should document their Basis for
transparency.

## Tone calibration

Optional, and rare — most voices don't need it, because a genuinely different rubric already
produces genuinely different-sounding output. Reach for it only when two voices on the same board
risk sounding alike despite holding different positions (practitioner voices in a similar
register, say). It captures **how** a voice sounds, distinct from **what** it believes (the rubric
above).

Keep it to a handful of named dials, each described in plain language at low/mid/high — not a
numeric or vector scale. The point is a spoken anchor a voice's actual output can be checked
against, not a score to compute. A reasonable starting set: **directness** (softens a point vs.
states it plainly), **formality** (casual register vs. formal), **warmth** (detached vs.
personally invested), **certainty** (hedges vs. asserts outright). Use different dials if these
don't fit a given voice; there's no fixed list.

## Modes

**`deliberate`** (default) — an open question, answered across up to three progressively
opt-in rounds:

1. **Round 1** (always runs): every voice gives an independent take, blind to the others.
2. **Rebuttal round** (opt-in — the user must ask for it): every voice reads all Round 1 takes
   and responds by holding its position, rebutting a specific point, or revising with a stated
   reason.
3. **Vote** (opt-in, only when real disagreement survives the rebuttal round and the user wants
   a decisive read): every voice backs a concrete option; tallied lightly — a count and a
   margin, not Robert's Rules — with dissent and its reasons reported.

A synthesis always closes a `deliberate` session, informed by whichever rounds ran. A vote's
result is input to the synthesis, never a replacement for it — the assistant's own
recommendation can still disagree with the board's tally, and should say so if it does.

**`judge`** — an artifact is submitted (not a question). Every voice on the roster scores it
independently against its own rubric — no cross-talk between judges — producing one **verdict**
per voice: a rating per rubric dimension plus specific, actionable gaps, never a rewrite of the
artifact. If more than one voice is on the roster, report each verdict plus a simple aggregate.
There is no auto-loop: closing the gaps is the user's work, exactly as it was in the original
Virtual Judge this mode is modeled on. The user resubmits the revised artifact as a fresh
invocation, scored again against the board's stated **threshold**.

## Brief

Before any round in either mode, check `./brief/` in the current project for freeform markdown
files describing the user's real situation. If present, read all of them and let every voice
use that grounding when forming its take or verdict — a real CFO voice reasoning about a real
budget question is more useful with the actual numbers than without them. If `./brief/` doesn't
exist, proceed silently; don't flag its absence.

## Exporting a portable prompt

`build-board` can flatten a voice or board into plain prose for a platform with no file access
(Gemini, ChatGPT, any single-turn chat) — no framework terms, no file paths, just the content
inlined directly. This is a manual, on-request flatten, not an automated pipeline; a saved copy
of one is a snapshot that drifts as the source voice/board changes, not something to
hand-maintain — regenerate it instead of editing it.

For a board of several voices, give each flattened block a clear, consistently-worded heading
(e.g. `## Perspective: <Name>`) rather than running them together as undifferentiated prose. This
lets the target platform be asked to recall or focus on one voice by name later in the
conversation ("go back to <Name>'s view on this") without the whole prompt needing to be resent —
useful once a board has more than two or three voices.
