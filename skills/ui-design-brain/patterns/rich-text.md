## Rich text

**Also known as:** Rich text block  ·  Rich text field

A read-only region that renders already-authored formatted content — headings, paragraphs, lists, links, and inline media — as one flowing block styled by the design system, not a surface for composing it.

For an in-page surface where a person *authors* formatted content, use a **Rich text editor** (see `rich-text-editor.md`) — that is the editing tool; this is the render of its output. For a single set-apart quotation, use a **Quote** (see `quote.md`).

**Best practices:**
- Reach for Rich text when a block of authored or CMS-sourced HTML must be displayed as flowing content; style it with element-scoped rules and inter-block rhythm so any well-formed markup renders without per-field classes.
- Render authored headings as real heading elements at the level their position in the page outline requires, and never skip a level — the region itself takes no implicit landmark role and needs no `region`/`aria-label` of its own.
- Keep authored link text as the accessible name; a bare email or phone number is acceptable link text because it is exactly the destination.
- Treat decorative list markers (e.g. checkmark bullets) as `aria-hidden` while the list stays a real `ul`/`li`, so the structure survives for assistive technology.
- Constrain the reading measure for legibility and let embedded media or callouts break out of it, rather than stretching body copy to the full container.
- Scope which blocks may be inserted inline (image, media-with-caption, call-to-action) through an explicit allowlist rather than widening the picker per placement, and treat the authored HTML as untrusted — escape or sanitize before render.

**Common layouts:**
- The body of an article, news post, or policy page.
- A content block dropped into a page-builder column beside other blocks.
- The authored copy inside a card or side panel (a contacts or summary panel).
- A documentation or help region driven from a CMS or markdown source.

---
