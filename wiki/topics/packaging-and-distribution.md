---
aliases: [npm package, vendoring, skills CLI, distribution, consumer sync, extraction, deterministic projection, offline sync, exact package pin]
covers: [skills/ui-design-brain/SKILL.md]
---
# Packaging & distribution — Design History

How `ui-design-brain` became a standalone catalog and how consumers receive an exact generated projection.

## Current state

- The source is public at `JFusco/ui-design-brain`. The owner completed the
  transfer; repository ID, original branches/tags, releases, and issue/PR
  identities were verified. Historical GitHub URLs redirect to the new owner.
- `ui-design-brain@1.18.4` is publicly published under npm account `jfusco` with
  GitHub provenance. A clean exact-version install, projection, no-op repeat
  sync, check, and all four public schema URLs were verified. Existing scoped
  versions remain available; no old-package deprecation is claimed.
- The local checkout moved intact to `/Users/joe.fusco/Projects/ui-design-brain`.
  Existing Git history, releases, wiki records, and historical citations remain.
- Catalog authority is `1.18.0` with 82 canonical patterns. The migration preserves
  the canonical manifest and its digest; source provenance is regenerated for
  neutral skill wording and schema URLs pinned to the existing `1.18.3` release.
- Consumers pin an exact package and config. The command remains
  `ui-design-brain`; new-package migration uses a fresh target because the
  projector refuses old-package ownership, edited files, and version drift.
- Release requires the public personal repository, `NPM_RELEASE_ENABLED=true`,
  successful main-push Quality, and packed-consumer verification. npm trusts
  `JFusco/ui-design-brain` and `release.yml`; the bootstrap GitHub secret is
  removed and the workflow uses OIDC without an npm token. The closeout release
  verified this token-free path with release `1.18.4` in issue #83.
