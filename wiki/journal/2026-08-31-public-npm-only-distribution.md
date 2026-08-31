---
date: 2026-08-31
topics: [packaging-and-distribution]
plan: plans/2026-08-30-deterministic-ui-design-brain-projections.md
pr: https://github.com/verndale/ui-design-brain/pull/52
issue: https://github.com/verndale/ui-design-brain/issues/51
issues: [https://github.com/verndale/ui-design-brain/issues/51]
---
# Prepare public npm-only distribution

## Why

- Azure consumer builds need a credential-free install of one immutable UI
  Design Brain projector version.
- The completed projector contract is tracked separately in
  https://github.com/verndale/ui-design-brain/issues/47; this record covers
  the constrained npm distribution tracked by
  https://github.com/verndale/ui-design-brain/issues/51.
- Making the source repository public would disclose its Git history and
  operational wiki; its existing packaged README also disclosed private
  consumer topology and release-secret names despite `wiki/` being excluded.

## What changed

- Kept the source repository private and constrained public distribution to the
  existing package allowlist: projector CLI, libraries, schemas, catalog skill,
  license, and a replacement public README.
- Enabled public scoped-package publication and npm trusted publishing through
  the existing GitHub Actions release workflow's OIDC identity. No npm publish
  token is added to repository secrets or consumer CI.
- Retained exact-version, lockfile, digest, and marker-owned projection
  contracts. Public npm availability changes artifact transport only; it does
  not permit automatic upgrades or mutable-source consumption.

## Files

- `package.json`, `.releaserc.cjs`, `.github/workflows/release.yml`, `README.md`
- `wiki/topics/packaging-and-distribution.md`
- `wiki/plans/2026-08-30-deterministic-ui-design-brain-projections.md`

## Follow-ups

- The public `1.16.1-bootstrap.0` package was published under the non-default
  `bootstrap` tag and npm now trusts `verndale/ui-design-brain` `release.yml`
  for `npm publish`.
- Publish the next stable release through OIDC, verify its public tarball, then
  update COS and ai-orchestration to the exact registry version in separate
  consumer changes.
