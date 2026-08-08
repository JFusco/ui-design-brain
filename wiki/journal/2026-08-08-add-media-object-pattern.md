---
date: 2026-08-08
topics: [component-catalog]
plan: none
pr: pending
---
# Add the Media object pattern

## Why

- A project retrospective surfaced a full-width, two-column image↔text content band — an eyebrow/heading/rich-text/CTA text block beside a single image or video, the columns alternating left and right down the page — recurring across four independent initiatives within one project, each backed by an approved functional spec. That cleared the two-source bar within one project (approved spec + the project's own module) with unusually broad intra-project recurrence, though not yet cross-project.
- No existing canonical covered it. **Card** is a self-contained entity *tile* in a grid; **Hero** is the promotional banner near the top of a page, and already routes interior cases to Masthead / Section header; **Section header** opens a section with a heading and intro but no paired media. A repeating, mid-page, full-width media-object band is none of these — the classic OOCSS "media object" at section scale, which the catalog had no home for.

## What changed

- Added the **Media object** canonical (78 → 79): new `patterns/media-object.md`, a manifest entry between `Masthead` and `Modal`, an `index.md` list row, and the README count bumped in its three places.
- Alias: **Media block** — the consumer-evidenced label a project used for the band. A media *tile* resolves to **Card** and a carousel of such tiles to **Carousel**; a decorative "S-curve" diagonal is a client visual variant folded into the pattern, not a name of its own.
- Cross-references to `card.md`, `hero.md`, and `section-header.md` are disambiguation ("use this other component when…"), left one-way — no reciprocal edits in those files.

## Files

- skills/ui-design-brain/patterns/media-object.md (new)
- skills/ui-design-brain/patterns-manifest.json
- skills/ui-design-brain/index.md
- README.md

## Follow-ups

- Consumers pick it up on their next sync.
- Evidence sits in the private project-retrospective evidence store, kept out of this repo per the data boundary.
