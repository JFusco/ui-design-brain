## Error message

**Also known as:** Field error  ·  Inline error  ·  Validation message

Inline validation feedback tied to a single form field, shown when its value is invalid.

An Error message is field-level and bound to a control's validation state — unlike an **Alert** (see `alert.md`), which carries a page- or section-level message. It often occupies the same slot as the field's **Helper text** (see `helper-text.md`), replacing or supplementing it while the error is active.

**Best practices:**
- Be specific and actionable ('Enter a valid email like name@example.com'), not 'Invalid'
- Place it adjacent to the field it describes, directly below the input
- Set `aria-invalid="true"` on the field and link the message with `aria-describedby`
- Announce it with an `aria-live="polite"` (or assertive on submit) region so it is not missed
- Pair color with an icon and text — never signal an error with color alone
- Validate on blur or submit, not on every keystroke; clear the error once corrected

**Common layouts:**
- Single-line error below an invalid text or number field
- Summary of errors at the top of a long form, each linking to its field
- Inline error with a warning icon beside a checkout field
- Password-strength error below a sign-up field

---
