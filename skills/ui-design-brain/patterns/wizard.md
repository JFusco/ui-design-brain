## Wizard

**Also known as:** Multi-step form

A flow that splits one long task into ordered steps with explicit Back/Next navigation, collecting input across screens before a final review and submit.

The step display inside a wizard is a **Progress indicator** (see `progress-indicator.md`). Note the name collision: the numeric +/- quantity control is a **Stepper** (see `stepper.md`), not a step flow.

**Best practices:**
- Scope each step to a single task or decision
- Show the user's position with a **Progress indicator** ("Step X of Y")
- Preserve entered data when the user goes Back — never clear a completed step
- Validate each step as the user leaves it, not all at once at the end
- Include a review step that summarizes all input before the final submit
- On each step change, move focus to the step heading and announce "Step X of Y" via a live region (`aria-live="polite"` or `role="status"`)

**Common layouts:**
- Checkout flow (cart → shipping → payment → confirmation)
- Onboarding or account-setup flow
- Multi-section application form
- Product configurator

---
