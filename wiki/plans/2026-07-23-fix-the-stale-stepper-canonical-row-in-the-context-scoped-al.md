---
status: implemented
executed: 2026-07-23
date: 2026-07-23
evidence:
  - "PR #15 https://github.com/verndale/ui-design-brain/pull/15 (merged 2026-07-23)"
source_tool: claude
source: "/Users/joe.fusco/.claude/plans/fix-the-stale-stepper-imperative-kernighan.md"
topics: []
---
# Fix the stale Stepper canonical row in the context-scoped aliases table

## Context

In `skills/ui-design-brain/index.md`, the **Context-scoped aliases** table has two "Stepper" rows.
The second one — the *"(the canonical)"* row — describes the Stepper canonical's context as
`multi-step form / wizard control`. That went stale when the **Wizard** pattern was added:

- The Stepper canonical is the **numeric +/- quantity control** (`patterns/stepper.md`:
  "A numeric input with increment and decrement buttons").
- "Multi-step form" is now an **alias of Wizard**, not Stepper. The label "Stepper" never
  resolves to a wizard/multi-step control.

The collision is already handled correctly everywhere else in the catalog (`stepper.md`,
`wizard.md`, `progress-indicator.md` all state "a multi-step flow is a Wizard, not a Stepper").
Only this one index cell is wrong. It's logged as an **Open thread** in
`wiki/topics/component-catalog.md` and as a follow-up on the prior journal entry.

Outcome: reword the single cell to describe the true canonical (numeric control), and close the
loop in the wiki (topic Decisions + Open-thread removal + a short journal entry), then rebuild the
graph so generated pages stay byte-fresh.

## Scope decision

Full wiki capture (journal entry included) — confirmed with the maintainer. `index.md` is an
explicit capture-triggering surface in `wiki/MECHANICS.md`, and the new Decisions bullet gets a
journal link to point at, matching the sibling bullet's convention.

## Pre-work: issue + branch (before any edits)

Current state: HEAD is on **`main`** (`cd20817`, `[origin/main]`) — the working tree must not be
edited on the default branch, and the maintainer asked to branch from main. `main` already contains
the Wizard pattern and the stale row, so it is a coherent base.

**0. File a GitHub Bug issue** via the `github-issue-creator` skill (it drafts, shows the draft, and
gets explicit go-ahead before creating — do not create silently).
- Type: **Bug** (stale/incorrect catalog content).
- Recommended labels (repo has no `area: catalog` label; the defect lives in the catalog):
  - `bug` — wrong content.
  - `documentation` — doc/content correctness fix.
  - `area:wiki` *(candidate)* — the fix also updates wiki pages; confirm at the skill's review step.
- Capture the resulting **issue number `#N`** — it feeds the journal entry, the Decisions bullet,
  and the eventual `Closes #N` in the maintainer's commit.

**0.5. Create the working branch from main**, before touching any file:
```bash
git switch -c fix/stepper-stale-canonical-row
```
(We are already on `main`, so this branches from it. Branch name is a suggestion — adjust to taste.)
This is a local branch create only — **no** commit / push / merge / tag / PR.

## Files to change

### 1. `skills/ui-design-brain/index.md` — the actual fix (one cell, line 114)

Current:
```
| Stepper | **Stepper** | multi-step form / wizard control (the canonical) |
```
Change to:
```
| Stepper | **Stepper** | numeric +/- quantity control (the canonical) |
```
Leave the `Stepper → Progress indicator` (progress context) row directly above **unchanged**.
No manifest change, no pattern-count change, no alias change.

### 2. `wiki/topics/component-catalog.md` — close the thread

- **Remove** the entire `## Open threads` section (heading + the single stale bullet, lines ~23–25).
  It's the only bullet, so per the topic template "omit the section if none" the heading goes too.
- **Prepend** a newest-first bullet to `## Decisions` (above the existing 2026-07-23 five-patterns
  bullet):
  ```
  - 2026-07-23 — Reworded the `index.md` context-scoped "Stepper (the canonical)" row from
    "multi-step form / wizard control" to "numeric +/- quantity control", resolving the stale
    mapping the Wizard addition left behind (the Stepper canonical is the numeric control;
    "Multi-step form" now resolves to Wizard) ([issue #N](https://github.com/verndale/ui-design-brain/issues/N), [journal](../journal/2026-07-23-fix-stale-stepper-canonical-row.md)).
  ```
  Substitute the real issue number from pre-work step 0 for `#N` / the URL, matching the existing
  `[issue #11]` precedent in the sibling Decisions bullet.

