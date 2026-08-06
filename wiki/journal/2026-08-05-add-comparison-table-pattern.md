---
date: 2026-08-05
topics: [component-catalog]
plan: none
pr: pending
---
# Add the Comparison table pattern

## Why

- A project retrospective surfaced a feature/plan comparison matrix — several entities as columns (product versions, pricing plans), a shared attribute set as rows, and a boolean or short value in each cell, with a mobile column-selector that compares a two-entity subset at a time. It was backed by two independent evidence sources within one project — the project's own component registry entry and an approved functional spec — clearing the two-source bar without cross-project recurrence (no build pack existed for this module, so the approved spec carries the strong evidence).
- No existing canonical covered it. **Table** is the data-table canonical for arbitrary tabular data with heterogeneous columns; a comparison table's entities-as-columns / boolean-cell / recommended-column / column-subset-on-mobile contract is a distinct *presentation* pattern. **Card** covers a single plan's price and CTA, not the cross-plan matrix.

## What changed

- Added the **Comparison table** canonical (75 → 76): new `patterns/comparison-table.md`, a manifest entry between `Combobox` and `Context menu`, an `index.md` list row, and the README count bumped in its three places.
- Alias: **Features comparison table** — the consumer-evidenced label a project used for the same matrix.
- Cross-references to `table.md` and `card.md` are disambiguation ("use this other component when…"), not confusable-neighbor pairs, so they are left one-way — no reciprocal edits in those files.

## Files

- skills/ui-design-brain/patterns/comparison-table.md (new)
- skills/ui-design-brain/patterns-manifest.json
- skills/ui-design-brain/index.md
- README.md

## Follow-ups

- Consumers pick it up on their next sync.
- Evidence sits in the private project-retrospective evidence store, kept out of this repo per the data boundary.
