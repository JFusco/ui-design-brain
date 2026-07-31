## Section header

**Also known as:** Heading with description  ·  Section intro

An intro block that opens a page section — an optional eyebrow above a heading, with a supporting description and optional actions — grouped and aligned as one unit.

This is a section-level intro, not a page masthead: for the top-of-page promotional area use a **Hero** (see `hero.md`); for the site's global top chrome use a **Masthead** (see `masthead.md`). The parts are also catalog primitives on their own — see **Eyebrow** (`eyebrow.md`) and **Heading** (`heading.md`) — the section header is the pattern that composes them.

**Best practices:**
- Reach for a Section header to introduce a content section on an interior page; reach for Hero only when it is the top-of-page promotional band.
- Render the heading as a real heading element at the level its position in the outline requires — a repeating section header owns an `h2`, never the page's single `h1`, which belongs to the hero or page title.
- Treat the eyebrow as a short visual accent (`p`), not a heading — it must not create a phantom level in the document outline or be read as the section's title.
- Collapse each optional part cleanly when unauthored: no reserved space or placeholder for a missing eyebrow or description.
- Apply alignment (start or center) to the eyebrow, heading, and description together as one group, rather than per part, so the block reads as a unit.
- When the description carries inline links or the header carries actions, they follow the Link and Button patterns for focus-visible and keyboard behavior; the header adds no override of its own.

**Common layouts:**
- A left-aligned eyebrow + heading + description opening a content section on a marketing page.
- A centered section intro above a grid of cards or stats ("by the numbers").
- A section header with a trailing "view all" action aligned to the heading row.
- A compact heading + description with no eyebrow, introducing a form or panel.

---
