---
date: 2026-09-17
topics: [component-catalog]
plan: none
pr: pending
issue: https://github.com/verndale/ui-design-brain/issues/64
issues: [https://github.com/verndale/ui-design-brain/issues/64]
---
# Add CheckboxField alias to Checkbox

## Why
- A completed implementation exposed a form-integrated Checkbox under this exact whole-component label.
- Label and validation composition do not create a separate canonical pattern.

## What changed
Added `CheckboxField` as a plain alias of Checkbox. The catalog remains at 80 patterns at this step.

## Files
- `skills/ui-design-brain/patterns-manifest.json`
- `skills/ui-design-brain/patterns/checkbox.md`
