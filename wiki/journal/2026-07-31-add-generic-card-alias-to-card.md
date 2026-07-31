---
date: 2026-07-31
topics: [component-catalog]
plan: none
pr: https://github.com/verndale/ui-design-brain/pull/18
---
# Add Generic card alias to Card

## Why

- A project retrospective found a base content-card component the project named "generic card" — an article surface composing media, content, and actions — that resolved to no canonical under that label, even though it is exactly a **Card**. The project reached for its own word; the catalog should recognize it so the label resolves rather than falling to the novel tail.
- Consumer-evidenced, not an invented synonym: the label backs the whole Card component (its build pack, its Storybook story, and its component template — three independent sources), and it is the entire component, not a child part, so aliasing it does not break child-spec linking.

## What changed

- Added the plain alias **Generic card** to **Card** (count unchanged, 73 → 73): inserted into the manifest `aliases` array alphabetically (Content tile · Generic card · Tile) and mirrored on the `patterns/card.md` **Also known as:** line.
- No new canonical, and no `index.md` or README change — an alias registration only.

## Files

- skills/ui-design-brain/patterns-manifest.json
- skills/ui-design-brain/patterns/card.md

## Follow-ups

- Consumers pick it up on their next `pnpm uidb:sync`.
- Evidence sits in the private project-retrospective evidence store, kept out of this repo per the data boundary.
