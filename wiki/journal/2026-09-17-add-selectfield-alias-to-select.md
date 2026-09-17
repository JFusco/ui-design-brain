---
date: 2026-09-17
topics: [component-catalog]
plan: none
pr: pending
issue: https://github.com/verndale/ui-design-brain/issues/64
issues: [https://github.com/verndale/ui-design-brain/issues/64]
---
# Add SelectField alias to Select

## Why
- A completed implementation exposed the complete labelled selection control under this exact name.
- Label and validation composition do not create a separate canonical pattern.

## What changed
Added `SelectField` as a plain alias of Select. The catalog remains at 82 patterns.

## Files
- `skills/ui-design-brain/patterns-manifest.json`
- `skills/ui-design-brain/patterns/select.md`
