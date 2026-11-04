---
date: 2026-11-03
topics: [packaging-and-distribution]
plan: plans/2026-11-02-transfer-ui-design-brain-with-its-history-intact.md
pr: https://github.com/JFusco/ui-design-brain/pull/82
issue: https://github.com/JFusco/ui-design-brain/issues/81
---
# Verify the personal repository transfer

## Why

- The owner completed the transfer and made the repository public. Current guidance must reflect that result while retaining the earlier failed-attempt history.
- GitHub ownership and npm publication have different completion receipts; closing source preparation must not claim the unscoped package has shipped.

## What changed

- Verified repository ID 1266780133 under JFusco, anonymous public access, and preservation of all 11 original branches, 28 tags/releases, 80 recorded issue/PR records, and 56 PR identities.
- Checked old GitHub issue, release, and commit URLs anonymously; they resolve to the new owner. Historical wiki citations are retained.
- Updated local origin to `git@github.com:JFusco/ui-design-brain.git`; the complete checkout remains at `/Users/joe.fusco/Projects/ui-design-brain`.
- Updated current contributor guidance and wiki status. The full plan remains partial while first npm publication is pending in issue #83.
- Paused Release and both wiki writers during credential verification. Read-only quality and wiki-integrity workflows remain active; optional wiki AI is disabled.

## Files

- CONTRIBUTING.md, README.md
- wiki/topics/packaging-and-distribution.md
- wiki/plans/2026-11-02-transfer-ui-design-brain-with-its-history-intact.md

## Follow-ups

- [JFusco/ui-design-brain issue #83](https://github.com/JFusco/ui-design-brain/issues/83): personal npm authentication, first unscoped release, OIDC/provenance verification, and personal bot setup.
- Consumer updates and old-package deprecation remain separate follow-ups after replacement verification.
