---
date: 2026-09-29
topics: [packaging-and-distribution]
plan: none
pr: https://github.com/verndale/ui-design-brain/pull/76
issue: https://github.com/verndale/ui-design-brain/issues/75
issues: ["https://github.com/verndale/ui-design-brain/issues/75"]
---
# Preserve tested main release handoff

## Why

A wiki-only main push could cancel the full Quality run for an earlier substantive merge. Release requires a successful Quality result on the current main commit.

## What changed

Quality stopped canceling an in-progress main push run while continuing to cancel superseded pull-request runs. [Issue #78](https://github.com/verndale/ui-design-brain/issues/78) addresses pending-run replacement and verification of unreleased history.

## Files

- `.github/workflows/quality.yml`, `scripts/tests/wiki-standard.test.cjs`
- `wiki/INDEX.md`, `wiki/topics/packaging-and-distribution.md`, this journal
