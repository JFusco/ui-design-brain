---
date: 2026-09-17
topics: [component-catalog]
plan: none
pr: pending
issue: https://github.com/verndale/ui-design-brain/issues/64
issues: [https://github.com/verndale/ui-design-brain/issues/64]
---
# Add CheckboxControl alias to Checkbox

## Why
- A completed implementation exposed the whole labelled checkbox control under this exact name.
- The label describes the complete control rather than a child part or a new canonical pattern.

## What changed
Added `CheckboxControl` as a plain alias of Checkbox. The catalog remains at 80 patterns at this step.

## Files
- `skills/ui-design-brain/patterns-manifest.json`
- `skills/ui-design-brain/patterns/checkbox.md`
