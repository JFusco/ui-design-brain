---
date: 2026-07-23
topics: [graph-wiki-subsystem]
plan: plans/2026-07-23-port-knowledge-graph-wiki-subsystem.md
pr: pending
issue: https://github.com/verndale/ui-design-brain/issues/8
---
# Knowledge graph + context wiki subsystem

## Why

- The catalog had no record of *why* it is the way it is — executed plans, decisions, and PR/issue history lived only in scattered Claude/Codex plan stores and Git.
- `@verndale/ai-orchestration` already solved this with a deterministic knowledge graph + context wiki; porting it gives this repo the same navigable history and an interactive map over the 65-pattern catalog.

## What changed

- Added a deterministic knowledge graph (`scripts/graph/build-graph.cjs`) over the manifest, patterns, root docs, and wiki, rendered by a vendored Sigma.js viewer (`pnpm graph:view`) with routing.
- The pattern catalog has no markdown links, so the graph reads the inline-code `see-also` convention and joins pattern names/aliases from `patterns-manifest.json`; the `manifest → each pattern` `catalogs` edge doubles as the catalog integrity gate.
- Added the context wiki (journal / topics / plans) with collectors for executed plans (Codex + Claude), PRs (on merge), and issues (nightly), a freshness gate (`pnpm evals:graph`), a pre-commit rebuild, and bot workflows. Slack ingestion was deliberately excluded.
- Backfilled the four executed historical plans (npm extraction, vendoring, dedupe, AGENTS.md alignment) into the plan audit.

## Files

- `scripts/graph/` (builder, viewer, routing, serve, README), `scripts/evals/graph-check.cjs`, `scripts/wiki/` (collectors + libs), `.github/workflows/{wiki-sync,wiki-issue-sync,graph}.yml`, `.husky/pre-commit`, `package.json` scripts, `AGENTS.md` + `README.md`, and the seed `wiki/`.
