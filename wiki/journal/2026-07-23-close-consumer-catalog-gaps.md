---
date: 2026-07-23
topics: [component-catalog]
plan: plans/2026-07-23-ui-design-brain-close-catalog-gaps-observed-in-consuming-rep.md
pr: https://github.com/verndale/ui-design-brain/pull/12
---
# Close consumer catalog gaps: eyebrow, filter, marquee, masthead, wizard

## Why

- The catalog resolves component labels for two downstream pipelines (ai-orchestration, ba-cockpit) that vendor it byte-identically and resolve by exact string; an unresolved label falls through to "novel".
- An audit of both consumer repos found the highest-frequency page-building labels were unresolved: Eyebrow/Kicker/Overline (~20 ba-cockpit files), Marquee/Ticker, Filter/Facet/Refinements (especially Sitecore Search specs), and Masthead (~18 files).
- ba-cockpit had grown local a11y workarounds (an eyebrow aria-labelledby rule; a marquee WCAG 2.2.2 contract) precisely because the catalog had no pattern to lift guidance from.
- The "Visual variants" convention, born from the documented pill-tabs production failure, lived only in tabs.md and was undocumented in the authoring docs — an orphan a future normalization pass could delete.

## What changed

- Added five patterns (65 to 70): Eyebrow (aliases Kicker, Overline), Filter (Facet, Faceted navigation, Facets, Filter panel, Filters, Refinements), Marquee (News ticker, Ticker), Masthead (no aliases), Wizard (Multi-step form). Each carries measurable, liftable accessibility bullets.
- Added nine bidirectional reverse cross-references and three prose child-part lines (Carousel to Slide, Tabs to Tab / Tab panel, Accordion to Accordion item).
- Codified the child-part and Visual-variants conventions in the authoring docs so they survive future normalization.
- Verified Masthead against ba-cockpit's worked example (People Detail Masthead) as the interior-page identity band, distinct from Hero (promotional) and Header (site chrome).
- Ruled out: aliasing CMS layout regions (Section/Row/Container/Column) and child modules (Slide, Tab panel, Accordion item) — the first would mass-misresolve page-structure headings, the second would break ba-cockpit child-spec smart-linking. Dropped the speculative "Interior hero" Masthead alias as unevidenced in consumers. No machine-structured acceptance-criteria surface (it collides with ba-cockpit's ARIA-precedence contract) and no new validators.

## Files

- New: skills/ui-design-brain/patterns/{eyebrow,filter,marquee,masthead,wizard}.md
- Integrity sync: skills/ui-design-brain/patterns-manifest.json, index.md, README.md
- Cross-refs and child-parts: skills/ui-design-brain/patterns/{heading,badge,carousel,alert,search-input,hero,header,progress-indicator,stepper,tabs,accordion}.md
- Authoring docs: skills/_meta/_sections.md
- Tracking: issue #11 (https://github.com/verndale/ui-design-brain/issues/11)

## Follow-ups

- The index.md context-scoped aliases table still maps the "Stepper" label's canonical sense to "multi-step form / wizard control". That is now stale — "Multi-step form" resolves to the new Wizard, and the Stepper canonical is the numeric +/- control. Left untouched by this change; it needs a separate decision on rewording or removing that row.
- Consider a component-vocabulary / consumer-alignment topic page once a second related catalog-content entry lands. This is the first, so this journal entry carries the thread.
- Graph artifacts (graph.json and the generated wiki/connections pages) are stale pending pnpm graph:build; the pre-commit hook rebuilds and stages them at commit time.
