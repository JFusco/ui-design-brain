---
date: 2026-11-02
topics: [packaging-and-distribution]
plan: plans/2026-11-02-transfer-ui-design-brain-with-its-history-intact.md
pr: pending
issue: https://github.com/verndale/ui-design-brain/issues/81
---
# Prepare personal ownership and public distribution

## Why

- The owner wants the project and npm package under personal ownership while retaining the wiki and the commits, tags, releases, issues, and PRs it cites.
- A fresh copy would separate that evidence from the catalog. A transfer preserves the repository and its old-link redirects.

## What changed

- Backed up and verified Git history and recorded GitHub inventory before attempting the transfer. The inventory included 11 branches, 28 tags/releases, and 56 PRs.
- GitHub rejected the transfer with HTTP 422, `Organization members cannot transfer repositories`. The repository remains private under Verndale. Release and wiki workflows were restored after the failed attempt.
- Moved the complete checkout to `/Users/joe.fusco/Projects/ui-design-brain`; retained the current origin until transfer succeeds.
- Prepared the unscoped package identity, personal repository/schema URLs, provenance, consumer migration instructions, and release activation guard. Catalog entries, authority, and historical wiki citations are preserved.
- Added regression coverage for refusing old-package projections and release without the intended public owner and activation. The maintenance PR remains open for review.

## Files

- package.json, lib/catalog.mjs, lib/projection.mjs, schemas/
- .github/workflows/release.yml, scripts/tests/, scripts/verify-packed-consumer.mjs
- README.md, CONTRIBUTING.md, AGENTS.md, skills/ui-design-brain/SKILL.md
- wiki/topics/packaging-and-distribution.md

## Follow-ups

- Organization owner transfer, historical-content review completion, public visibility, record/redirect verification, and personal bot credentials.
- Reviewed merge, personal npm authentication, automated first publication, trusted publishing, and registry/consumer verification.
- Deprecation of the old npm package and changes to consumers remain separate work.
