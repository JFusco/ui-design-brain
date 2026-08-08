## Marquee

**Also known as:** News ticker  ·  Ticker

A strip of content that scrolls continuously and loops automatically — logos, headlines, or announcements moving without user paging.

For discrete slides the user advances one at a time, use a **Carousel** (see `carousel.md`) — a Marquee moves continuously, a Carousel steps. A static, non-moving page-level announcement is an **Alert** (see `alert.md`). A band of brand or partner logos presented as social proof — scrolling or static — is a **Logo bar** (see `logo-bar.md`).

**Best practices:**
- Use only for ambient, supplementary content — never as the sole access path to essential information
- Build the seamless loop by duplicating the content and marking the duplicate `aria-hidden="true"` so it is not announced twice
- Keep the scroll speed slow and steady, and pause on hover and on focus
- Provide a visible pause/stop control — motion that starts automatically and lasts more than five seconds must be pausable (WCAG 2.2.2)
- Honor `prefers-reduced-motion`: render a static or manually scrollable fallback instead of auto-scrolling
- Avoid interactive items in the moving strip; if it must contain links, motion has to pause while any of them holds focus

**Common layouts:**
- Logo-wall marquee of partner or client brands
- News or announcement ticker under the site header
- Stock or score ticker on a dashboard
- Repeating brand-statement band between page sections

---
