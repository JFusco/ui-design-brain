## Logo bar

**Also known as:** Logo cloud  ·  Logo wall  ·  Logos bar  ·  LogosGrid  ·  Partner logos

A full-width band that presents a row of partner, customer, or certification logos as social proof — often auto-scrolling — with the logos themselves non-interactive.

For a scrolling row of *textual* announcements, use a **Marquee** (see `marquee.md`). For a promotional top-of-page area, use a **Hero** (see `hero.md`).

**Best practices:**
- Use for a trust/social-proof strip of brand logos, not for navigation — the logos are presentational, not links.
- Present the logos as a list of images, each with meaningful `alt` text; mark purely decorative framing `aria-hidden`.
- When the row auto-scrolls, provide an always-visible pause/play control and pause on hover and focus — auto-moving content must be pausable (WCAG 2.2.2 Pause, Stop, Hide).
- Keep the logo track non-focusable and non-interactive; do not attach per-logo click or keyboard behavior.
- Any static aggregate panel (a rating, a customer count) stays separate from the moving track so its content is stable while logos scroll.
- Theme via semantic tokens (light/dark surfaces), never hardcoded brand colors.

**Common layouts:**
- A full-width band directly below the hero as first-screen social proof.
- Static highlight panel beside the logo track on desktop, stacked above it on mobile.
- A partner/customer strip between content sections.
- A trust bar just above the footer.

---
