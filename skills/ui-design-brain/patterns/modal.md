## Modal

**Also known as:** Dialog  ·  Modal window  ·  Popup

An overlay that demands the user's attention — interaction is required before returning to the content beneath.

For a non-blocking panel that slides in from an edge for a secondary task, use a **Drawer** (see `drawer.md`).

**Best practices:**
- Use modals sparingly — only for actions that require immediate attention or focused input
- Always provide a clear close mechanism: X button, Cancel, and Escape key
- Trap focus within the modal while it's open for accessibility
- Return focus to the trigger element when the modal closes
- Keep modal content concise — if it needs scrolling, consider a full page instead
- Use a semi-transparent backdrop to dim the underlying content

**Common layouts:**
- Confirmation dialog with message and two action buttons
- Form modal for quick data entry (create, edit)
- Image/media preview lightbox
- Onboarding or announcement modal with illustration and CTA

---
