---
date: 2026-09-28
topics: [graph-wiki-subsystem, packaging-and-distribution]
plan: plans/2026-09-29-standardize-git-delivery-in-ui-design-brain--02e08425b49a.md
pr: https://github.com/verndale/ui-design-brain/pull/68
issue: https://github.com/verndale/ui-design-brain/issues/67
issues: ["https://github.com/verndale/ui-design-brain/issues/67"]
---
# Issue-linked Git delivery and release after Quality

## Why
- The AI commit/PR helpers and branch-push PR Action added an automatic writer outside the issue-to-PR review flow.
- Release repeated the full quality suite after main already had a tested revision.

## What changed
- Contributors create labeled issues, branch from updated main, use standalone Commitlint and deterministic PR bodies, and leave PRs open for review.
- Wiki bot writers continue their direct GitHub CLI PR handling with `BOT_TOKEN`.
- Quality runs on main pushes; Release starts only after successful Quality at the tested revision, skips wiki-only revisions, and retains package preflight and tarball checks.
- Actions use the declared pnpm 11.1.1 runtime.
- Wiki issue-state reconciliation now runs Mondays at 11:30 UTC, matching agent-review-workflows.

## Files
- `AGENTS.md`, `CONTRIBUTING.md`, `.github/workflows/`, `package.json`, `commitlint.config.cjs`, `scripts/tests/wiki-standard.test.cjs`
