# Pattern file structure — section reference

> **Authoring artifact. NOT loaded at runtime, NOT vendored.** Documents the canonical
> `patterns/<slug>.md` structure every pattern in this catalog follows, so new patterns stay
> consistent. `_meta/` is a non-skill directory (sibling of `skills/ui-design-brain/`,
> underscore-prefixed) — skill discovery keys on `SKILL.md`, and the `skills` CLI vendors only the
> named skill, so nothing here loads at runtime or ships to consumers. To add a pattern, copy
> [`_pattern-template.md`](_pattern-template.md) to `skills/ui-design-brain/patterns/<slug>.md`.
>
> Pairs with the repo [`CLAUDE.md`](../../CLAUDE.md): this file owns the **pattern-file section
> structure**; `CLAUDE.md` owns the **catalog-integrity checklist** (manifest + index + README
> count) and the skill-authoring best-practices rule.

## Canonical structure

A pattern file is short (~20–30 lines; none needs a table of contents) and uses these parts in order:

1. `## <Canonical name>` — H2 title (not `#`), matching the manifest `name` exactly.
2. `**Also known as:** …` — alias line *(omit entirely when the pattern has no aliases, e.g. `table.md`)*.
3. One-sentence definition.
4. Cross-reference line(s) *(optional — only for confusable patterns)*.
5. `**Best practices:**` — ~6 bullets.
6. `**Common layouts:**` — ~4 bullets.
7. `---` — closing horizontal rule.

## Sections

### Title — `## <Canonical name>`
H2, not H1. Matches the manifest `name` verbatim; slug == kebab(name) == filename.

### Also known as
Aliases separated by `·` with two spaces each side, in the **same order as the manifest** entry's
`aliases`. Omit the whole line when there are none. The four context-scoped aliases (**Banner**,
**CTA**, **Label**, **Stepper**) take a short parenthetical so intent is unambiguous, e.g.
`CTA (in-page action)` vs `CTA (navigates)`.

### Definition
One crisp sentence (em-dash elaboration common). Assume the reader knows general UI concepts.

### Cross-references (optional)
Confusable patterns point at each other with a bold component name + a "see `other.md`" pointer.
Keep the pointer **bidirectional** (add the reverse in the other file).

### Best practices
~6 bullets: when to use, key design/behaviour choices, state/interaction, and **at least one
accessibility/keyboard** bullet.

### Common layouts
~4 bullets: concrete real-world placements.

## Conventions (hard constraints)
- Title is `##`; the file ends with a `---` rule.
- Aliases in manifest order; omit the line when none.
- Cross-references are bidirectional.
- Always include ≥1 accessibility/keyboard bullet in **Best practices**.
- Consistent terminology; forward slashes; no time-sensitive phrasing.
- After creating the file, complete the catalog-integrity sync (manifest + `index.md` + README
  count) — see [`../../CLAUDE.md`](../../CLAUDE.md) "Catalog integrity".
