## Sidebar

**Also known as:** Collapsible sidebar  ·  Side navigation  ·  Sidebar navigation

A persistent vertical panel along the side of the viewport that holds primary navigation and app-level controls.

A Sidebar is the persistent container; the links inside it are the **Navigation** pattern (see `navigation.md`). It differs from a **Drawer** (see `drawer.md`), which slides in over content for a temporary task and is dismissed — a Sidebar stays put (often collapsing to icons rather than disappearing).

**Best practices:**
- Use a `<nav>` landmark with an `aria-label` ('Primary') for the navigation it contains
- Mark the current destination with `aria-current="page"`
- Make it collapsible; persist the collapsed/expanded state and keep labels reachable (tooltip or accessible name when icon-only)
- Below a chosen breakpoint, collapse to a Drawer or hamburger-triggered overlay rather than crushing content
- Keep a visible focus ring and logical Tab order through items and groups
- Don't trap focus — a persistent Sidebar is not modal

**Common layouts:**
- Dashboard/admin shell with icon + label nav and a collapse toggle
- Documentation site with a nested section tree
- Settings layout with section links on the left and content on the right
- Mail/chat app with folders or channels in a collapsible rail

---
