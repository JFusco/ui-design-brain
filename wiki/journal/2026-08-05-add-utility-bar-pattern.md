---
date: 2026-08-05
topics: [component-catalog]
plan: none
pr: pending
---
# Add the Utility bar pattern

## Why

- A project retrospective surfaced a persistent, fixed-position cluster of global utility actions (scroll-to-top, a help/chat launcher) that stays put across scroll on every page. It was backed by two independent evidence sources within one project — the project's own component registry entry and an approved functional spec — clearing the two-source bar (no build pack existed for this module, so the approved spec carries the strong evidence). Two earlier retrospectives had it at Watch pending a second sighting; the approved spec is that confirmation.
- No existing canonical covered it. **Button group** (which aliases **Toolbar**) is an *in-flow* grouping of related buttons within the content; a Utility bar is a *persistent, fixed-position, global* cluster of secondary page utilities — a different affordance, not a styling of the same one.

## What changed

- Added the **Utility bar** canonical (76 → 77): new `patterns/utility-bar.md`, a manifest entry between `Tree view` and `Video`, an `index.md` list row, and the README count bumped in its three places.
- Alias: **Floating utility bar** — the consumer-evidenced label a project used for the same affordance.
- Added the reciprocal confusable-neighbor cross-reference in `button-group.md` (Button group → Utility bar for the persistent-floating case), since Button group's `Toolbar` alias is the nearest neighbor and the two are easy to conflate. The Button and Segmented control pointers are disambiguation, left one-way.

## Files

- skills/ui-design-brain/patterns/utility-bar.md (new)
- skills/ui-design-brain/patterns-manifest.json
- skills/ui-design-brain/index.md
- skills/ui-design-brain/patterns/button-group.md
- README.md

## Follow-ups

- Consumers pick it up on their next sync.
- Evidence sits in the private project-retrospective evidence store, kept out of this repo per the data boundary.
