## Dropdown menu

**Also known as:** Kebab menu  ·  Overflow menu  ·  Select menu

A menu triggered by a button that reveals a list of actions or navigation options — unlike a select, it is not a form input.

Unlike a **Select** (see `select.md`), a Dropdown menu holds no value — use a Select to choose a value, a Dropdown menu to run actions. A menu summoned by right-click or long-press is a **Context menu** (see `context-menu.md`).

**Best practices:**
- Group related items with separators and optional group headings
- Support keyboard navigation: arrow keys to move, Enter to select, Escape to close
- Keep the menu to 7±2 items; use sub-menus or search for longer lists
- Position the menu to avoid viewport overflow — flip to top if near bottom edge
- Indicate destructive actions in red and place them last, separated
- Give the trigger `aria-haspopup="menu"` and `aria-expanded`, use `role="menu"`/`role="menuitem"`, and return focus to the trigger on close

**Common layouts:**
- User account menu in the top-right navigation
- Action menu on a kebab/overflow icon
- Action menu on a table row (Edit, Duplicate, Delete)
- Sort/filter dropdown in a toolbar

---
