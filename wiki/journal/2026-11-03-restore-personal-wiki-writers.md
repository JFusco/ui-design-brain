---
date: 2026-11-03
topics: [graph-wiki-subsystem, packaging-and-distribution]
plan: none
pr: pending
issue: https://github.com/JFusco/ui-design-brain/issues/84
---
# Restore personal wiki writers

## Why

- The transfer preserved an encrypted BOT_TOKEN whose account and access needed verification before the paused wiki writers could operate under personal ownership.
- Wiki changes must continue through reviewed bot branches, with optional AI disabled.

## What changed

- Added an optional manual credential audit to Wiki integrity. It checks that BOT_TOKEN belongs to the repository owner and has push access, performs only API reads, and reports no secret values.
- Normal push and PR integrity checks do not receive the credential. The audit requires an explicit manual input.
- Writer restoration and representative reconciliation receipts will be recorded after live verification.

## Files

- .github/workflows/wiki-check.yml
- scripts/tests/wiki-standard.test.cjs
- wiki/topics/graph-wiki-subsystem.md

## Follow-ups

- Verify the credential, then restore and exercise both existing review-PR writers before closing issue #84.
