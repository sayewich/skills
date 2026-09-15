# Pre-workshop setup: Security Findings That Actually Get Fixed

These are setup instructions for attendees of the ISC2 Security Congress 2026 pre-conference
workshop, **Security Findings That Actually Get Fixed** — not general instructions for this
repo. If you're here for the `ask-the-board`/`build-board` skills themselves, see the
[top-level README](../../README.md) instead.

This directory holds everything the workshop's board-build capstone module needs on the CLI
path, so you can verify your setup works before you show up. If you'd rather use a browser with
no install at all, you don't need any of this — the facilitator will hand out a portable-prompt
link/QR code at the start of that module instead.

## What's in here

- `brief/security-findings-capstone.md` — grounds the `ai-reviewer-board` board in the
  workshop's running scenario (an AI grocery-shopping agent) so every voice reasons about the
  actual system, not a generic question.

The skills and the board themselves aren't checked in here — you install them fresh in step 2
below, straight from this repo, so you always get the current judge-mode fix.

## Setup

1. Install [Claude Code](https://claude.com/claude-code) (or another coding agent that supports
   the [skills](https://npmjs.com/package/skills) convention) and make sure you're signed in.
2. Clone this repo and install the two skills into this directory:
   ```bash
   git clone https://github.com/sayewich/skills.git
   cd skills/examples/workshop-security-findings
   npx skills@latest add sayewich/skills -s ask-the-board -s build-board -a claude-code --copy -y
   ```
3. Start Claude Code in this directory:
   ```bash
   claude
   ```

## Verify it runs

Before the workshop, confirm your setup actually works by asking the board to judge a finding.
In your Claude Code session, paste:

> Ask the `ai-reviewer-board` board to judge this finding: a crafted product review retrieved
> into context contains an embedded instruction that, when the LLM processes it, causes an
> automated purchase to complete without an explicit user confirmation step.

You should see three independent takes — CISO, CFO, Compliance Officer — each scored against its
own rubric, followed by a PASS/FAIL verdict. If you see that, you're set for the workshop. If you
hit an error, bring your laptop as-is to the workshop's environment-setup appendix table and a
facilitator will help you sort it out before module 4.
