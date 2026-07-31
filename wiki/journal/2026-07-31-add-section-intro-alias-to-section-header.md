---
date: 2026-07-31
topics: [component-catalog]
plan: none
pr: pending
---
# Add Section intro alias to Section header

## Why

- A project retrospective found the system's most-composed primitive — an eyebrow + heading + description block rendered as the header of 10+ modules — named "section intro" and resolving to no canonical, though it is exactly the **Section header** the catalog already carries. It is the reusable form of the same section-intro block whose recurrence promoted that canonical.
- Consumer-evidenced: the project's actual label for the block, not an invented synonym; the whole component, not a child part.

## What changed

- Added the plain alias **Section intro** to **Section header** (count unchanged, 73 → 73): inserted into the manifest `aliases` array alphabetically (Heading with description · Section intro) and mirrored on the `patterns/section-header.md` **Also known as:** line.
- No new canonical, no `index.md` or README change — an alias registration only. It joins the existing consumer-evidenced alias "Heading with description".

## Files

- skills/ui-design-brain/patterns-manifest.json
- skills/ui-design-brain/patterns/section-header.md

## Follow-ups

- Consumers pick it up on their next `pnpm uidb:sync`.
- Evidence sits in the private project-retrospective evidence store, kept out of this repo per the data boundary.
