## Comparison table

**Also known as:** Features comparison table

A matrix that compares several entities against a shared set of attributes — entities as columns, attributes as rows, and a boolean or short value in each cell.

For arbitrary tabular data with heterogeneous columns, use a **Table** (see `table.md`); for a single plan's price and CTA, use a **Card** (see `card.md`).

**Best practices:**
- Reach for it when the user's task is "which option includes what" — a fixed attribute set compared across a small number of options, not open-ended data
- Render a real `<table>` with `<th scope="col">` on the entity columns and `<th scope="row">` on the attribute rows, so each cell is announced with its row and column context
- Give every boolean cell a text equivalent ("Included" / "Not included") via visually-hidden text or `aria-label` — never a bare check/cross icon, which is silent to screen readers and ambiguous to colour-blind users
- Optionally emphasize one recommended column, but keep the emphasis to colour/weight plus a text marker, not colour alone
- Collapse gracefully on narrow viewports — a column selector that shows a two-entity subset beats a horizontally scrolling wall of columns
- Keep cell content terse and parallel across a row so the comparison scans vertically

**Common layouts:**
- Product versions or pricing plans as columns, features as rows, check/cross cells
- A highlighted "recommended" or "most popular" column
- Grouped rows with feature-category section headers spanning the row
- Mobile: a column-selector above the table comparing two entities at a time

---
