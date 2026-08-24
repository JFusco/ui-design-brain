---
date: 2026-08-23
topics: [graph-wiki-subsystem]
plan: plans/2026-08-23-standardize-wiki-actions-and-evidence-routing.md
pr: https://github.com/verndale/ui-design-brain/pull/44
issue: https://github.com/verndale/ui-design-brain/issues/43
issues: [https://github.com/verndale/ui-design-brain/issues/43]
---
# Standardize wiki actions and evidence routing

## Why

- The wiki automation, local hooks, workflow identities, and runtime setup had drifted from ai-orchestration, so the same history workflow behaved differently across repos.
- PR and issue citations existed only as Markdown/legacy fields, which made repository-qualified evidence hard to search, route, or open safely from the offline graph.
- Agent guidance needed an explicit low-token split between direct index lookup and cross-page graph navigation.

## What changed

The curated graph now derives canonical repository-qualified GitHub references on the Markdown nodes that cite them, without creating GitHub nodes or storing PR snapshots. Routing accepts full URLs and repository-qualified forms, prefers journal evidence, reports byte cost, and declines bare or ambiguous numbers. The viewer searches and opens those references through safe DOM links. Merge/issue automation now shares a versioned reconciliation shape, retains all closing issues, supports fully paginated manual replay, caches duplicate issue lookups, and closes an Open threads line only after every citation is confirmed closed. Writer workflows open guarded bot branches rather than writing to main. Five workflow identities, Node/Corepack setup, least-privilege permissions, concurrency, Commitlint ownership, and fail-open graph hooks now match the shared standard while preserving the Brain catalog graph, viewer palette, and port.

Post-rollout review added bounded Oxford-comma and `&` closing-clause parsing, length-aware nested fences, symlink-safe issue refresh, strict merged-PR URL/path/commit validation, canonical legacy evidence derivation, query/fragment normalization in CLI and browser search, byte-weighted browser routes with authority and totals, fail-closed browser policy validation, and deterministic writer-PR reopening.

## Files

- `.github/workflows/`, `.husky/`, `package.json`, `pnpm-workspace.yaml`
- `scripts/wiki/`, `scripts/graph/`, `scripts/tests/wiki-standard.test.cjs`
- `AGENTS.md`, `wiki/INDEX.md`, `wiki/MECHANICS.md`
- `wiki/topics/graph-wiki-subsystem.md`, `wiki/plans/`
