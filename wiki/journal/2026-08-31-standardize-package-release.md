---
date: 2026-08-31
topics: [packaging-and-distribution]
plan: plans/2026-08-30-deterministic-ui-design-brain-projections.md
pr: pending
issue: https://github.com/verndale/ui-design-brain/issues/51
issues: [https://github.com/verndale/ui-design-brain/issues/51]
---
# Standardize package release workflow

## Why

- UI Design Brain needs the same deterministic release gates as Accessibility
  Standards before consumers can replace private Git dependencies with an exact
  public npm version.
- The old optional AI release-notes plugin created a separate, unnecessary
  release path and required configuration that public package delivery does not
  need.
- The source repository remains private, so the process must document the one
  npm limitation: automatic provenance is unavailable for this publication
  topology.

## What changed

- Matched the release workflow's checkout, Node, Corepack, install, validation,
  tarball, dry-run, and semantic-release sequence to Accessibility Standards.
- Added a deterministic breaking-change preflight and clean packed-consumer
  fixture for the published projector.
- Replaced custom/optional AI release notes with the standard semantic-release
  notes generator and removed the unused custom plugin.
- Recorded private-source/public-package provenance as a deliberate exception,
  not a gap in consumer version or digest enforcement.

## Files

- `.github/workflows/release.yml`, `.releaserc.cjs`, `package.json`
- `scripts/check-release-commit.cjs`, `scripts/verify-packed-consumer.mjs`
- `CONTRIBUTING.md`, `wiki/topics/packaging-and-distribution.md`

## Follow-ups

- Merge this release-parity change and publish the next stable version through
  the configured `release.yml` trusted publisher.
- Upgrade COS and ai-orchestration only to that verified, exact registry
  version in their separate reviewed changes.
