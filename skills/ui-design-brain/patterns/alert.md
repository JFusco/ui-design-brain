## Alert

**Also known as:** Banner (page message)  ·  Callout  ·  Feedback  ·  Inline notification  ·  Message  ·  Notification

A prominent message used to communicate important information or status changes to the user.

For a brief, auto-dismissing, non-blocking message, use a **Toast** (see `toast.md`). Here **Banner** means a page-level message; a top-of-page promotional banner is a **Hero** (see `hero.md`) — and a band named "message banner" or "CTA banner" that carries an image, a headline, and one or two CTAs is that promotional Hero, not an Alert, however the label reads. Alert is the dismissible notification or status message. A continuously scrolling announcement strip is a **Marquee** (see `marquee.md`).

**Best practices:**
- Use semantic color coding: red for errors, amber for warnings, green for success, blue for info
- Include a clear, actionable message — not just a status label
- Provide a dismiss action for non-critical alerts
- Position inline alerts close to the relevant content, not floating arbitrarily
- Use an icon alongside color to ensure accessibility for color-blind users
- Keep alert text to one or two sentences maximum

**Common layouts:**
- Top-of-page banner for system-wide announcements
- Inline form validation message beneath an input field
- Toast notification stack in the bottom-right corner
- Contextual warning inside a card or settings section

---
