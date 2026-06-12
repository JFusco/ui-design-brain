## Stepper

**Also known as:** Counter  ·  Nudger  ·  Quantity

A numeric input with increment and decrement buttons for adjusting a value.

This Stepper is the numeric +/- input control. For a multi-step progress tracker (also called a stepper), see **Progress indicator** (`progress-indicator.md`); for a numeric text field with min/max/step, see **Number input** (`number-input.md`).

**Best practices:**
- Use clear +/- buttons with adequate touch targets
- Allow direct number entry in addition to button interaction
- Set sensible min, max, and step values
- Disable the relevant button when at min or max value
- Expose `role="spinbutton"` with `aria-valuenow`/`aria-valuemin`/`aria-valuemax`, support Up/Down arrows, and label the +/− buttons

**Common layouts:**
- Quantity selector in an e-commerce cart
- Number input for seat count in a booking flow
- Portion size adjuster in a recipe app

---
