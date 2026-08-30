---
aliases: [npm package, vendoring, skills CLI, distribution, consumer sync, extraction, deterministic projection, offline sync, exact package pin]
covers: [skills/ui-design-brain/SKILL.md]
---
# Packaging & distribution — Design History

How `ui-design-brain` became a standalone catalog and how consumers receive an exact generated projection.

## Current state

- The catalog is the private `@verndale/ui-design-brain` package and one agent skill under `skills/ui-design-brain/`; public npm publication remains disabled.
- `catalog-manifest.json` records schema version, the `1.15.1` canonical-vocabulary authority baseline, source and manifest digests, bounded authority, and every projected file digest.
- The projector first becomes available in `1.16.0`; the implementation branch uses `1.16.0-next.0` so local artifacts are explicitly prerelease rather than falsely attributed to `v1.15.1`.
- Consumers pin one immutable package artifact and declare package version, catalog-authority version, profile, and target in `ui-design-brain.config.json`.
- `sync --if-needed` writes only a marker-owned target, validates a complete temporary projection, and promotes it atomically. `check` is read-only. Both fail closed on version, digest, file-set, or local-edit drift.
- The one-time `sync --adopt` path accepts a legacy copy only when every Markdown/source file is byte-identical and JSON catalog data is semantically identical; it never adopts divergent guidance.
- Consumer hooks call the installed Node file directly. They do not invoke `npx`, contact a registry, install dependencies, update a lockfile, or select a newer package.
- The source pre-commit hook checks the generated catalog manifest and pre-push runs projection plus packed offline-consumer tests. Existing GitHub release automation remains private with `npmPublish: false`.

## Decisions

- 2026-08-30 — Replaced recurring raw-folder/Skills CLI synchronization with exact package pins and deterministic marker-owned projections because COS Functional Specs and ai-orchestration Build Packs must resolve the same canonical pattern IDs without cron timing or copy drift. Kept public registry publication out of scope, added a narrowly verified adoption path for existing copies, and kept accessibility mappings in `accessibility-standards` ([verndale/ui-design-brain issue #47](https://github.com/verndale/ui-design-brain/issues/47), [plan](../plans/2026-08-30-deterministic-ui-design-brain-projections.md), [journal](../journal/2026-08-30-deterministic-ui-design-brain-projections.md)).
- 2026-06-12 — De-duplicated the vendored copy through the `skills` CLI (vercel-labs/skills) instead of a submodule ([plan](../plans/2026-06-12-dedupe-ui-design-brain-via-skills-cli-plan.md)).
- 2026-06-11 — Finalized a vendor-only distribution: npm package plus a consumer sync path ([plan](../plans/2026-06-11-finalize-ui-design-brain-npm-package-vendoring.md)).
- 2026-06-11 — Extracted the catalog out of ai-orchestration into its own published repo ([plan](../plans/2026-06-11-extract-ui-design-brain-into-published-npm-package-plan.md)).
