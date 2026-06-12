## Toggle

**Also known as:** Lightswitch  ·  Switch  ·  Toggle button

A binary switch control that toggles between two states — typically on and off.

A Toggle is a stateful on/off control whose change takes effect immediately. For a button that triggers a toggle *action* (for example show/hide a panel), use a **Button** (see `button.md`).

**Best practices:**
- Use for binary on/off settings that take effect immediately
- Label the toggle with what it controls, not 'On/Off'
- Show the current state visually (color, position) and with an optional text label
- Size the toggle to be easily tappable (44+ px wide)
- Avoid using toggles inside forms that require a Save action — use checkboxes instead
- Expose state with `aria-checked` (switch role) or `aria-pressed` (toggle button); toggle on Space/Enter and keep a visible focus ring

**Common layouts:**
- Settings row with label on the left and toggle on the right
- Dark mode toggle in a header or settings panel
- Feature flag toggles in an admin panel
- Notification preference toggles in a list

---
