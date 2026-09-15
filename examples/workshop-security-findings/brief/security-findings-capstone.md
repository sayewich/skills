# Brief: Security Findings That Actually Get Fixed — capstone scenario

Grounds both `ai-reviewer-board` and `ai-reviewer-board-engineering-led` in the
workshop's fixed scenario, so every voice reasons about the actual system and the actual named
threats rather than a generic AI-security question.

## The system

An AI grocery-shopping agent, built as four components:

- **Orchestrator** — receives the user's request, plans the sequence of steps, and coordinates
  calls to the LLM Core and Tool Executor.
- **LLM Core** — the model that interprets requests, reasons about substitutions/preferences, and
  produces the instructions the Orchestrator and Tool Executor act on.
- **Memory Store** — persists user preferences, past orders, and retrieved context (recipes,
  product data) across turns and sessions.
- **Tool Executor** — the component with real-world side effects: searching the catalog, adding
  items to a cart, applying payment, placing the order.

## The threat catalog: T1–T8

The workshop's fixed capstone artifact is eight named threats, T1 through T8, each already mapped
to one of the four components above, an owning team, and a risk rating, and each tagged against
one or more of STRIDE, LINDDUN, the OWASP LLM Top 10, and MITRE ATLAS.

**Facilitator note:** paste the workshop's actual T1–T8 table here (component, owner, risk
rating, framework tags, one-line description each) before running either board against it. Every
voice's Take should cite the specific finding (e.g. "T4, Tool Executor, prompt-injection-driven
unauthorized purchase") rather than reasoning about the scenario in the abstract — that's what
makes this a pressure-test of a real finding rather than a generic AI-security discussion.

Until the real table is pasted in, the two illustrative findings below (not part of the official
T1–T8 set) are enough to exercise the board mechanically:

- **Illustrative — Tool Executor, High:** a crafted product review retrieved into context by the
  Orchestrator contains an embedded instruction that, when the LLM Core processes it, causes the
  Tool Executor to add a high-value item to the cart and complete checkout without an explicit
  user confirmation step. (OWASP LLM Top 10: prompt injection / excessive agency; STRIDE:
  Elevation of Privilege.)
- **Illustrative — Memory Store, Medium:** user dietary and health-condition preferences
  (persisted to personalize future recommendations) are retained indefinitely with no stated
  retention limit and are readable by a support-tooling integration with no logged access record.
  (LINDDUN: linkability / non-repudiation-of-access; maps toward GDPR data-minimization and
  access-logging obligations.)

## Why this matters to each voice on either board

- **CISO** — cares which component's blast radius a finding sits in (Tool Executor findings are
  the ones with real-world, irreversible side effects — a completed purchase can't be silently
  undone the way a bad recommendation can) and whether the mitigation actually closes the
  crossing point or just the symptom.
- **CFO** — cares what remediation costs against the workshop's implied constraint (a small team
  shipping fast, not an enterprise security budget) and whether the fix is proportionate to what a
  wrong purchase or a data-retention gap would actually cost the business.
- **Compliance Officer** — cares whether a finding implicates a specific obligation (payment data
  handling, retention limits on health/dietary data, an emerging AI-governance clause) with a real
  clock or evidence requirement attached, independent of the finding's technical severity.
- **Senior Engineer** — cares whether the proposed fix is a scoped, testable diff that survives a
  refactor (e.g. does hardening the Orchestrator's input handling also cover content arriving via
  the Memory Store's retrieved context, or only the direct chat path), and what it costs against
  the rest of a real sprint.

## Constraints worth keeping in view

- This is a workshop capstone, not a production incident — voices should reason as if advising a
  small team on a real but time-boxed exercise, not a Fortune 1000 security program.
- The point of running multiple voices against the same finding is to surface genuinely different
  priorities on the *same* finding, not to relitigate which threat is most severe — that ranking
  is already fixed by the T1–T8 table's risk ratings.
