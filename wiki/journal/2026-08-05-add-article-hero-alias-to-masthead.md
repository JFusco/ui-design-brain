---
date: 2026-08-05
topics: [component-catalog]
plan: none
pr: https://github.com/verndale/ui-design-brain/pull/24
---
# Add Article hero alias to Masthead

## Why

- A project retrospective used **"Article hero"** for the editorial masthead of a news/press-release page type — a publish-date badge, the article title, and its tags — which is exactly the "compact article masthead with title and metadata" layout Masthead's own guidance already claims. It was backed by two independent within-project sources (an as-built build pack and an approved functional spec).
- Masthead carried **no aliases**, so the label resolved to novel. The word "hero" invites confusion with **Hero**, but Masthead's guidance already draws that line — a Masthead *identifies* the page, a Hero *sells* — and an editorial article header with no promotional CTA is a Masthead. Registered as a plain alias.

## What changed

- Added the consumer-evidenced **Article hero** alias to **Masthead** (77 → 77): the manifest entry gains its first alias, and `patterns/masthead.md` gets an `**Also known as:** Article hero` line after the H2.
- No new pattern file, index row, or README change — an alias does not move the canonical count.

## Files

- skills/ui-design-brain/patterns-manifest.json
- skills/ui-design-brain/patterns/masthead.md

## Follow-ups

- Consumers pick it up on their next sync.
- Evidence sits in the private project-retrospective evidence store, kept out of this repo per the data boundary.
