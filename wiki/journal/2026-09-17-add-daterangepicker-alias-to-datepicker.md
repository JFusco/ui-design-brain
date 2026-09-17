---
date: 2026-09-17
topics: [component-catalog]
plan: none
pr: https://github.com/verndale/ui-design-brain/pull/65
issue: https://github.com/verndale/ui-design-brain/issues/64
issues: ["https://github.com/verndale/ui-design-brain/issues/64"]
---
# Add DateRangePicker alias to Datepicker

## Why
- The established Datepicker canonical already owns single and range selection.
- A completed implementation used `DateRangePicker` for that complete control, so a new pattern would duplicate established vocabulary.

## What changed
Added `DateRangePicker` as a plain alias beside the established Date Picker spelling. The catalog remains at 80 patterns at this step.

## Files
- `skills/ui-design-brain/patterns-manifest.json`
- `skills/ui-design-brain/patterns/datepicker.md`
