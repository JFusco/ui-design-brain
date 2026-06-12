## Toast

**Also known as:** Snackbar

A brief, non-blocking notification that appears in a floating layer above the interface.

For a persistent message that stays until dismissed or the condition clears, use an **Alert** (see `alert.md`).

**Best practices:**
- Auto-dismiss after 4–6 seconds for non-critical toasts
- Allow manual dismissal with a close button or swipe
- Stack multiple toasts with the newest on top
- Position in a consistent corner — bottom-right is most common for desktop
- Include an action link for undoable operations ('Undo' for delete)
- Limit to one line of text — toasts are for brief confirmations
- Render toasts in an `aria-live="polite"` region (assertive for errors) so they are announced without stealing focus

**Common layouts:**
- Success toast after saving a form ('Changes saved')
- Error toast with retry action after a failed request
- Undo toast after deleting an item ('Item deleted. Undo')
- Notification toast with avatar and brief message preview

---
