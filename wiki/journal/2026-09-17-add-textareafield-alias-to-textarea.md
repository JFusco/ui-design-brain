---
date: 2026-09-17
topics: [component-catalog]
plan: none
pr: pending
issue: https://github.com/verndale/ui-design-brain/issues/64
issues: [https://github.com/verndale/ui-design-brain/issues/64]
---
# Add TextAreaField alias to Textarea

## Why
- A completed implementation used this exact label for the complete multiline field.
- Label and validation composition do not create a separate canonical pattern.

## What changed
Added `TextAreaField` as a plain alias of Textarea. The catalog remains at 82 patterns.

## Files
- `skills/ui-design-brain/patterns-manifest.json`
- `skills/ui-design-brain/patterns/textarea.md`
