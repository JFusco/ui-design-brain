## Helper text

**Also known as:** Field hint  ·  Hint text  ·  Supporting text

A short, persistent line of guidance shown with a form field to explain its purpose, format, or constraints.

Helper text is neutral guidance that is always visible — it is not the field's name (use a **Label**, see `label.md`) and it is not validation feedback (use an **Error message**, see `error-message.md`, which replaces or supplements helper text when the field is invalid).

**Best practices:**
- Keep it to one short sentence; state the rule positively ('Use 8 or more characters')
- Place it directly below the field (or below the label) so the association is obvious
- Associate it programmatically with `aria-describedby` so screen readers announce it
- Use a muted but accessible color — do not rely on color alone to distinguish it
- Reserve space for it (or for an error in the same slot) to avoid layout shift
- Don't restate the label or duplicate the placeholder

**Common layouts:**
- Format hint below a date or phone field ('MM/DD/YYYY')
- Password requirements below a password field
- Character or word guidance below a textarea
- Privacy reassurance below an email field ('We'll never share this')

---