- Local origin points at `git@github.com:JFusco/ui-design-brain.git`. Release,
  Quality, and wiki-integrity checks are active. Both wiki writers are active
  with personal BOT_TOKEN ownership, branch pushes, and PR creation verified in
  [JFusco/ui-design-brain issue #84](https://github.com/JFusco/ui-design-brain/issues/84).
  Optional wiki AI is disabled. See [Contributing](../../CONTRIBUTING.md).

## Decisions

- 2026-11-05 — Adopted the shared Renovate `maintenance` preset for devDependencies and GitHub Actions on Mondays, with a Pin Courier App-identity commitlint exemption and `[skip release]` maintenance merges, because nothing else updated this repository's own dependencies ([issue #95](https://github.com/JFusco/ui-design-brain/issues/95), [journal](../journal/2026-11-05-adopt-renovate-maintenance.md)).
- 2026-11-03 — Notify the central Pin Courier runner after each publication instead of waiting for its six-hour schedule; wait for the npm registry first because Renovate reads the registry document ([JFusco/ui-design-brain issue #89](https://github.com/JFusco/ui-design-brain/issues/89), [journal](../journal/2026-11-03-notify-renovate-runner.md)).
- 2026-11-04 — Wait for the version's tarball as well as the packument, because consumers install the tarball and it can lag ([JFusco/ui-design-brain issue #92](https://github.com/JFusco/ui-design-brain/issues/92), [journal](../journal/2026-11-04-wait-for-release-tarball.md)).

- 2026-11-03 — Complete personal automation after the OIDC-only `1.18.4` release: audit BOT_TOKEN as JFusco, verify a generated reconciliation PR and successful issue refresh, and restore both wiki writers while retaining disabled AI ([JFusco/ui-design-brain issue #84](https://github.com/JFusco/ui-design-brain/issues/84), [journal](../journal/2026-11-03-restore-personal-wiki-writers.md)).

- 2026-11-03 — Establish the unscoped npm package with a temporary personal credential, verify the registry artifact independently of workflow status, then configure OIDC through passkey approval and remove the bootstrap secret and workflow reference. Keep wiki-bot restoration in its own issue while the closeout release proves OIDC ([JFusco/ui-design-brain issue #83](https://github.com/JFusco/ui-design-brain/issues/83), [JFusco/ui-design-brain issue #84](https://github.com/JFusco/ui-design-brain/issues/84), [release v1.18.3](https://github.com/JFusco/ui-design-brain/releases/tag/v1.18.3), [journal](../journal/2026-11-03-first-personal-npm-release.md)).

- 2026-11-03 — Verify the completed public transfer and preserve old citations through GitHub redirects. Update local origin and close ownership/source preparation through PR #82; track first unscoped publication, OIDC, and personal bot credentials in issue #83 so ownership completion does not imply a published npm replacement ([JFusco/ui-design-brain PR #82](https://github.com/JFusco/ui-design-brain/pull/82), [JFusco/ui-design-brain issue #83](https://github.com/JFusco/ui-design-brain/issues/83), [journal](../journal/2026-11-03-verify-personal-transfer.md)).

- 2026-11-02 — Preserve the repository through an ownership transfer rather than a fresh copy because the wiki depends on historical GitHub records. Keep old citations, continue release numbering, and gate unscoped publication on the new public owner and explicit activation. The transfer is blocked by organization policy; local preparation does not establish public delivery ([verndale/ui-design-brain issue #81](https://github.com/verndale/ui-design-brain/issues/81), [journal](../journal/2026-11-02-personal-ownership-migration.md), [plan](../plans/2026-11-02-transfer-ui-design-brain-with-its-history-intact.md)).

- 2026-09-29 — Each main-push Quality run has a unique concurrency identity, while superseded pull-request runs still cancel. Push Quality checks every unreleased change since the latest reachable release tag; a current-main success can therefore trigger Release only after all unreleased substantive changes pass the full gate ([issue #78](https://github.com/verndale/ui-design-brain/issues/78), [journal](../journal/2026-09-29-gate-verified-release.md), [prior journal](../journal/2026-09-29-preserve-release-handoff.md)).
- 2026-09-28 — Repository delivery uses labeled issues, updated-main branches, standalone Commitlint, deterministic PR bodies, and open PR review; release follows successful Quality at the tested revision ([issue #67](https://github.com/verndale/ui-design-brain/issues/67), [plan](../plans/2026-09-29-standardize-git-delivery-in-ui-design-brain--02e08425b49a.md), [journal](../journal/2026-09-28-git-delivery-standard.md)).

- 2026-09-07 — Disabled Husky only for the already-gated semantic-release process and removed a projection-test assumption that package and catalog-authority versions must differ. The `1.17.0` release proved those values may legitimately match, and release-generated pushes must not recursively test a transient version-bumped worktree ([issue #62](https://github.com/verndale/ui-design-brain/issues/62), [journal](../journal/2026-09-07-fix-release-push-hooks.md)).
- 2026-09-07 — Changed the pre-release artifact inspection from `npm publish --dry-run` to `npm pack --dry-run`. The former consults the registry and rejects the repository's last published version before semantic-release calculates the next one; the latter inspects the same package file set without creating that false gate ([issue #60](https://github.com/verndale/ui-design-brain/issues/60), [journal](../journal/2026-09-07-fix-release-artifact-inspection.md)).
- 2026-08-31 — Keep the source repository private and distribute only the
  audited public npm tarball. This preserves a credential-free, exact-version
  consumer install without publishing the wiki, Git history, operational
  documentation, private consumer topology, or secret names. The public README
  is part of the tarball audit; trusted publishing still requires the
  `repository.url` to match the private GitHub source ([npm trusted publishing
  documentation](https://docs.npmjs.com/trusted-publishers/),
  [delivery issue #51](https://github.com/verndale/ui-design-brain/issues/51)).
- 2026-08-31 — Standardized the release workflow and semantic-release policy
  with `accessibility-standards`, including deterministic release notes and a
  clean tarball consumer gate. Removed the optional AI release-notes path so
  release output and publication behavior have one reviewable authority. The
  private-source/public-package provenance restriction remains an explicit,
  documented exception ([delivery issue #51](https://github.com/verndale/ui-design-brain/issues/51)).
- 2026-08-30 — Replaced recurring raw-folder/Skills CLI synchronization with exact package pins and deterministic marker-owned projections because COS Functional Specs and ai-orchestration Build Packs must resolve the same canonical pattern IDs without cron timing or copy drift. Kept public registry publication out of scope, added a narrowly verified adoption path for existing copies, and kept accessibility mappings in `accessibility-standards` ([verndale/ui-design-brain issue #47](https://github.com/verndale/ui-design-brain/issues/47), [plan](../plans/2026-08-30-deterministic-ui-design-brain-projections.md), [journal](../journal/2026-08-30-deterministic-ui-design-brain-projections.md)).
- 2026-06-12 — De-duplicated the vendored copy through the `skills` CLI (vercel-labs/skills) instead of a submodule ([plan](../plans/2026-06-12-dedupe-ui-design-brain-via-skills-cli-plan.md)).
- 2026-06-11 — Finalized a vendor-only distribution: npm package plus a consumer sync path ([plan](../plans/2026-06-11-finalize-ui-design-brain-npm-package-vendoring.md)).
- 2026-06-11 — Extracted the catalog out of ai-orchestration into its own published repo ([plan](../plans/2026-06-11-extract-ui-design-brain-into-published-npm-package-plan.md)).
