---
date: 2026-09-07
topics: [component-catalog]
plan: none
pr: https://github.com/verndale/ui-design-brain/pull/58
issue: https://github.com/verndale/ui-design-brain/issues/57
issues: [https://github.com/verndale/ui-design-brain/issues/57]
---
# Add Segmented Radio Group alias to Segmented control

## Why

- A project exposes `SegmentedRadioGroup` as the complete mutually exclusive option group with native radio semantics and a moving selection indicator.
- The existing **Segmented control** canonical covers that interaction. The gap was exact label resolution, not missing UI vocabulary.

## What changed

- Added **Segmented Radio Group** as a plain alias of **Segmented control**; the catalog remains at 80 patterns.
- Kept the alias unscoped because it names the whole group and has one demonstrated meaning.
- Did not alias an individual segment or indicator.

## Files

- skills/ui-design-brain/patterns-manifest.json
- skills/ui-design-brain/patterns/segmented-control.md
- wiki/topics/component-catalog.md

## Follow-ups

- Consumers pick up the alias on their next catalog synchronization.
- Source evidence remains in the private evidence store.
