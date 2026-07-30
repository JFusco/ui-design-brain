# Context Wiki

Why this repo is the way it is: executed plans, decisions, and change history. Read this index first; open only the pages it routes to.

## Contents

- How to navigate
- Topics
- Journal
- Plans
- Connections

## How to navigate

1. "Why is X like this / what's the design of X" → match X in Topics below; open that one page.
2. "What changed when / history of X" → scan the Journal lines below; open only matching entries.
3. "Was plan X implemented / what plans exist" → [plans/INDEX.md](plans/INDEX.md) is the audit table; archived plan files sit next to it.
4. Full plan detail behind a change → follow the plan link inside the journal entry or topic page.
5. "How does X wire to the rest of the catalog/wiki" → [connections.md](connections.md), a small index over the generated map; open the section your question needs: [catalog membership](connections/catalog.md), [pattern cross-references](connections/see-also.md), [skill references](connections/references.md), [wiki wiring](connections/wiki-wiring.md).
6. Cross-system "why", wiring, or impact question → agents silently use `pnpm graph:navigate` (`scripts/wiki/navigate.cjs`) before reading files; it returns a deterministic, minimal itinerary. Developers do not need to run or remember this utility.
7. No index hit or no route → grep `wiki/` for the term; then fall back to `git log` / `gh`. Never load the whole wiki.

## Topics

<!-- One line per topic page: [Title](topics/<slug>.md) — hook. Keep alphabetical by slug. -->

- [Agent guidance](topics/agents-guidance.md) — how the repo's `AGENTS.md` and `CONTRIBUTING.md` are organized.
- [Component catalog](topics/component-catalog.md) — the canonical UI-pattern catalog: manifest, aliases, cross-references, and the exact-string resolution consumers depend on.
- [Knowledge graph & context wiki](topics/graph-wiki-subsystem.md) — the deterministic graph + Sigma.js viewer and the context wiki, ported from ai-orchestration.
- [Packaging & distribution](topics/packaging-and-distribution.md) — how the catalog became a standalone published package that consumers vendor.

## Journal

<!-- Reverse-chronological, one line per entry: YYYY-MM-DD — [Title](journal/<file>.md) — hook. -->

- 2026-07-30 — [Add the Stat pattern](journal/2026-07-30-add-stat-pattern.md) — a standalone value-plus-label figure, promoted on recurrence across two project retrospectives (70 → 71).
- 2026-07-23 — [Fix stale Stepper canonical row in the context-scoped aliases table](journal/2026-07-23-fix-stale-stepper-canonical-row.md) — reworded index.md's Stepper (the canonical) context from "multi-step form / wizard control" to the numeric +/- quantity control.
- 2026-07-23 — [Close consumer catalog gaps: eyebrow, filter, marquee, masthead, wizard](journal/2026-07-23-close-consumer-catalog-gaps.md) — added five patterns (65 → 70) plus cross-refs so the highest-frequency BA labels stop falling through to "novel".
- 2026-07-23 — [Knowledge graph + context wiki subsystem](journal/2026-07-23-knowledge-graph-wiki-subsystem.md) — ported the deterministic graph + Sigma.js viewer and the context wiki (executed plans / PRs / issues; no Slack) from ai-orchestration.

## Plans

- [Plan audit table](plans/INDEX.md) — every plan executed for this repo, with implementation status and evidence.

## Connections

- [Catalog + wiki wiring](connections.md) — a small index that routes to the generated map of how the catalog and wiki wire together: [catalog membership](connections/catalog.md), [pattern cross-references](connections/see-also.md), [skill references](connections/references.md), [wiki wiring](connections/wiki-wiring.md). Rendered from the knowledge graph; **do not hand-edit** — rebuilt by `pnpm graph:build` and verified by `pnpm evals:graph`.
