## Carousel

**Also known as:** Content slider

A component that cycles through multiple content slides, navigable via swipe, scroll, or button controls.

A strip that scrolls continuously and loops on its own is a **Marquee** (see `marquee.md`) — a Carousel steps through discrete slides, a Marquee moves continuously. Each repeating module inside a Carousel is a **Slide** — a child of this pattern, not a separate catalog entry.

**Best practices:**
- Provide visible navigation arrows and pagination dots
- Support swipe gestures on touch devices
- Auto-advance only if the user hasn't interacted; pause on hover/focus
- Show a peek of the next slide to signal scrollability
- Keep slide count manageable (3–7) — carousels with many slides have low engagement
- Ensure accessibility: each slide should be reachable via keyboard

**Common layouts:**
- Hero image slideshow on a marketing homepage
- Product image gallery on a detail page
- Testimonial carousel with quote, author, and avatar
- Horizontal scrolling feature highlights in a mobile app

---
