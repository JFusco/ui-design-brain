---
date: 2026-07-31
topics: [component-catalog]
plan: none
pr: pending
---
# Add FAQ block alias to Accordion

## Why

- A project retrospective found a FAQ module — the project labelled it "faq-block" — whose question/answer disclosure is the project's accordion (an `aria-expanded` expand/collapse list). It resolved to no canonical, though the disclosure component is an **Accordion** in a frequently-asked-questions use-case. Registering the label stops it falling to the novel tail.
- Consumer-evidenced: the project's actual module label, not an invented synonym. The alias names the whole disclosure component; the individual Q/A row is the child part and stays novel.

## What changed

- Added the plain alias **FAQ block** to **Accordion** (count unchanged, 73 → 73): appended to the manifest `aliases` array in alphabetical position (after Expander) and mirrored on the `patterns/accordion.md` **Also known as:** line.
- No new canonical, no `index.md` or README change — an alias registration only.

## Files

- skills/ui-design-brain/patterns-manifest.json
- skills/ui-design-brain/patterns/accordion.md

## Follow-ups

- Consumers pick it up on their next `pnpm uidb:sync`.
- Evidence sits in the private project-retrospective evidence store, kept out of this repo per the data boundary.
