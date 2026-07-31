---
aliases: [knowledge graph, context wiki, pattern graph, sigma.js viewer, plan capture]
---
# Knowledge graph & context wiki — Design History

The deterministic knowledge graph + Sigma.js viewer and the context wiki (journal / topics / plans), ported from ai-orchestration.

## Current state

- `pnpm graph:build` derives `scripts/graph/data/graph.json` from the catalog + root docs + wiki; `pnpm graph:view` renders it with a vendored Sigma.js stack; `pnpm evals:graph` byte-compares a fresh rebuild and gates freshness.
- Node types: `root-doc`, `skill`, `skill-index`, `manifest`, `ui-pattern`, `wiki-*`. Edges: `catalogs`, `see-also`, `references`, `links-to`, `topic`, `plan`, `covers`. The `catalogs` edge (manifest → each pattern) doubles as the catalog integrity gate.
- The context wiki captures executed plans (Codex + Claude), GitHub PRs, and GitHub issues. Slack ingestion is deliberately excluded.

## Decisions

- 2026-07-31 — feat(ui-design-brain): Update UI design patterns with new aliases ([PR #18](https://github.com/verndale/ui-design-brain/pull/18))
- 2026-07-23 — fix(ui-design-brain): Update Stepper canonical description in index.md ([PR #15](https://github.com/verndale/ui-design-brain/pull/15))
- 2026-07-23 — feat(ui-design-brain): Add new UI patterns and update documentation ([PR #12](https://github.com/verndale/ui-design-brain/pull/12))
- 2026-07-23 — feat(ci): Add workflows for knowledge graph and wiki sync ([PR #9](https://github.com/verndale/ui-design-brain/pull/9))
- 2026-07-23 — Ported the knowledge-graph + wiki subsystem from ai-orchestration — full faithful port (routing + auto-generated connections in, pre-commit rebuild, dormant opt-in AI); Slack excluded ([plan](../plans/2026-07-23-port-knowledge-graph-wiki-subsystem.md), [journal](../journal/2026-07-23-knowledge-graph-wiki-subsystem.md), [issue #8](https://github.com/verndale/ui-design-brain/issues/8)).
