---
status: partial
executed: 2026-08-30
date: 2026-08-30
evidence:
  - "https://github.com/verndale/ui-design-brain/issues/47"
  - "working-tree implementation and tests; PR pending"
  - "verndale/ui-design-brain PR #49 https://github.com/verndale/ui-design-brain/pull/49 (merged 2026-08-30)"
  - "verndale/ui-design-brain PR #52 https://github.com/verndale/ui-design-brain/pull/52 (merged 2026-08-31)"
source_tool: codex
source: user-approved Shared Accessibility Standards Delivery Plan extension
topics: [component-catalog, packaging-and-distribution]
audit_note: Repository projector implementation is complete. A public-safe npm tarball and OIDC publishing workflow are prepared; the next stable release and consumer pin upgrades remain pending.
---
# Deterministic UI Design Brain projections for COS and ai-orchestration

## Summary

Replace recurring raw-folder synchronization with an exact-version, fail-closed projection contract shared by COS Conductor and ai-orchestration. Keep UI Design Brain valuable as the canonical UI vocabulary while preventing it from becoming a second accessibility authority.

This is the UI Design Brain extension to the [Shared Accessibility Standards Delivery Plan](https://github.com/verndale/accessibility-standards/blob/main/wiki/plans/2026-08-30-shared-accessibility-standards-delivery.md).

## Delivery records

- Owning issue: [verndale/ui-design-brain issue #47](https://github.com/verndale/ui-design-brain/issues/47), `[Feature] Add deterministic UI Design Brain projections for COS and ai-orchestration`.
- ai-orchestration companion: [verndale/ai-orchestration issue #609](https://github.com/verndale/ai-orchestration/issues/609).
- COS companion: [Azure Boards Feature 17](https://dev.azure.com/verndale/V00066-Cumulative-OperatingSystem/_workitems/edit/17).
- Implementation branch: `codex/gh-47-deterministic-projections`, based on `origin/main`.
- Pull request: pending.

## Authority boundary

UI Design Brain owns:

- Canonical UI names and stable slugs.
- Plain and contextual aliases.
- Contextual disambiguation and novel-pattern fallback.
- Bounded product guidance, common layouts, and distinctions between confusable UI patterns.

UI Design Brain does not own:

- Accessibility semantics, applicability outcomes, or proof routes.
- WCAG/ARIA authority or conformance policy.
- UI-pattern-slug to accessibility-pattern-ID mappings.

The accessibility repository owns those mappings and obligations. Existing accessibility-adjacent Markdown remains informative and non-normative until cross-repository parity proves it can be removed safely. Agents must not derive normative accessibility requirements from that prose.

## Source and package contract

- Keep the GitHub source repository private while publishing only a constrained,
  public npm package. `files` must allow only `bin/`, `lib/`, `schemas/`,
  `skills/ui-design-brain/`, `LICENSE`, and a public-safe `README.md`.
- Use npm trusted publishing from `.github/workflows/release.yml`, with
  `id-token: write` and no long-lived npm publishing token. Before each release,
  `pnpm pack --dry-run` must prove the tarball excludes `wiki/`, Git history,
  workflow configuration, internal consumer topology, and secret names.
- Publish the next patch release from the stable `1.16.0` projector baseline;
  consumers adopt that exact npm version after registry availability is verified.
- Preserve `1.15.1` separately as `catalogAuthorityVersion`, because that published tag is the unchanged canonical names/slugs/aliases baseline and does not contain the projector.
- Generate `skills/ui-design-brain/catalog-manifest.json` with schema version, source and parsed-manifest digests, bounded authority, pattern count, and sorted per-file digests.
- Ship the CLI, libraries, schemas, generated catalog manifest, and skill tree
  in the constrained public npm artifact; keep all source-repository context
  private.
- Add no runtime dependency and perform no network operation.

## Consumer configuration

Each consumer pins one immutable artifact and commits `ui-design-brain.config.json`:

```json
{
  "$schema": "./node_modules/@verndale/ui-design-brain/schemas/consumer-config.schema.json",
  "schemaVersion": 1,
  "packageName": "@verndale/ui-design-brain",
  "packageVersion": "1.16.0",
  "catalogAuthorityVersion": "1.15.1",
  "profile": "agent-skill",
  "target": "frontend-ai/skills/ui-design-brain"
}
```

COS substitutes `plugins/conductor/skills/ui-design-brain` for the target. Package version, catalog authority, profile, and target are part of the configuration digest. Unknown fields, path traversal, pre-projector versions, and installed/configured version mismatches fail.

## Commands and generated output

Provide:

```text
ui-design-brain build
ui-design-brain sync --if-needed --config ui-design-brain.config.json
ui-design-brain check --config ui-design-brain.config.json
```

The projection contains the exact skill files plus:

- `catalog-manifest.json` for source schema and digest provenance.
- `.ui-design-brain-generated` as the target ownership and do-not-edit marker.
- `projection-manifest.json` containing projector package version, catalog authority version, profile, source/manifest/config/output digests, bounded authority, and sorted per-file digests.

`check` is read-only. Sync constructs and validates a complete sibling temporary directory, refuses an edited managed target, and promotes atomically with rollback. `--if-needed` is a byte-stable no-op when all inputs and output bytes match.

## Legacy adoption

Existing COS and ai-orchestration directories predate ownership markers. Support one explicit migration command:

```text
ui-design-brain sync --if-needed --adopt --config ui-design-brain.config.json
```

Adoption is allowed only when:

- The legacy file set exactly matches the package catalog, with only the generated catalog manifest optionally absent.
- Markdown and other source bytes are exact.
- `patterns-manifest.json` and an optional catalog manifest are semantically equal even if whitespace differs.
- No unknown file, missing pattern, changed guidance, symlink, or unsafe path exists.

After verification, normal atomic promotion creates the marker and provenance. A divergent target remains untouched.

## Hooks and automation

- Consumer post-checkout and post-merge hooks call the already-installed Node file with `sync --if-needed`.
- Consumer pre-commit, pre-push, and CI call the same installed file with `check`.
- Hooks never use `npx`, a package manager install command, a registry lookup, or a version range.
- Package upgrades occur only in a reviewed lockfile/config change.
- Remove the ai-orchestration cron/raw-copy path after the pinned projector migration is verified.
- Source pre-commit blocks on `catalog:check`; source pre-push runs the full non-network verification suite.

## Verification

Cover:

- Catalog shape, stable slugs, manifest/file parity, orphan detection, and deterministic digests.
- Exact package version and catalog-authority validation.
- Fresh sync, byte-stable no-op, read-only check, and traversal rejection.
- Dirty generated-file refusal and unmanaged-target refusal.
- Safe adoption with JSON formatting differences and rejection of changed Markdown.
- Atomic candidate validation and promotion behavior.
- A private packed artifact installed into a clean offline consumer fixture and invoked through its shipped CLI.
- Wiki plan/topic/journal reachability and graph freshness.

## Rollout

1. Configure npm trusted publishing for the private `verndale/ui-design-brain`
   repository and `release.yml`, then merge and release the audited next patch
   version to public npm.
2. Update ai-orchestration's exact package lock/config, adopt its current catalog once, add local hooks, and remove cron/raw-copy automation under [verndale/ai-orchestration issue #609](https://github.com/verndale/ai-orchestration/issues/609).
3. Update COS's exact package lock/config, adopt Conductor's current catalog once, and preserve Conductor as runtime resolver under [Azure Boards Feature 17](https://dev.azure.com/verndale/V00066-Cumulative-OperatingSystem/_workitems/edit/17).
4. Let the accessibility repository own and validate UI-slug-to-accessibility-pattern bindings; do not add them here.
5. Run the cross-repository Functional Spec → accessibility contract → Build Pack golden fixture.
6. Remove duplicated accessibility prose only after parity passes and the owning accessibility contracts are released.

## Risks and compatibility

- `v1.15.1` cannot project: it predates the CLI. Configuring it as projector package fails explicitly.
- Active consumer artifacts retain their recorded package/catalog/source digests; upgrades never silently rewrite history.
- Existing copied catalogs require explicit verified adoption, not deletion or blind overwrite.
- A package upgrade may change guidance or vocabulary, so lockfile, config, generated diff, and downstream golden results remain one review unit.
- Public npm distribution is intentionally limited to the audited package
  allowlist. A source-repository visibility change is not part of this delivery.
