---
date: 2026-09-07
topics: [component-catalog]
plan: none
pr: https://github.com/verndale/ui-design-brain/pull/58
issue: https://github.com/verndale/ui-design-brain/issues/57
issues: [https://github.com/verndale/ui-design-brain/issues/57]
---
# Add Toggle Switch alias to Toggle

## Why

- A project exposes `ToggleSwitch` as the complete binary setting control, with a native checkbox, accessible naming, disabled state, track, and thumb.
- The existing **Toggle** canonical covers that whole control. The gap was exact label resolution, not missing UI vocabulary.

## What changed

- Added **Toggle Switch** as a plain alias of **Toggle**; the catalog remains at 80 patterns.
- Kept the alias unscoped because it names the whole control and has one demonstrated meaning.
- Did not create a new canonical or treat the visual track and thumb as component identities.

## Files

- skills/ui-design-brain/patterns-manifest.json
- skills/ui-design-brain/patterns/toggle.md
- wiki/topics/component-catalog.md

## Follow-ups

- Consumers pick up the alias on their next catalog synchronization.
- Source evidence remains in the private evidence store.
