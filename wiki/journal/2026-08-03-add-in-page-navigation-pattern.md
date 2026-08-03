---
date: 2026-08-03
topics: [component-catalog]
plan: none
pr: https://github.com/verndale/ui-design-brain/pull/21
---
# Add the In-page navigation pattern

## Why

- A project retrospective surfaced a sticky "on this page" bar of anchor links that jump to the current page's sections and track which one is in view. It was backed by two independent evidence sources — an as-built pipeline build pack and an approved functional spec whose contract (`<nav aria-label="On this page">`, `aria-current` on the active item, scroll-spy, keyboard model) is already a client-neutral definition — clearing the two-source bar within a single project rather than on cross-project recurrence.
- No existing canonical covered it: **Anchor** is an alias of **Link** (a single hyperlink), **Skip link** is the accessibility bypass to main content, and **Navigation** is site/section navigation. Navigation's own definition had absorbed the in-page-jump role, which this pattern now separates out.

## What changed

- Added the **In-page navigation** canonical (73 → 74): new `patterns/in-page-navigation.md`, a manifest entry between `Image` and `Label`, an `index.md` list row, and the README count bumped in its three places.
- Aliases: **Jumplinks** and **On this page** — both consumer/spec-evidenced (the project's component label and the spec's own landmark name).
- Added the reciprocal confusable-neighbor cross-reference in `navigation.md` (Navigation → In-page navigation for the section-jump case). The Skip link and Link pointers are disambiguation, not confusable pairs, so they are left one-way.

## Files

- skills/ui-design-brain/patterns/in-page-navigation.md (new)
- skills/ui-design-brain/patterns-manifest.json
- skills/ui-design-brain/index.md
- skills/ui-design-brain/patterns/navigation.md
- README.md

## Follow-ups

- Consumers pick it up on their next sync.
- Navigation's definition still mentions "jumping to sections within the current page"; a future edit may narrow it now that In-page navigation owns that case — left as-is here to avoid changing an existing canonical's resolution in this delivery.
- Evidence sits in the private project-retrospective evidence store, kept out of this repo per the data boundary.
