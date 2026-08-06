---
date: 2026-08-06
topics: [component-catalog]
plan: none
pr: pending
---
# Add the Logo bar pattern

## Why

- A project retrospective surfaced a full-width band of partner/customer/certification logos presented as social proof — often auto-scrolling, logos non-interactive — that the catalog had no home for. Promoted on two independent in-project sources (an as-built build pack and an approved functional spec, which together supply a client-neutral definition and the WCAG 2.2.2 pause/play contract).
- Not already covered: **Marquee** is a continuously-scrolling strip of *text* (aliases News ticker, Ticker) and **Hero**/**Card** do not describe a logo social-proof row. Marquee's own guidance previously reached toward logo-walls, so the boundary needed drawing.

## What changed

- Added the **Logo bar** pattern (77 → 78): a full-width, non-interactive logo social-proof band, with the plain aliases Logo cloud, Logo wall, Logos bar, Partner logos.
- Created `patterns/logo-bar.md`, inserted the manifest entry between `List` and `Marquee`, added `- Logo bar` to `index.md`, and bumped the README pattern count at all three occurrences.
- Added the reciprocal **Marquee → Logo bar** cross-reference so the scrolling-logos boundary resolves in both directions (Marquee = scrolling text; Logo bar = a brand-logo strip, scrolling or static).

## Files

- skills/ui-design-brain/patterns/logo-bar.md (new)
- skills/ui-design-brain/patterns-manifest.json
- skills/ui-design-brain/index.md
- skills/ui-design-brain/patterns/marquee.md
- README.md

## Follow-ups

- Consumers pick it up on their next sync.
- Evidence sits in the private project-retrospective evidence store, kept out of this repo per the data boundary.
