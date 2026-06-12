## Spinner

**Also known as:** Loader  ·  Loading

An animated indicator showing that a background process is running and the interface isn't yet interactive.

**Best practices:**
- Show spinners only after a delay (~300 ms) to avoid flicker on fast responses
- Size the spinner proportionally to the context: inline (16 px), button (20 px), page (40+ px)
- Use a single brand-consistent spinner design throughout the app
- Provide an aria-label or sr-only text for screen readers ('Loading…')
- Prefer skeleton screens over spinners when the layout is predictable

**Common layouts:**
- Centered full-page spinner during initial app load
- Inline spinner inside a button during form submission
- Small spinner beside a table cell during lazy-loaded data fetch
- Overlay spinner on a card while its content refreshes

---
