## Table

A structured grid of rows and columns for displaying data — often called a data table when it supports sorting and filtering.

For a flat, single-column sequence without column operations, use a **List** (see `list.md`).

**Best practices:**
- Use a sticky header row for scrollable tables
- Right-align numeric columns for easy comparison
- Provide sortable column headers with clear sort direction indicators
- Alternate row colors (zebra striping) or use horizontal dividers for readability
- Include a bulk-select checkbox column for actionable tables
- Make tables horizontally scrollable on mobile rather than hiding columns
- Use real `<table>` semantics — `<th>` with `scope`, a `<caption>`, and `aria-sort` on sortable headers — so screen readers can navigate rows and columns

**Common layouts:**
- Admin data table with search, filters, sort, pagination, and row actions
- Pricing comparison table with feature rows and plan columns
- Financial ledger with date, description, amount, and running balance
- Leaderboard table with rank, name, avatar, and score

---
