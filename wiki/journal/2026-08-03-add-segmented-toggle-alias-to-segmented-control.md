---
date: 2026-08-03
topics: [component-catalog]
plan: none
pr: pending
---
# Add Segmented toggle alias to Segmented control

## Why

- A project retrospective surfaced a component labelled "Segmented toggle" that had resolved to novel — a pill track with one filled segment, a `tablist`/pressed-group mode, and roving arrow-key selection. That is the **Segmented control** canonical under a different, industry-standard word, not a new pattern.
- Consumer-evidenced: the project used the label for the whole control (not a child segment), so it is a plain string alias, unambiguous — it does not map to a second canonical.

## What changed

- Added the plain **Segmented toggle** alias to **Segmented control** (74 → 74): inserted into the manifest entry's `aliases` before `Toggle button group`, and mirrored on the pattern file's `**Also known as:**` line.
- No new pattern, no index or README change — the alias only widens resolution onto an existing canonical.

## Files

- skills/ui-design-brain/patterns-manifest.json
- skills/ui-design-brain/patterns/segmented-control.md

## Follow-ups

- Consumers pick it up on their next sync.
- Evidence sits in the private project-retrospective evidence store, kept out of this repo per the data boundary.
