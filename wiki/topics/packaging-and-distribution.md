---
aliases: [npm package, vendoring, skills CLI, distribution, consumer sync, extraction]
covers: [skills/ui-design-brain/SKILL.md]
---
# Packaging & distribution — Design History

How `ui-design-brain` became a standalone published catalog and how consumers vendor it.

## Current state

- The catalog ships as `@verndale/ui-design-brain` — a single agent skill under `skills/ui-design-brain/`.
- Consumers vendor the skill with the `skills` CLI (`npx skills add … --copy --skill ui-design-brain`) rather than a git submodule; the upstream catalog is the source of truth and consumers re-sync.
- `semantic-release` publishes; there is no build step for the catalog content itself.

## Decisions

- 2026-06-12 — De-duplicated the vendored copy through the `skills` CLI (vercel-labs/skills) instead of a submodule ([plan](../plans/2026-06-12-dedupe-ui-design-brain-via-skills-cli-plan.md)).
- 2026-06-11 — Finalized a vendor-only distribution: npm package plus a consumer sync path ([plan](../plans/2026-06-11-finalize-ui-design-brain-npm-package-vendoring.md)).
- 2026-06-11 — Extracted the catalog out of ai-orchestration into its own published repo ([plan](../plans/2026-06-11-extract-ui-design-brain-into-published-npm-package-plan.md)).
