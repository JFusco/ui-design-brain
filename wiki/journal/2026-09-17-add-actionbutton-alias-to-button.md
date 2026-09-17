---
date: 2026-09-17
topics: [component-catalog]
plan: none
pr: https://github.com/verndale/ui-design-brain/pull/65
issue: https://github.com/verndale/ui-design-brain/issues/64
issues: ["https://github.com/verndale/ui-design-brain/issues/64"]
---
# Add ActionButton alias to Button and Link

## Why
- A completed implementation used one public label for both action and navigation behavior.
- A plain alias would silently collapse two semantic controls, so exact context must decide resolution.

## What changed
Added symmetric `ActionButton` context aliases to Button and Link, with matching guidance and index rows. In-page behavior resolves to Button; `href` or download navigation resolves to Link; unclear evidence remains unresolved.

## Files
- `skills/ui-design-brain/patterns-manifest.json`
- `skills/ui-design-brain/index.md`
- `skills/ui-design-brain/patterns/button.md`
- `skills/ui-design-brain/patterns/link.md`
