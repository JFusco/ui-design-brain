---
date: 2026-09-29
topics: [graph-wiki-subsystem, packaging-and-distribution]
plan: none
pr: pending
issue: https://github.com/verndale/ui-design-brain/issues/72
---
# Visible PR descriptions and wiki-only quality

## Why

- The six-section PR gate could count headings hidden in HTML comments or Markdown fences as valid descriptions.
- Wiki bot PRs and wiki-only main pushes ran the complete catalog quality suite even though Wiki integrity has a separate check.

## What changed

- The PR-body validator follows the independently reviewed visible-heading contract and has focused tests against Brain's canonical template.
- Quality keeps its named result but runs wiki and graph checks for changes limited to `wiki/` and the generated graph JSON. Code and workflow changes, empty diffs, unavailable ranges, and manual runs retain the complete suite.
- The retrospective action-owned publication flow and release workflow are unchanged.

## Files

- `scripts/validate_pr_body.cjs`, `scripts/tests/pr-body.test.cjs`
- `.github/workflows/quality.yml`
- `wiki/INDEX.md`, this journal

## Follow-ups

- Verify the lightweight path on the next wiki bot PR and its main push.
