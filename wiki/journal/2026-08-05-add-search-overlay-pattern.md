---
date: 2026-08-05
topics: [component-catalog]
plan: none
pr: https://github.com/verndale/ui-design-brain/pull/24
---
# Add the Search overlay pattern

## Why

- A project retrospective surfaced a full-screen search surface that opens over the page from a persistent global-navigation trigger — a large input with a headline, author-managed quick links, and, once the visitor types, a results panel of recent searches and live suggestions. It was backed by two independent evidence sources within one project — an as-built pipeline build pack and an approved functional spec — clearing the two-source bar without waiting on cross-project recurrence.
- No existing canonical covered it. **Search input** is the inline field; **Modal** is a plain content dialog with no search role; **Combobox** is inline autosuggest under a field. A Search overlay *composes* these but adds its own trigger, an explicit open/closed × idle/active state machine, and a dismissal contract — the build pack carried a dedicated state-machine definition, which is the evidence it is a named pattern rather than an ad-hoc composition.

## What changed

- Added the **Search overlay** canonical (74 → 75): new `patterns/search-overlay.md`, a manifest entry between `Search input` and `Section header`, an `index.md` list row, and the README count bumped in its three places.
- Aliases: **Command palette** and **Search modal** — the widely-used industry synonym and the plain descriptive form.
- Cross-references to `search-input.md`, `modal.md`, and `combobox.md` are disambiguation ("use this other component when…"), not confusable-neighbor pairs, so they are left one-way — no reciprocal edits in those files.

## Files

- skills/ui-design-brain/patterns/search-overlay.md (new)
- skills/ui-design-brain/patterns-manifest.json
- skills/ui-design-brain/index.md
- README.md

## Follow-ups

- Consumers pick it up on their next sync.
- A project retrospective's component capture keyed to this canonical was deferred behind this promotion; with the canonical now in the catalog it can be applied to the component library.
- Evidence sits in the private project-retrospective evidence store, kept out of this repo per the data boundary.
