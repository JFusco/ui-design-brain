---
date: 2026-09-07
topics: [component-catalog]
plan: none
pr: https://github.com/verndale/ui-design-brain/pull/58
issue: https://github.com/verndale/ui-design-brain/issues/57
issues: [https://github.com/verndale/ui-design-brain/issues/57]
---
# Add Input Field alias to Text input

## Why

- A project exposes `InputField` as a complete native single-line input with label, help and error messaging, icons, and an adjacent-action slot.
- The existing **Text input** canonical covers that field. The gap was exact label resolution, not missing UI vocabulary.

## What changed

- Added **Input Field** as a plain alias of **Text input**; the catalog remains at 80 patterns.
- Kept the alias unscoped because it names the complete field and has one demonstrated meaning.
- Did not create a new canonical for its label or message composition.

## Files

- skills/ui-design-brain/patterns-manifest.json
- skills/ui-design-brain/patterns/text-input.md
- wiki/topics/component-catalog.md

## Follow-ups

- Consumers pick up the alias on their next catalog synchronization.
- Source evidence remains in the private evidence store.
