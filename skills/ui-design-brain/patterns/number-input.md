## Number input

**Also known as:** Number field  ·  Numeric input  ·  Spinbutton

A text field constrained to numeric values, with optional stepper buttons, a min/max range, and a step increment.

A Number input is for typing an arbitrary number (price, age, percentage), with the keyboard as the primary affordance. For nudging a small count up or down with +/− buttons (cart quantity, guests), use a **Stepper** instead (see `stepper.md`); for non-numeric text, use a **Text input** (see `text-input.md`).

**Best practices:**
- Use `inputmode="numeric"` (or `decimal`) so mobile shows the number keypad
- Set `min`, `max`, and `step`; clamp or reject out-of-range values on blur
- Right-align the value when numbers are compared in a column
- Avoid `<input type="number">` for codes, phone numbers, or IDs — use Text input with a pattern instead
- Expose the spinner role to assistive tech: `role="spinbutton"` with `aria-valuenow`, `aria-valuemin`, `aria-valuemax`; support Up/Down arrows and Home/End
- Keep a visible focus ring and label the +/− buttons (`aria-label="Increase"` / `"Decrease"`)

**Common layouts:**
- Quantity field with stepper buttons in a cart line item
- Price or budget input with a currency prefix
- Percentage or weight field in a settings form
- Year or age field in a registration form

---
