---
date: 2026-11-03
topics: [graph-wiki-subsystem, packaging-and-distribution]
plan: plans/2026-11-02-transfer-ui-design-brain-with-its-history-intact.md
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
- [Credential audit run 41748857832](https://github.com/JFusco/ui-design-brain/actions/runs/41748857832) verified account JFusco and push access. No credential replacement or secret disclosure was needed.
- Restored both writers. [Merge reconciliation run 41748904153](https://github.com/JFusco/ui-design-brain/actions/runs/41748904153) processed the known merged PR #85 and created [JFusco/ui-design-brain PR #86](https://github.com/JFusco/ui-design-brain/pull/86). Its journal and plan-reference changes were reviewed, passed all three checks, and merged.
- [Issue refresh run 41748907159](https://github.com/JFusco/ui-design-brain/actions/runs/41748907159) succeeded with no changes and correctly created no PR.
- Release `1.18.4` had already proved OIDC-only npm publication. Marked the original migration plan implemented after personal wiki automation passed live verification.
- Optional wiki AI remains false, and unrelated Renovate secrets and configuration were preserved.

## Files

- .github/workflows/wiki-check.yml
- scripts/tests/wiki-standard.test.cjs
- wiki/topics/graph-wiki-subsystem.md

## Verification

- Local `pnpm verify:ci`: 43 tests, 17 graph checks, lint, and release preflight passed.
- Live credential audit, merge reconciliation, and issue refresh all succeeded; generated changes used a reviewed bot PR.
