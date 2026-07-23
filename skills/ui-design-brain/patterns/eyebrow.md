## Eyebrow

**Also known as:** Kicker  ·  Overline

A short text label displayed directly above a heading — categorizing or framing the content it introduces.

The title itself is a **Heading** (see `heading.md`), not an eyebrow; a pill or tag-styled category marker is a **Badge** (see `badge.md`).

**Best practices:**
- Keep it to one to four words — it frames the heading, it is not a sentence
- Style it distinctly from the heading: smaller, letter-spaced or uppercase, in a muted or accent color
- Apply uppercase via CSS `text-transform`, keeping the source text in normal case so it stays legible to screen readers and search
- Mark it up as plain text (`p`/`span`), never a heading element — it must not enter the document outline or compete with the real heading
- Keep the eyebrow out of the section's accessible name — the heading alone names the section, so never chain the eyebrow's id into the heading's `aria-labelledby`
- Ensure the muted eyebrow text still meets WCAG AA contrast; when it is a category link, use a **Link** with a visible focus style

**Common layouts:**
- Category eyebrow above the title on a blog or article card
- Section eyebrow above an h2 in a marketing content band
- Kicker above a hero headline
- Date or topic eyebrow on news-listing items

---
