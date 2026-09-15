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
- **[board-framework-guide](./skills/board-framework-guide/SKILL.md)** — the onboarding skill for
  everything above. Reads the other three skills' actual files live (never a cached summary),
  asks whether you want to use / customize / extend, and teaches that one path using your own
  real, installed voices and boards as examples — then hands off to whichever skill/Mode you
  actually need rather than doing the work itself.

Full schema and vocabulary (Voice, Board, Hat, Mode, Rubric, Brief, Persona, Profile, Entity,
Roster, Tier, Take, Rebuttal Round, Vote, Verdict, Threshold, Basis, Releasable, Source Trail,
Personal Lens) is in
[`skills/ask-the-board/references/schema.md`](./skills/ask-the-board/references/schema.md) and
[`skills/build-board/references/schema.md`](./skills/build-board/references/schema.md) — read one
before doing anything in either skill.

## Worked example: a workshop capstone

[`examples/workshop-security-findings/`](./examples/workshop-security-findings/) is a real
`ask-the-board` deployment: a judge-mode board (`ai-reviewer-board`, three voices scored against
their own rubrics) plus a grounding Brief, built for a conference workshop's board-build
capstone exercise. See its [`SETUP.md`](./examples/workshop-security-findings/SETUP.md) for
attendee-facing setup instructions — a good model for pointing a board at your own real
scenario.

## Using it without any coding agent at all

No Claude Code, no Codex, no file access? You can still use a board or a judge — just as a plain
system prompt in any chat interface, or saved as a persistent custom assistant. Two ready-to-paste
examples live in [`examples/exported-prompts/`](./examples/exported-prompts/):

- **[c-suite-board.md](./examples/exported-prompts/c-suite-board.md)** — a deliberating panel
  (CEO, CFO, CISO) for sanity-checking a plan or decision.
- **[conference-program-reviewer-judge.md](./examples/exported-prompts/conference-program-reviewer-judge.md)**
  — a single scoring judge for a conference-talk submission.

Both are self-contained: no mention of files, skills, or this repo's internal terms, so they work
as-is anywhere that accepts a system prompt or custom instructions.

### Where to paste one

- **Gemini Gem:** [gemini.google.com/gems](https://gemini.google.com/gems) → create a new Gem →
  paste the whole file into the *Instructions* box → save. It's now a reusable, named assistant —
  no re-pasting the prompt every time.
- **Custom GPT (ChatGPT):** create a GPT → paste the file into *Instructions*.
- **Claude.ai Project:** create a Project → paste the file into *Project instructions*.
- **Any plain chat, one-off:** paste the file as your first message, then send your question or
  the artifact you want judged.

### Generating your own export

If you *do* have a coding agent with this skill installed, `build-board`'s export mode (Mode 4)
flattens any voice or board — including your own custom ones — into this same paste-anywhere
format: ask it to "export the `<name>` board as a portable prompt." That's how the two examples
above were produced. A saved export is a snapshot, though — if you edit the source voice/board
later, regenerate the export rather than hand-editing the pasted copy.

## Why

Most "ask an expert" prompts are one voice pretending to be several, or several voices that never
disagree. This framework keeps voices as real, editable files with their own rubric, so a board's
value is genuinely differing perspectives, not the same take five times. The `judge` mode came out
of a real competition — a rubric distilled from years of judging transcripts, run against a
submission until every gap was closed by hand — and generalizes the same way: a judge voice isn't
a different kind of thing from an advisor voice, just a rubric made explicit and scored.

## License

MIT
