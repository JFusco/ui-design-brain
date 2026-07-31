---
date: 2026-07-30
topics: [component-catalog]
plan: none
pr: https://github.com/verndale/ui-design-brain/pull/18
---
# Add the Section header pattern

## Why

- Two independent project retrospectives surfaced a section-intro block — an optional eyebrow above a heading, a supporting description, and optional actions, grouped and aligned as one unit — that resolved to no canonical. One retrospective watched it a run earlier and named the elevation condition; the next independently built the same block. Recurrence across two projects is the catalog's own growth signal.
- No single canonical covered it: it is neither the top-of-page **Hero** (promotional band) nor the page-identity **Masthead**, and while it composes **Eyebrow** + **Heading**, the composed section-intro unit had no home. The catalog already catalogs composed content blocks (Hero, Masthead), so composition is not disqualifying.

## What changed

- Added the **Section header** canonical (72 → 73): new `patterns/section-header.md`, a manifest entry between `Search input` and `Segmented control`, an `index.md` list row, and the README count bumped in its three places.
- Alias **Heading with description**, consumer-evidenced — a project's actual label for the block, not an invented synonym.
- Added reciprocal confusable-neighbour cross-references so **Section header** and both **Hero** and **Masthead** point at each other — the Hero collision one retrospective flagged when it first held the pattern at Watch. The Section header → Eyebrow / Heading pointers are compositional, left one-way (matching the Stat → Card precedent).

## Files

- skills/ui-design-brain/patterns/section-header.md (new)
- skills/ui-design-brain/patterns-manifest.json
- skills/ui-design-brain/index.md
- skills/ui-design-brain/patterns/hero.md
- skills/ui-design-brain/patterns/masthead.md
- README.md

## Follow-ups

- Consumers pick it up on their next `pnpm uidb:sync`.
- Evidence sits in the private project-retrospective evidence store, kept out of this repo per the data boundary.
