## Button group

**Also known as:** Toolbar

A container that groups related buttons together as a single visual unit.

For a set of mutually exclusive options where only one is selected, use a **Segmented control** (see `segmented-control.md`).

**Best practices:**
- Group only related actions — unrelated buttons should be separated
- Visually connect buttons with shared border or tight spacing (1–2 px gap)
- Clearly indicate the active/selected state in toggle-style groups
- Keep the group to 2–5 buttons; more options warrant a dropdown or overflow menu
- Wrap the buttons in `role="group"` with an `aria-label`; for toggle-style groups, reflect state with `aria-pressed`

**Common layouts:**
- Text editor toolbar (bold, italic, underline)
- View switcher (grid view, list view)
- Segmented date range selector (Day, Week, Month)
- Split button with primary action and a dropdown for alternatives

---
