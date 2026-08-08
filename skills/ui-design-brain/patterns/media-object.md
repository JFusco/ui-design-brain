## Media object

**Also known as:** Media block

A full-width content band that pairs a block of text — eyebrow, heading, rich text, and a call to action — with a single piece of media (image or video) beside it, the two columns alternating left and right down the page.

For a self-contained entity tile in a grid, use a **Card** (see `card.md`). For the promotional image-and-headline banner at the top of a page, use a **Hero** (see `hero.md`). For a heading-and-intro that opens a section without paired media, use a **Section header** (see `section-header.md`).

**Best practices:**
- Carry one scannable idea per band — a single heading, a short rich-text block, and one primary CTA; a dense grid of items is a Card layout, not this.
- Alternate the media's side between consecutive bands to build vertical rhythm; keep the orientation consistent within a band across breakpoints.
- Stack to a single column on narrow viewports and keep the DOM order media-then-text so the reading order a screen reader announces matches the visual order.
- Wrap the media in a `<figure>`; give a purely decorative image an empty `alt`, and when the media is informative let its `alt` or `<figcaption>` carry the meaning rather than leaning on the adjacent heading.
- Constrain the media to a fixed aspect ratio so successive bands align down the page and the layout does not shift as images load.
- Keep it presentational — a band whose items come from a CMS collection or a recommendation query is a composition of this plus its data source, resolved to its parts.

**Common layouts:**
- A marketing feature band: eyebrow, headline, paragraph, and CTA beside a product image.
- Alternating "how it works" sections down a landing page, the media switching sides each row.
- A full-width video band: a click-to-play video beside supporting copy.
- An image band carrying an overlaid or adjacent pull-quote — a decorative treatment of the same structure.

---
