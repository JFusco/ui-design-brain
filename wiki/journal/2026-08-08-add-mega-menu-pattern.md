---
date: 2026-08-08
topics: [component-catalog]
plan: none
pr: pending
---
# Add the Mega menu pattern

## Why

- Two independent client retrospectives built the same component: a large, full-width disclosure panel dropped from a top-level navigation item, presenting a site's sections as several columns of grouped links, with its own open/close, focus, and motion behavior. One client's registry carried a `fingerprint.json` declaring a `disclosure` affordance and a `navigation-mega-menu` role; the other backed it with an approved "header mega menu" functional spec. Cross-client recurrence with independent evidence per client — the signal the catalog mints canonicals on, and the one an earlier same-project run said would settle it.
- No existing canonical covered it. **Navigation** is the compact site-nav bar the panel drops from and does not describe the panel's disclosure, focus-management, and accessibility contract; **Dropdown menu** is a small single-column menu of actions; **Drawer** is the off-canvas mobile surface the panel usually collapses into. A full-width, multi-column mega menu is none of these.

## What changed

- Added the **Mega menu** canonical (79 → 80): new `patterns/mega-menu.md`, a manifest entry between `Media object` and `Modal`, an `index.md` list row, and the README count bumped in its three places.
- Aliases: **Header mega menu**, **Mega menu panel** — the consumer-evidenced labels the two clients used.
- Cross-references to `navigation.md`, `dropdown-menu.md`, and `drawer.md` are disambiguation ("use this other component when…"), left one-way — no reciprocal edits in those files.

## Files

- skills/ui-design-brain/patterns/mega-menu.md (new)
- skills/ui-design-brain/patterns-manifest.json
- skills/ui-design-brain/index.md
- README.md

## Follow-ups

- Consumers pick it up on their next sync.
- Evidence sits in the private project-retrospective evidence store, kept out of this repo per the data boundary.
