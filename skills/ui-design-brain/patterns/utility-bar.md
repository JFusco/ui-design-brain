## Utility bar

**Also known as:** Floating utility bar

A fixed-position cluster of global utility actions that persists as the user scrolls — secondary, page-level controls (scroll-to-top, help or chat, print, share) grouped in one persistent affordance.

For a page's primary content actions inside the layout flow, use a **Button group** (see `button-group.md`); for a single always-present action, a lone floating **Button** (see `button.md`) is enough — a Utility bar earns its own name only when it clusters several persistent utilities.

**Best practices:**
- Use it for genuinely global, secondary actions available anywhere on the page — not primary CTAs, which belong in the content
- Pin it to a consistent viewport edge or corner and keep it out of the way of primary content and other fixed chrome
- Expose it as a labelled landmark or toolbar (`role="toolbar"` with an `aria-label`, or a `<nav aria-label>` when the items navigate) so assistive tech can find and skip it, and support arrow-key roving focus across the grouped controls
- Give every icon-only control a visible-on-focus label or `aria-label` — persistent utility icons are the most commonly unlabelled controls on a page
- Keep the cluster small (two to four actions); a growing bar is a sign these belong in the header or footer
- Respect reduced-motion and safe-area insets so the bar does not cover system UI on mobile

**Common layouts:**
- A lower-corner vertical stack of icon buttons (scroll-to-top plus a help/chat launcher)
- A bottom-edge horizontal strip of page utilities on mobile
- A right-rail vertical bar of share/print/save actions on long-form content
- A collapsed single button that expands to reveal the cluster on interaction

---
