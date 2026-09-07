---
title: Fix release push hooks
date: 2026-09-07
status: implemented
tags:
  - release
  - packaging
  - ci
githubRefs:
  - verndale/ui-design-brain#62
---

# Fix release push hooks

## Context

The `1.17.0` release passed source verification and artifact inspection, then failed when `@semantic-release/git` pushed its generated release commit and tag. Husky recursively ran the development pre-push suite after `package.json` had been rewritten to `1.17.0`. A projection test incorrectly assumed the package version must differ from the catalog-authority version, even though both values can legitimately be `1.17.0`.

## Decision

Keep the independent provenance assertions and remove the invalid inequality assumption. Set `HUSKY=0` only on the semantic-release process, after the workflow's source, projection, packed-consumer, and tarball checks have passed. This keeps contributor pushes guarded while preventing release-generated pushes from testing a transient, intentionally mutated worktree.

## Verification

- The projection contract passes when package and catalog-authority versions match.
- The release workflow regression test requires the scoped `HUSKY=0` setting on the semantic-release step.
- The full CI verification suite remains the gate before publishing.
