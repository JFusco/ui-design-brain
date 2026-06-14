---
name: ui-design-brain
description: Canonical catalog of production-grade UI component patterns (per-pattern guidance, a manifest of canonical names and aliases, and an index). Consult before naming or building any UI primitive — accordion, modal, dropdown, form, navigation, table, toast, tabs, and more — to resolve a design label to one canonical component and load its pattern guidance. Use when writing a component spec or acceptance criteria, or when generating interface code, so spec, AC, and implementation share the same component vocabulary instead of guessing.
---

# Skill: ui-design-brain

The canonical catalog of UI component patterns shared across Verndale AI tooling. Use it to resolve any design label to one canonical component name and to ground naming and accessibility decisions — whether you are writing a component spec or acceptance criteria, or generating interface code. It replaces generic UI guesses with named, inspectable patterns so spec, AC, and implementation share one vocabulary.

## Use when

- Naming a UI primitive or component element (in a spec, in acceptance criteria, or in code).
- You need a grounded component pattern or accessibility guidance before producing output.
- The repo does not already provide a stronger local design-system precedent.

## First-hop references

1. `index.md` — the canonical component list and lookup procedure.
2. `patterns-manifest.json` — authoritative canonical names, aliases, and pattern-file pointers.
3. The exact file(s) under `patterns/` that match the component.

## Workflow

1. Identify the component families involved in the request.
2. Read `index.md` to narrow the relevant catalog entries.
3. Resolve each design label through `patterns-manifest.json` — match on `name` first, then on `aliases` (plain-string aliases by name, object aliases by name + context). If it does not resolve, treat the label as novel rather than guessing.
4. Load only the matching `patterns/<slug>.md` file(s) — never the whole `patterns/` directory.
5. Apply the canonical name and the pattern's guidance, while still respecting any stronger existing design system or token surface.

## Inputs and outputs

- No parameter block; the skill is consulted whenever UI components are named or built.
- Effects: improves component naming, accessibility decisions, and pattern choices. Writes no files by itself.

## Guardrails

- MUST preserve an existing repo design system when one is stronger.
- MUST inspect the repo's token surface before introducing styling decisions.
- MUST NOT use generic defaults — especially tokenless arbitrary values and interchangeable SaaS layouts.
- MUST resolve every design label through the manifest before treating it as novel.
