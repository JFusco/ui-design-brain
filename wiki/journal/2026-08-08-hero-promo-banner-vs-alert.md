---
date: 2026-08-08
topics: [component-catalog]
plan: none
pr: https://github.com/verndale/ui-design-brain/pull/38
---
# Hero: promotional banner vs Alert message boundary

## Why

- A project retrospective surfaced promotional banners (image + headline + one or two CTAs) that a project named "message banner" and "CTA banner." By content these are the Hero's promotional-banner layout, but the names collide with Alert's message/banner vocabulary. A plain "Message banner → Hero" alias would misresolve a future project's Alert-style message banner to Hero — the exact confusion the catalog guards against. On single-client evidence the safe fix is a boundary clarification, not an alias.

## What changed

- `patterns/hero.md` — the Banner boundary line now says to judge by content, not the label: a promotional band with an image, a headline, and one or two CTAs is a Hero even when named "message banner" or "CTA banner"; the Alert case is the dismissible page notification.
- `patterns/alert.md` — the reciprocal note: such a promotional band is the Hero, not an Alert, however the label reads; Alert is the dismissible notification or status message.
- No manifest, index, or README change — a guidance clarification, not a new alias or pattern.

## Files

- skills/ui-design-brain/patterns/hero.md
- skills/ui-design-brain/patterns/alert.md

## Follow-ups

- If a second client builds the same promotional "message/CTA banner," the maintainer can context-scope the label across Hero and Alert (as `Banner` already is) so it resolves without the misresolution risk a plain alias carries.
