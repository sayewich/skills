---
name: extract-source
description: This skill should be used when the user wants to enrich an existing profile voice (for use with ask-the-board / build-board) from a large source document — a book, a transcript, a long article dump — especially when it needs chunking and parallel background-agent processing because it's too big to read in one pass. Triggers on requests like "add this book to X's profile", "extract from this transcript", "there's a book for <person> at <path>, add it".
---

# Extract Source

## Overview

`build-board`'s Mode 2 (create/update a voice) already knows how to write a profile. This skill
is the missing piece for one specific case: the source material is a whole book or transcript —
too big to read in one pass, and too big to summarize without losing the person's actual voice
under a thin restatement. It handles extraction, chunking, and parallel delegation; it still
defers to `build-board`'s schema and conventions ([../build-board/references/schema.md](../build-board/references/schema.md))
for the actual write.

This is a personal power tool, not part of the `ask-the-board` giveaway — no portability
requirement, no bundled-tier concept. It only ever writes to the project-local tier, same as
`build-board` does by default.

## Step 1: Identify the target voice and the source

The voice being enriched must already exist as a `kind: profile` voice (project-local
`./voices/<name>.md`). If it doesn't exist yet, stop and point to `build-board` Mode 2 to create
a lightweight base profile first — this skill deepens an existing profile, it doesn't create one
from nothing.

Confirm the source file's path and type:
- **PDF** (a book, a printed transcript) → Step 2.
- **Plain text/markdown transcript** → skip Step 2, go to Step 3 with the file as-is.

## Step 2: Extract text from a PDF

Check what's available, in this order, and use the first that works:

1. The `Read` tool's native PDF support (works for short PDFs; fails on long ones needing
   `pdftoppm`/poppler, which usually isn't installed in a container).
2. `pdftotext` / `pdfinfo` (poppler-utils) via Bash, if installed.
3. **The bundled script** — reliable fallback, no system package install (no `sudo` needed):
   ```bash
   cd .claude/skills/extract-source/scripts
   npm init -y && npm install pdf-parse   # one-time per environment
   node extract_pdf.js /path/to/source.pdf /tmp/extract-source/<slug>.txt
   ```
   Write extracted text to a scratch location outside the repo (e.g. `/tmp/extract-source/`) —
   it's a working intermediate, not something to commit.

Note the reported page/character count. Above roughly 15-20K tokens (a rough rule of thumb:
more than a few hundred KB of extracted text, or more than ~30-40 pages), plan to chunk and
delegate rather than read it all directly — the whole point of this skill.

## Step 3: Find natural chunk boundaries

For a book: search the extracted text for its table of contents, then find where each chapter
actually starts in the body (titles are often split across lines differently in the TOC vs. the
body — grep a few candidate patterns, e.g. `^CHAPTER [0-9]+$`, `^Chapter [0-9]+\.$`, and compare
line counts against the TOC's chapter count until they match). Record each chapter's starting
line number; the chapter's range is start-to-next-chapter-start.

For a transcript with no clear structure: chunk by roughly even size instead (e.g. every 2000-2500
lines), or by natural breaks if there are any (speaker turns, timestamps, topic changes).

Group chapters/sections into 2-4 agent-sized chunks (each chunk should be comfortably readable by
one agent in a handful of `Read` calls — a few thousand lines is reasonable). Don't create one
agent per tiny chapter; don't create one giant chunk that recreates the original problem.

## Step 4: Delegate extraction to parallel background agents

Spawn one agent per chunk (the `Agent` tool, run in background — the default). Every prompt must
include:

- The exact file path and line range to `Read` (in several `Read` calls if the range is long).
- **A copyright instruction appropriate to the source**: for a commercially published book,
  explicitly forbid quoting or reproducing substantial verbatim passages — paraphrase throughout,
  short phrases only. For the user's own original material (their own transcript, their own prior
  writing), this restriction doesn't apply the same way, but still avoid dumping massive verbatim
  blocks into the eventual profile — summarize even here, since a profile is meant to be a working
  rubric, not a copy of the source.
  - **Renamed sections in a real published work are common** (e.g. Carla Harris's "Carla's
    Pearls" chapter-ending takeaways) — instruct the agent to paraphrase these into its own words
    too, not copy them verbatim just because they're formatted as a bulleted list.
- What to extract per chapter/section: core lesson (2-3 sentences), distinctive vocabulary/coined
  terms (one-line definitions), 1-2 signature stories paraphrased, chapter takeaways paraphrased.
- **What's already in the profile.** Paste the existing voice file's current Vocabulary and
  Recurring stances section headers (not the whole file) and instruct the agent to report only
  what's genuinely new or meaningfully deepened — not a restatement of a concept the profile
  already covers well. This is the single most important instruction for keeping the compiled
  result useful instead of bloated.

## Step 5: Collect the actual output — don't trust idle notifications alone

A background agent going idle (`idleReason: "available"`) means it finished its turn, **not**
that its full output has reached you. Idle notifications often arrive with no content at all.
For every agent, explicitly `SendMessage` a request for "the full structured summary, complete
text" before assuming you have what you need — expect to nudge more than once if an agent keeps
going idle without actually sending it. Do not proceed to Step 6 on partial or assumed content.

## Step 6: Compile into the profile

Once every chunk's findings are in hand, follow `build-board`'s Mode 2 **Update mode** exactly
(see [../build-board/SKILL.md](../build-board/SKILL.md)) to write the changes:

- Merge new Core model concepts, Vocabulary, Recurring stances, and Signature stories into the
  existing voice file — expand, don't replace, and don't duplicate what's already well-covered.
- Add a **Source trail** entry for the new source. For a commercially published book, this is a
  bibliographic citation only (title, author, publisher, year) — never a stored extract or raw
  copy of the text, and say so explicitly in the entry. For the user's own transcript, follow the
  existing `knowledge/raw/profile/<name>/` convention if it's worth keeping as linked raw
  material.
- If Tensions and limits should be updated (e.g. a source's rhetorical style, era, or audience
  assumptions are worth flagging), do that too — don't just add color, keep the profile honest
  about the new source's limits the same way the original profile was.
- Leave existing **Personal lens** entries untouched; only add new ones where they tie to
  already-established facts about the user's own situation, not speculation prompted by the new
  material alone.

## Step 7: Clean up and note what happened

Delete scratch extraction files once compiled (they live outside the repo in `/tmp/`, so this is
usually automatic — just don't leave copies inside the repo). If a bibliographic placeholder
record already existed for this source (e.g. under `knowledge/raw/profile/<name>/`), update its
`capture` field to reflect the fuller extraction rather than leaving it saying no full text was
captured.
