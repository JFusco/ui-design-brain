## Context menu

**Also known as:** Contextual menu  ·  Long-press menu  ·  Right-click menu

A menu of context-specific actions revealed by right-click (desktop) or long-press (touch) on a target element.

A Context menu is summoned by the user on an object and positioned at the pointer — unlike a **Dropdown menu** (see `dropdown-menu.md`), which hangs off a visible trigger button (including a kebab/overflow icon) and is the better choice when the actions need a discoverable, always-visible affordance.

**Best practices:**
- Always also expose the same actions through a visible control — a right-click-only action is undiscoverable
- Open at the pointer/long-press point; flip to stay within the viewport
- Keep it short; group with separators and put destructive actions last, styled distinctly
- Use the menu ARIA pattern: `role="menu"` / `role="menuitem"`, arrow-key navigation, Enter to activate, Escape to close
- Return focus to the triggering element on close; dismiss on outside click or scroll
- Suppress the native browser menu only where you fully replace it

**Common layouts:**
- Right-click on a table row (Edit, Duplicate, Delete)
- Long-press on a list item or card on mobile
- Canvas/file-browser actions (Rename, Move, Download)
- Text-selection actions in an editor (Cut, Copy, Comment)

---
