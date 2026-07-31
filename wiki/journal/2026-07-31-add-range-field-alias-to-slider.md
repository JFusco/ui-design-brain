---
date: 2026-07-31
topics: [component-catalog]
plan: none
pr: https://github.com/verndale/ui-design-brain/pull/18
---
# Add Range field alias to Slider

## Why

- A project retrospective found a labelled range control — a native range input with a painted track, tick marks, and a hint/unit — that the project named "range field" and that resolved to no canonical, though it is exactly a **Slider**. The catalog already aliases the concept as "Range input"; this registers the project's word so the label resolves.
- Consumer-evidenced: the label backs the whole control (its Storybook story and component template), and it is the entire component, not a child part.

## What changed

- Added the plain alias **Range field** to **Slider** (count unchanged, 73 → 73): inserted into the manifest `aliases` array alphabetically (Range field · Range input) and mirrored on the `patterns/slider.md` **Also known as:** line.
- No new canonical, no `index.md` or README change — an alias registration only.

## Files

- skills/ui-design-brain/patterns-manifest.json
- skills/ui-design-brain/patterns/slider.md

## Follow-ups

- Consumers pick it up on their next `pnpm uidb:sync`.
- Evidence sits in the private project-retrospective evidence store, kept out of this repo per the data boundary.
