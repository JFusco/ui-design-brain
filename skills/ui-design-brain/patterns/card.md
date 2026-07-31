## Card

**Also known as:** Content tile  ·  Generic card  ·  Tile

A self-contained content block representing a single entity such as a contact, article, or task.

**Best practices:**
- Use a single, clear visual hierarchy within each card: media → title → meta → action
- Keep cards a consistent height in grid layouts — use line clamping for variable text
- When the whole card navigates to one place, anchor the link on the title and stretch it to overlay the card — don't wrap the whole card in one block-level link, which a screen reader reads as a single exhausting link (eyebrow, image, heading, and body run together)
- Keep that link's accessible name equal to the visible title — never a summarizing aria-label that replaces it; raise nested actions (a tag, a Save button) above the overlay so they stay clickable, and use the stretch only when one destination is clearly primary — when several are co-equal, keep discrete links instead
- Use subtle elevation (shadow) or a border — not both simultaneously
- Limit card content to essential info; let the detail page carry the rest

**Common layouts:**
- Product grid with image, title, price, and CTA
- Blog post feed with thumbnail, headline, excerpt, and date
- Dashboard KPI cards with metric, delta, and sparkline
- Team member directory with avatar, name, and role

---
