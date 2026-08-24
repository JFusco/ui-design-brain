---
status: implemented
executed: 2026-08-23
date: 2026-08-23
evidence:
  - "issue #43 https://github.com/verndale/ui-design-brain/issues/43"
  - "working tree implementation; PR pending"
source_tool: file
source: "https://github.com/verndale/ui-design-brain/issues/43"
topics: [graph-wiki-subsystem]
---
# Standardize wiki actions and evidence routing

## Goal

Bring ui-design-brain's curated knowledge graph and context wiki onto the ai-orchestration operating contract without changing the catalog graph's domain model, palette, or viewer port.

## Decisions

- Keep GitHub evidence offline and additive: derive canonical repository-qualified `githubRefs` on existing Markdown nodes while retaining legacy `pr`, `issues`, and other graph fields.
- Do not create GitHub graph nodes, durable PR snapshots, or a live viewer API. Merged PR title, body, changed files, and commits are reconciliation input for Markdown only.
- Require a full GitHub URL or repository-qualified query for evidence routing. Prefer journal authority, return a byte-costed itinerary, and surface ambiguity instead of guessing.
- Standardize the five wiki/quality workflow identities, Node/Corepack setup, permissions, concurrency, bot branches, manual merged-PR replay, pagination, issue lookup caching, and contamination-safe local hooks.
- Keep `@verndale/ai-commit@2.7.0` as the sole direct Commitlint provider, with the narrow pnpm public-hoist bridge needed for the CI CLI.
- Route direct single-topic history through `wiki/INDEX.md`; invoke the navigator only for cross-page why, wiring, or impact questions, then read only its itinerary.

## Implementation

1. Add canonical GitHub citation extraction to graph nodes, evidence-aware routing, safe viewer links/search, and regression coverage for hostile hosts, ambiguity, precedence, and pagination.
2. Normalize merged-PR reconciliation and issue refresh inputs, retain every closing issue, and cache duplicate repository-and-number API lookups.
3. Align hooks, scripts, dependencies, and the five workflow contracts while preserving the repository-specific PR helper and curated graph lifecycle.
4. Update agent guidance and wiki mechanics, capture this decision in the journal/topic/index, rebuild generated graph outputs, and run the full repository verification gate.
