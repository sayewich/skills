# Skills

Skills for running a panel of advisors, judges, or personas against a decision, plan, or piece of
work — inside Claude Code, Codex, or any agent that supports the [skills](https://npmjs.com/package/skills) convention.

A **board** is a named roster of **voices** — generic personas, real researched profiles, or
abstract entities — kept as plain files, not hardcoded. Ask a board an open question and every
voice reasons independently from its own rubric before a synthesis; or submit an artifact for a
board to score, each voice against its own rubric, with a verdict per voice.

## Installation (30-second setup)

```bash
npx skills@latest add sayewich/skills
```

Pick the skills you want, and which coding agents to install them on. It writes the skills into
your repo as ordinary files you own and can edit — nothing updates behind your back. Pull the
latest changes later with `npx skills update`.

## What's here

- **[ask-the-board](./skills/ask-the-board/SKILL.md)** — resolves a named board's roster and
  either deliberates an open question (independent takes, optional rebuttal round, optional vote,
  then a synthesis) or judges a submitted artifact against every voice's rubric. Comes with two
  starter boards (C-Suite, Security Leadership) and a set of generic composite personas — no named
  real individuals, all shareable.
- **[build-board](./skills/build-board/SKILL.md)** — the authoring skill. Assemble a board from
  existing voices, create or update a voice (persona, researched profile, or abstract entity),
  create or update a Brief that grounds a board's sessions in your real situation, or export a
  voice/board as a flattened copy-paste prompt for a platform with no file access (Gemini,
  ChatGPT).
- **[extract-source](./skills/extract-source/SKILL.md)** — enriches an existing profile voice
  from a large source document (a book, a transcript) too big to read in one pass: chunking,
  parallel background-agent delegation, then hands off to `build-board` for the actual write.

Full schema and vocabulary (Voice, Board, Hat, Mode, Rubric, Brief, Persona, Profile, Entity,
Roster, Tier, Take, Rebuttal Round, Vote, Verdict, Threshold, Basis, Releasable, Source Trail,
Personal Lens) is in
[`skills/ask-the-board/references/schema.md`](./skills/ask-the-board/references/schema.md) and
[`skills/build-board/references/schema.md`](./skills/build-board/references/schema.md) — read one
before doing anything in either skill.

## Why

Most "ask an expert" prompts are one voice pretending to be several, or several voices that never
disagree. This framework keeps voices as real, editable files with their own rubric, so a board's
value is genuinely differing perspectives, not the same take five times. The `judge` mode came out
of a real competition — a rubric distilled from years of judging transcripts, run against a
submission until every gap was closed by hand — and generalizes the same way: a judge voice isn't
a different kind of thing from an advisor voice, just a rubric made explicit and scored.

## License

MIT
