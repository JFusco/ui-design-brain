---
date: 2026-07-30
topics: [component-catalog]
plan: none
pr: https://github.com/verndale/ui-design-brain/pull/18
---
# Add the Rich text pattern

## Why

- Two independent project retrospectives surfaced a read-only rich-text / prose *render* primitive — a region that styles already-authored HTML (headings, paragraphs, lists, links, inline media) as one flowing block — that resolved to no canonical. One retrospective watched it a run earlier and named the elevation condition; the next independently built the same primitive. Recurrence across two projects is the catalog's own growth signal.
- No existing canonical covered it: the catalog's **Rich text editor** is the *editing* surface (WYSIWYG), so a read-only renderer of authored content was a distinct concern the catalog had not had to separate — the render-vs-edit split one retrospective flagged as missing.

## What changed

- Added the **Rich text** canonical (71 → 72): new `patterns/rich-text.md`, a manifest entry between `Rating` and `Rich text editor`, an `index.md` list row, and the README count bumped in its three places.
- Aliases **Rich text block** and **Rich text field**, both consumer-evidenced — a CMS block type and an authored rich-text field name observed in the retrospectives, not invented synonyms.
- Added the reciprocal render-vs-edit cross-reference so **Rich text** and **Rich text editor** point at each other in both directions — the confusable-neighbour pair the addition creates. The Rich text → Quote pointer is a distinct-concept steer, left one-way.

## Files

- skills/ui-design-brain/patterns/rich-text.md (new)
- skills/ui-design-brain/patterns-manifest.json
- skills/ui-design-brain/index.md
- skills/ui-design-brain/patterns/rich-text-editor.md
- README.md

## Follow-ups

- Consumers pick it up on their next `pnpm uidb:sync`.
- Evidence sits in the private project-retrospective evidence store, kept out of this repo per the data boundary.
