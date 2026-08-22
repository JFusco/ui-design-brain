---
status: implemented
executed: 2026-08-22
date: 2026-08-22
evidence:
  - "working tree implementation for issue #40"
source_tool: file
source: "/private/tmp/brain-issue-40-quality-graph-plan.md"
topics: [graph-wiki-subsystem]
---
# Standardize Brain quality and graph lifecycle

## Goal

Give ui-design-brain the shared enforcement contract for ESLint, Conventional Commits, local Git hooks, pull-request quality, and a reliable curated knowledge-graph lifecycle.

## Decisions

- ESLint is the only JavaScript linter. It covers first-party JavaScript and excludes generated graph data and vendored viewer assets.
- Pre-commit fixes staged JavaScript and blocks on remaining lint failures; the wiki reminder and graph rebuild/write path remain advisory.
- Pre-push keeps the existing 17-case graph contract as the fast executable gate. Full CI adds lifecycle regression tests without inventing a source-unit or typecheck gate.
- Commitlint uses the public shared preset through a root config. The direct Commitlint CLI is authoritative locally and in the separate PR-title/range workflow.
- The curated graph remains lifecycle-driven, rejects unstaged inputs, validates required manifest input before writes, exposes unresolved declarations, and is never rewritten by CI or pre-push.
- The viewer preserves the Brain schema, palette, and port while binding only to loopback and handling unsafe paths, delayed layout, and initialization errors.

## Implementation

1. Add the lint dependencies, flat configuration, shared scripts, staged-file configuration, and lockfile updates.
2. Order the hooks as blocking staged lint, advisory wiki reminder, then fail-open graph lifecycle; add the blocking fast pre-push gate.
3. Replace the prior graph workflow with `Quality / quality` and keep `Commit message lint / commitlint` separate and immutable to the PR head event.
4. Port the repository-root, dangling-edge, manifest, frontmatter, substantive-change, discovery, server, and viewer reliability behavior with executable lifecycle regression coverage.
5. Align contributor and graph/wiki documentation, rebuild the curated graph, and validate lint, fast/full verification, Commitlint boundaries, hooks, nonmutation, and absence requirements.
