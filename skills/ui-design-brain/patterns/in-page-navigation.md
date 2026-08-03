## In-page navigation

**Also known as:** Jumplinks  ·  On this page

A navigation bar of anchor links that jump to sections within the current page and track which section is in view — the "on this page" contents strip, distinct from site or section navigation.

For navigating between pages or site sections, use **Navigation** (see `navigation.md`); for the accessibility bypass link that skips to main content, use a **Skip link** (see `skip-link.md`); for a single hyperlink, use a **Link** (see `link.md`).

**Best practices:**
- Use when a long page has distinct, headed sections a reader will want to jump between; generate the items from the page's own headings so the two never drift.
- Mark the item for the section currently in view as active, and update it as the reader scrolls (scroll-spy) — do not require a click to change it.
- Render as a landmark: a `<nav>` with an accessible name such as `aria-label="On this page"`, and set `aria-current="true"` on the active item so assistive technology announces position.
- Keep every item keyboard-reachable in reading order (Tab to focus, Enter/Space to activate); moving focus to the target section on activation helps keyboard and screen-reader users.
- Collapse to a compact trigger that shows the active section label on small viewports, expanding to the full list on demand; respect reduced-motion for any scroll or expand animation.
- Anchor targets must be real, focusable headings on the page — never fabricate destinations the content does not have.

**Common layouts:**
- A sticky horizontal pill bar fixed to the bottom or top of the viewport on a long editorial or landing page.
- A left-rail "on this page" list on documentation and long-form article templates, sticky beside the content.
- A collapsed mobile trigger showing the current section, expanding to a drawer of all sections.
- A secondary strip directly beneath a page masthead on a detail page with several stacked content blocks.

---
