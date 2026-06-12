## Tooltip

**Also known as:** Toggletip

A small floating label that reveals supplementary information about an element, typically on hover.

For content with interactive elements (links, buttons) or that persists until dismissed, use a **Popover** (see `popover.md`) — or a click-triggered toggletip.

**Best practices:**
- Use tooltips for supplementary info — never for essential content
- Trigger on hover (desktop) and long-press (mobile); avoid click-to-show
- Show after a short delay (~300 ms) and hide on mouse leave
- Keep tooltip text to a single sentence or a few words
- Position to avoid obscuring the trigger element or important content
- Use a toggletip (click-triggered) when the content includes interactive elements
- Give it `role="tooltip"` and link it from the trigger with `aria-describedby`; make it dismissible with Escape and reachable on keyboard focus, not hover alone

**Common layouts:**
- Icon button tooltip showing the action name
- Truncated text tooltip revealing the full string on hover
- Info icon tooltip explaining a form field's purpose
- Chart data point tooltip showing exact values

---
