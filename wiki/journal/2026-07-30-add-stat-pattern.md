---
date: 2026-07-30
topics: [component-catalog]
plan: none
pr: pending
---
# Add the Stat pattern

## Why

- Two independent project retrospectives (2026-07-26 and 2026-07-30) each surfaced a cluster of statistic components — a prominent value paired with a short describing label — that resolved to no canonical. Recurrence across two projects is the catalog's own growth signal, the same evidence the last expansion used.
- No existing canonical covered it: **Card** is the container, and **Progress indicator** / **Progress bar** are about progress toward a goal, not a standalone figure.

## What changed

- Added the **Stat** canonical (70 → 71): new `patterns/stat.md`, a manifest entry between `Stack` and `Stepper`, an `index.md` list row, and the README count bumped in its three places.
- No aliases — both retrospectives named the concept "Stat"/"Stats" (the canonical itself); a future project that uses "Metric" or "KPI" adds that alias with its own consumer evidence.
- Added the reciprocal confusable-neighbor cross-reference in `progress-indicator.md` (Progress indicator ↔ Stat). The Stat → Card pointer is compositional, not a confusable pair, so it is left one-way.

## Files

- skills/ui-design-brain/patterns/stat.md (new)
- skills/ui-design-brain/patterns-manifest.json
- skills/ui-design-brain/index.md
- skills/ui-design-brain/patterns/progress-indicator.md
- README.md

## Follow-ups

- Consumers pick it up on their next `pnpm uidb:sync`.
- Evidence sits in the private project-retrospective evidence store, kept out of this repo per the data boundary.
