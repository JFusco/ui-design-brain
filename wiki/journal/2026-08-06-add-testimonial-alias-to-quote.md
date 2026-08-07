---
date: 2026-08-06
topics: [component-catalog]
plan: none
pr: https://github.com/verndale/ui-design-brain/pull/27
---
# Add Testimonial alias to Quote

## Why

- A project retrospective surfaced a component family labelled "Testimonial" — a first-person quote with a portrait photo, author name and role, and an optional CTA — that had resolved to novel. That is the **Quote** canonical under a different word: Quote's own guidance already lists "Testimonial block with photo, quote, name, and title" as a common layout and requires attribution, so the concept is in scope and only the label was missing.
- Consumer-evidenced: an approved functional spec plus a five-module component family used the label for the whole component (not a child part), so it is a plain string alias, unambiguous — it does not map to a second canonical.

## What changed

- Added the plain **Testimonial** alias to **Quote** (77 → 77): appended to the manifest entry's `aliases` after `Pull quote`, and mirrored on the pattern file's `**Also known as:**` line.
- No new pattern, no index or README change — the alias only widens resolution onto an existing canonical.

## Files

- skills/ui-design-brain/patterns-manifest.json
- skills/ui-design-brain/patterns/quote.md

## Follow-ups

- Consumers pick it up on their next sync.
- Evidence sits in the private project-retrospective evidence store, kept out of this repo per the data boundary.
