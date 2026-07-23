---
date: 2026-07-23
topics: [component-catalog]
plan: none
pr: https://github.com/verndale/ui-design-brain/pull/15
---
# Fix stale Stepper canonical row in the context-scoped aliases table

## Why

- Adding the Wizard pattern (which owns the "Multi-step form" alias) left index.md's context-scoped aliases table still describing the Stepper canonical as a "multi-step form / wizard control".
- Wrong on two counts: the Stepper canonical is the numeric +/- quantity control (patterns/stepper.md), and "Multi-step form" now resolves to Wizard. The "Stepper" label never resolves to a wizard control.
- Logged as an Open thread on the component-catalog topic and a follow-up on the prior journal entry.

## What changed

- Reworded one table cell (index.md, the "Stepper (the canonical)" row) to "numeric +/- quantity control (the canonical)".
- Doc-only, one cell: no manifest change, no pattern-count change, no alias change. The Stepper → Progress indicator (progress context) row is untouched.
- Closed the topic Open thread and recorded a Decisions entry.

## Files

- skills/ui-design-brain/index.md
- wiki/topics/component-catalog.md

## Follow-ups

- Tracking: issue #14 (https://github.com/verndale/ui-design-brain/issues/14)
