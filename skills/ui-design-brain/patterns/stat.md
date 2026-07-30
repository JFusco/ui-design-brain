## Stat

A compact display of a single quantitative value with a short describing label — a large figure ("98%", "10×", "24/7", "#1") paired with the phrase that gives it meaning, and optionally a supporting sentence or icon.

For a value that tracks progress toward a goal, use a **Progress indicator** (see `progress-indicator.md`); for the card container a stat often sits in, use a **Card** (see `card.md`).

**Best practices:**
- Reach for a Stat when the content is a standalone figure meant to be read at a glance — not a value in a running series and not a measure of progress.
- Keep the value as free-form text; real stats are "98%", "10×", "24/7", "#1", not just integers, so never parse the authored string into a number-plus-suffix or reformat it.
- Pair every value with a short label — the figure alone is not self-describing, and the label carries the meaning for every reader.
- When several stats sit together, equalize them to a shared row or grid and let each grow to its content rather than clipping; a stat that truncates loses its point.
- Give a group of stats an accessible name and expose each pair in reading order value-then-label; when the visible design has no group heading, supply one that is visually hidden and associate the list with it via `aria-labelledby`.
- Treat a decorative figure icon as `aria-hidden` unless it carries meaning the label does not.

**Common layouts:**
- A row of two to four stats beneath a section heading on a marketing page ("by the numbers").
- A single outsized stat as a full-width emphasis band between content sections.
- A stat paired with an icon and a sentence of context inside a card in a feature grid.
- A compact stat strip in a dashboard or report summary header.

---
