---
date: 2026-07-31
topics: [component-catalog]
plan: none
pr: pending
---
# Add Hero banner alias to Hero

## Why

- A project retrospective found a top-of-page slide hero — media + heading + copy + CTAs, with optional auto-rotate — named "hero banner" and resolving to no canonical, though it is a **Hero**. The catalog already carries the context alias `Banner` (top-of-page hero area) and the plain alias "Promo banner"; "hero banner" is the project's literal word for the same region.
- Unambiguous — a top-of-page hero, not a page-level notification — so a plain string alias, not a context-scoped one. Consumer-evidenced, the whole region rather than a child slide.

## What changed

- Added the plain alias **Hero banner** to **Hero** (count unchanged, 73 → 73): inserted into the manifest `aliases` array after the context-scoped `Banner` entry (Banner · Hero banner · Jumbotron · Promo banner) and mirrored on the `patterns/hero.md` **Also known as:** line. The `Banner` context alias and its `index.md` row are untouched.
- No new canonical, no README change — an alias registration only.

## Files

- skills/ui-design-brain/patterns-manifest.json
- skills/ui-design-brain/patterns/hero.md

## Follow-ups

- Consumers pick it up on their next `pnpm uidb:sync`.
- Evidence sits in the private project-retrospective evidence store, kept out of this repo per the data boundary.
