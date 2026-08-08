## Mega menu

**Also known as:** Header mega menu  ·  Mega menu panel

A large, full-width disclosure panel opened from a top-level navigation item, presenting a site's sections as several columns of grouped links — often with headings, short descriptions, or a featured tile — with its own open/close, focus, and motion behavior, distinct from the compact bar it drops from.

For the compact site-navigation bar itself, use **Navigation** (see `navigation.md`). For a small single-column menu of actions or links, use a **Dropdown menu** (see `dropdown-menu.md`). For the off-canvas mobile navigation this panel usually collapses into, use a **Drawer** (see `drawer.md`).

**Best practices:**
- Use for a large, grouped navigation surface — multiple columns of links under headings; a small single-column list is a Dropdown menu, not this.
- Open it from a top-level nav item and pair the trigger with `aria-expanded` and `aria-controls` pointing at the panel; the panel takes its accessible name from that trigger.
- Manage focus: move focus into the panel when it opens, keep it within while open, return it to the trigger on close, and close on Escape.
- Treat the contents as a set of links navigable with Tab / Shift-Tab rather than a `menu` / `menuitem` widget, unless you implement the full menu keyboard model.
- On touch and small viewports, collapse into a Drawer or accordion rather than a hover-reveal panel, and never hide a critical task behind hover alone — give a click/tap path and a visible close control.
- Keep each column scannable — a heading plus a short list; push long or promotional content into a single featured tile rather than dense prose.

**Common layouts:**
- A header primary-nav panel: several columns of section links under bold headings, with an optional promoted card or CTA in the last column.
- A products or solutions panel grouping offerings by category with a one-line description each.
- A resources panel mixing link columns with a featured article or media tile.
- A two-tier panel where selecting a left-rail category swaps the right-side link set.

---
