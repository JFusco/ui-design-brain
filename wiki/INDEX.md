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
- [Knowledge graph & context wiki](topics/graph-wiki-subsystem.md) — the deterministic graph + Sigma.js viewer and the context wiki, ported from ai-orchestration.
- [Packaging & distribution](topics/packaging-and-distribution.md) — how the catalog became a standalone published package that consumers vendor.

## Journal

<!-- Reverse-chronological, one line per entry: YYYY-MM-DD — [Title](journal/<file>.md) — hook. -->

- 2026-07-23 — [Knowledge graph + context wiki subsystem](journal/2026-07-23-knowledge-graph-wiki-subsystem.md) — ported the deterministic graph + Sigma.js viewer and the context wiki (executed plans / PRs / issues; no Slack) from ai-orchestration.

## Plans

- [Plan audit table](plans/INDEX.md) — every plan executed for this repo, with implementation status and evidence.

## Connections

- [Catalog + wiki wiring](connections.md) — a small index that routes to the generated map of how the catalog and wiki wire together: [catalog membership](connections/catalog.md), [pattern cross-references](connections/see-also.md), [skill references](connections/references.md), [wiki wiring](connections/wiki-wiring.md). Rendered from the knowledge graph; **do not hand-edit** — rebuilt by `pnpm graph:build` and verified by `pnpm evals:graph`.
