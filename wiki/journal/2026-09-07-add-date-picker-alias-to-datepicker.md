---
date: 2026-09-07
topics: [component-catalog]
plan: none
pr: pending
issue: https://github.com/verndale/ui-design-brain/issues/57
issues: [https://github.com/verndale/ui-design-brain/issues/57]
---
# Add Date Picker alias to Datepicker

## Why

- A project exposes `DatePicker` as the complete calendar-based single/range date control, including manual entry, a calendar grid, focus management, and mobile modal behavior.
- The existing **Datepicker** canonical covers that whole control. The gap was exact label resolution, not missing UI vocabulary.

## What changed

- Added **Date Picker** as a plain alias of **Datepicker**; the catalog remains at 80 patterns.
- Kept the alias unscoped because it names the whole control and has one demonstrated meaning.
- Did not create a new canonical or alias any child calendar part.

## Files

- skills/ui-design-brain/patterns-manifest.json
- skills/ui-design-brain/patterns/datepicker.md
- wiki/topics/component-catalog.md

## Follow-ups

- Consumers pick up the alias on their next catalog synchronization.
- Source evidence remains in the private evidence store.
