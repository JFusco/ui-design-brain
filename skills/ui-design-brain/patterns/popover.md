## Popover

A floating panel that appears on click near its trigger element — unlike a **Tooltip** (see `tooltip.md`), it can contain interactive content.

**Best practices:**
- Trigger via click, not hover, to support touch devices and accessibility
- Position intelligently to avoid clipping at viewport edges
- Include a subtle arrow/caret pointing to the trigger element
- Dismiss when clicking outside or pressing Escape
- Keep popover content brief — it's not a modal
- Move focus into the popover on open and return it to the trigger on dismiss; it is non-modal, so do not trap focus

**Common layouts:**
- Color picker dropdown triggered by a swatch
- User profile preview card on avatar hover/click
- Quick-edit popover for inline data modification
- Help popover with rich content (text + link)

---
