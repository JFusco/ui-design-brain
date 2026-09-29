---
status: implemented
executed: 2026-09-29
date: 2026-09-29
evidence:
  - "issue #67"
source_tool: codex
source: "/private/tmp/ui-design-brain-git-delivery-plan.md"
topics: [graph-wiki-subsystem, packaging-and-distribution]
---
# Standardize Git delivery in ui-design-brain

Create a labeled GitHub issue and branch from updated main. Remove AI commit and PR packages, scripts, hooks, and generic PR Action. Use standalone Commitlint and deterministic issue-linked PR body validation. Switch wiki bot Actions to BOT_TOKEN and direct GitHub PR handling. Run Quality on main pushes and Release only after successful Quality, preserving package preflight and tarball checks while eliminating duplicate full verification. Update AGENTS, docs, tests, and wiki, then open a PR without merging it.
