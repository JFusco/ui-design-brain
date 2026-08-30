---
date: 2026-08-30
topics: [component-catalog, packaging-and-distribution]
plan: plans/2026-08-30-deterministic-ui-design-brain-projections.md
pr: https://github.com/verndale/ui-design-brain/pull/49
issue: https://github.com/verndale/ui-design-brain/issues/47
issues: [https://github.com/verndale/ui-design-brain/issues/47, https://github.com/verndale/ai-orchestration/issues/609]
---
# Add deterministic UI Design Brain projections

## Why

- ai-orchestration's recurring raw-folder sync and COS's separate copied catalog could drift between Functional Spec naming and Build Pack implementation.
- `v1.15.1` contains the canonical vocabulary but predates projection tooling, so new provenance must not claim that release supplied the CLI.
- UI pattern names and aliases help accessibility applicability, but their Markdown must not become a second normative accessibility authority.
- The delivery must coordinate [verndale/ui-design-brain issue #47](https://github.com/verndale/ui-design-brain/issues/47), [verndale/ai-orchestration issue #609](https://github.com/verndale/ai-orchestration/issues/609), and [Azure Boards Feature 17](https://dev.azure.com/verndale/V00066-Cumulative-OperatingSystem/_workitems/edit/17).

## What changed

- Added a dependency-free CLI and schemas for source builds, exact pinned consumer configuration, deterministic sync, read-only checks, and machine-readable digest provenance.
- Added marker ownership, dirty-file refusal, sibling-directory candidate validation, atomic promotion/rollback, and byte-stable `--if-needed` behavior.
- Added `--adopt` for a one-time migration only when an unmanaged legacy catalog matches the package exactly, allowing manifest whitespace differences but no content differences.
- Kept the package private and GitHub release behavior unchanged; `1.16.0-next.0` is the explicit branch placeholder and `1.16.0` is the first stable projector target.
- Bounded UI Design Brain to canonical vocabulary and product guidance. Accessibility-adjacent prose is non-normative pending parity; bindings and obligations stay with the [canonical accessibility plan](https://github.com/verndale/accessibility-standards/blob/main/wiki/plans/2026-08-30-shared-accessibility-standards-delivery.md).
- Rejected both a new cron-based copy and blind adoption because neither can prove which bytes or authority reached each consumer.

## Files

- `bin/ui-design-brain.mjs`, `lib/*.mjs`, `schemas/*.schema.json`
- `skills/ui-design-brain/catalog-manifest.json`
- `scripts/tests/projection-contract.test.mjs`, `package.json`, `.husky/pre-commit`
- `README.md`, `CONTRIBUTING.md`, `AGENTS.md`
- `wiki/plans/2026-08-30-deterministic-ui-design-brain-projections.md`
- `wiki/topics/component-catalog.md`, `wiki/topics/packaging-and-distribution.md`

## Follow-ups

- Release stable `1.16.0`, replace consumer prerelease preparation with exact stable pins, and reconcile this entry's pending PR evidence.
- Complete consumer adoption and remove ai-orchestration cron/raw-copy automation.
- Remove duplicated accessibility prose only after cross-repository parity passes.
