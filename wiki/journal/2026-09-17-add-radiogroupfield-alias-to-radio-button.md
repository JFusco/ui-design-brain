---
date: 2026-09-17
topics: [component-catalog]
plan: none
pr: pending
issue: https://github.com/verndale/ui-design-brain/issues/64
issues: [https://github.com/verndale/ui-design-brain/issues/64]
---
# Add RadioGroupField alias to Radio button

## Why
- A completed implementation used this exact label for a complete mutually exclusive radio field.
- Field composition and validation do not create a separate canonical pattern.

## What changed
Added `RadioGroupField` as a plain alias of Radio button. The catalog remains at 82 patterns.

## Files
- `skills/ui-design-brain/patterns-manifest.json`
- `skills/ui-design-brain/patterns/radio-button.md`