### 3. `wiki/journal/2026-07-23-fix-stale-stepper-canonical-row.md` — NEW journal entry

Follow the MECHANICS journal template. `plan: none`, `pr: pending`, `topics: [component-catalog]`.
Keep it ~20 lines:

```markdown
---
date: 2026-07-23
topics: [component-catalog]
plan: none
pr: pending
---
# Fix stale Stepper canonical row in the context-scoped aliases table

## Why

- Adding the Wizard pattern (which owns the "Multi-step form" alias) left index.md's
  context-scoped aliases table still describing the Stepper canonical as a
  "multi-step form / wizard control".
- Wrong on two counts: the Stepper canonical is the numeric +/- quantity control
  (patterns/stepper.md), and "Multi-step form" now resolves to Wizard. The "Stepper" label
  never resolves to a wizard control.
- Logged as an Open thread on the component-catalog topic and a follow-up on the prior journal
  entry.

## What changed

- Reworded one table cell (index.md, the "Stepper (the canonical)" row) to
  "numeric +/- quantity control (the canonical)".
- Doc-only, one cell: no manifest change, no pattern-count change, no alias change. The
  Stepper → Progress indicator (progress context) row is untouched.
- Closed the topic Open thread and recorded a Decisions entry.

## Files

- skills/ui-design-brain/index.md
- wiki/topics/component-catalog.md

## Follow-ups

- Tracking: issue #N   <!-- fill from pre-work step 0 -->
```

Set the journal frontmatter `pr: pending` (the maintainer commits later; merge automation fills it).
Add the issue reference (`Tracking: issue #N`) once step 0 yields the number.

### 4. `wiki/INDEX.md` — one journal index line

Prepend to the `## Journal` list (reverse-chronological; newest 2026-07-23 goes on top):
```
- 2026-07-23 — [Fix stale Stepper canonical row in the context-scoped aliases table](journal/2026-07-23-fix-stale-stepper-canonical-row.md) — reworded index.md's Stepper (the canonical) context from "multi-step form / wizard control" to the numeric +/- quantity control.
```

### 5. Rebuild the graph

Run `pnpm graph:build` — regenerates `scripts/graph/data/graph.json` and the generated
`wiki/connections/*` pages so the new journal node/edges are byte-fresh. **Do not hand-edit** any
`wiki/connections/*` file.

```bash
pnpm graph:build
```

## Do NOT touch

- `wiki/journal/2026-07-23-close-consumer-catalog-gaps.md:34` — journal is append-only history; its
  follow-up line stays as the accurate record of the time it was written.
- `wiki/plans/2026-07-23-...` — archived plan, verbatim/immutable.
- `wiki/connections/see-also.md` and siblings — generated by `graph:build`, never hand-edited.
- `skills/_meta/_sections.md` — already correct (`Stepper → Progress indicator` only).
- `patterns-manifest.json`, `README.md` count — no change (this is not a pattern add/rename/realias).

## Verification

```bash
pnpm evals:graph
```
- Expect the graph freshness + integrity gate green (17/17). If it flags `wiki/connections/*` as
  stale, re-run `pnpm graph:build` (step 5) first.

```bash
grep -rn -i "stepper" skills/ | grep -i -E "multi-step|wizard"
```
- Expect only the intentional name-collision notes in `stepper.md`, `wizard.md`, and
  `progress-indicator.md` (each stating a multi-step flow is a Wizard, not a Stepper). The
  `index.md` line must **no longer** appear.

## Boundary

- **Allowed here** (explicitly requested): filing the GitHub Bug issue via `github-issue-creator`
  (its own confirm gate applies) and creating the local branch from main.
- **Not allowed**: commit / push / merge / tag / release / consumer-sync. Deliver the edits
  uncommitted on the new branch and hand back to the maintainer with a suggested Conventional
  Commits message:
  `docs(ui-design-brain): fix stale Stepper canonical row in context-scoped aliases table` — body
  closing the issue (`Closes #N`).
