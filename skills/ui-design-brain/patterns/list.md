## List

**Also known as:** List view

A component that groups related items into an ordered or unordered sequence.

For multi-column data with sortable or filterable columns, use a **Table** (see `table.md`); a List is for flat, single-column sequences.

**Best practices:**
- Use consistent vertical rhythm — equal spacing between list items
- For interactive lists, ensure each row has a clear hover and active state
- Include dividers between items in dense lists; omit them in spacious ones
- Support keyboard navigation when the list is interactive
- Use virtualization (windowing) for lists exceeding ~100 items
- For an interactive list use `role="listbox"`/`role="option"` with `aria-selected` (or `role="list"`/`role="listitem"` when static), arrow-key movement, and a visible focus ring

**Common layouts:**
- Email inbox with sender, subject, preview, and timestamp per row
- Settings list with label, value/toggle, and optional chevron
- Activity feed with avatar, description, and relative timestamp
- File list with icon, name, and size per row

---
