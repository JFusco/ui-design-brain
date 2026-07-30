---
aliases: [pattern catalog, component vocabulary, canonical components, pattern manifest, alias resolution, consumer alignment]
covers: [skills/ui-design-brain/patterns-manifest.json, skills/ui-design-brain/index.md]
---
# Component catalog — Design History

The canonical UI-pattern catalog: how a design label resolves to one component with one set of guidance, and the rules that keep that resolution stable for the consumers that vendor it.

## Current state

- The catalog is a flat set of canonical patterns under `skills/ui-design-brain/patterns/`, one markdown file per pattern (currently 71).
- `patterns-manifest.json` is the single source of truth. Each entry carries `name`, `slug`, `aliases`, and `file`, with `slug == kebab(name) == filename`. Consumers resolve a design label to one canonical by exact string — `name`, then plain alias, then context alias — and treat an unresolved label as novel.
- Most aliases are plain strings. A few are context-scoped `{ name, context }` objects (Banner, CTA, Label, Stepper) that resolve to different canonicals by context; `index.md` mirrors them in a Context-scoped aliases table.
- `index.md` is the first-hop narrowing list; each pattern file holds the guidance — a one-line definition, bidirectional cross-references, roughly six best practices with at least one measurable accessibility bullet, and about four layouts. Downstream pipelines lift the accessibility bullets into acceptance criteria, so those bullets stay concrete (a specific WCAG SC, ARIA attribute, or technique).
- Cross-references between confusable patterns are bidirectional prose pointers. Child modules (a Carousel's Slide, a Tabs' Tab / Tab panel, an Accordion's Accordion item) are named in prose but never aliased, so ba-cockpit child-spec smart-linking keeps treating them as novel.
- Visual variants (for example the tabs pill / underline / segmented styles) are an axis orthogonal to ARIA and never change the resolved canonical.
- Authoring structure and conventions live in `skills/_meta/` (authoring-only, never vendored). Catalog integrity — manifest to index to pattern files to the README count — is gated by the `catalogs` edge in `pnpm evals:graph`.

## Decisions

- 2026-07-30 — Added the **Stat** pattern (70 → 71): a standalone value-plus-label figure the catalog had no home for, promoted on recurrence across two independent project retrospectives. Kept it aliasless (consumer-evidenced only) and added the reciprocal Progress indicator ↔ Stat cross-reference ([journal](../journal/2026-07-30-add-stat-pattern.md)).
- 2026-07-23 — Reworded the `index.md` context-scoped "Stepper (the canonical)" row from "multi-step form / wizard control" to "numeric +/- quantity control", resolving the stale mapping the Wizard addition left behind (the Stepper canonical is the numeric control; "Multi-step form" now resolves to Wizard) ([issue #14](https://github.com/verndale/ui-design-brain/issues/14), [journal](../journal/2026-07-23-fix-stale-stepper-canonical-row.md)).
- 2026-07-23 — Added five consumer-driven patterns (Eyebrow, Filter, Marquee, Masthead, Wizard; 65 to 70) so the highest-frequency BA labels stop resolving to novel. Kept aliases exact-string and consumer-evidenced (dropped the speculative "Interior hero" Masthead alias), named child parts in prose without aliasing them, and codified the child-part and Visual-variants conventions in the authoring docs ([plan](../plans/2026-07-23-ui-design-brain-close-catalog-gaps-observed-in-consuming-rep.md), [journal](../journal/2026-07-23-close-consumer-catalog-gaps.md), [issue #11](https://github.com/verndale/ui-design-brain/issues/11)).
