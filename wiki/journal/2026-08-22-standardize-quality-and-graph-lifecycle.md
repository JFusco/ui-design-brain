---
date: 2026-08-22
topics: [graph-wiki-subsystem]
plan: plans/2026-08-22-standardize-brain-quality-and-graph-lifecycle.md
pr: pending
issue: https://github.com/verndale/ui-design-brain/issues/40
---
# Standardize quality and graph lifecycle

## Why

- Local commits, pushes, and pull requests did not expose one consistent lint/test contract.
- Commitlint used the same policy through different engines and a private package path, leaving room for local/CI drift.
- The curated graph silently dropped some unresolved declarations, tolerated an unusable required manifest, and could rebuild from unstaged input.

## What changed

ESLint now owns first-party JavaScript linting: staged files are fixed before commit, the existing graph contract blocks pushes, and one non-mutating quality job adds lifecycle regression coverage in CI. The pre-push hook clears Git's repository-local environment before verification so temporary fixture repositories remain isolated from the contributor checkout. The viewer is linted as browser-only code instead of inheriting Node globals from repository scripts. Commitlint consumes the public shared preset through one root config and remains a separate title/range governance job. The graph lifecycle now validates its manifest before writes, preserves unresolved topic/plan/coverage evidence for the shared dangling gate, rejects malformed plan paths instead of dropping them, normalizes valid plan paths and sentinels, skips unstaged input, and keeps advisory writes fail-open. Viewer hardening preserves the Brain schema, palette, and port. Synthetic source-unit and typecheck gates were ruled out because no corresponding first-party implementation exists.

## Files

- `package.json`, `eslint.config.mjs`, `commitlint.config.cjs`
- `.husky/`, `.github/workflows/`
- `scripts/evals/`, `scripts/graph/`, `scripts/tests/`, `scripts/wiki/`
- `README.md`, `CONTRIBUTING.md`, `AGENTS.md`, `wiki/MECHANICS.md`

## Follow-ups

- Add broader source-unit coverage only when the repository gains executable catalog tooling that warrants it.
