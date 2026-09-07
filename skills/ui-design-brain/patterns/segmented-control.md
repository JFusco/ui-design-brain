## Segmented control

**Also known as:** Segmented Radio Group  ·  Segmented toggle  ·  Toggle button group

A compact row of mutually exclusive options — a hybrid of button groups, radio buttons, and tabs for switching views.

For grouping independent actions (not a single selection), use a **Button group** (see `button-group.md`); for many options or full content panels, use **Tabs** (see `tabs.md`).

**Best practices:**
- Limit to 2–5 segments — more options warrant tabs or a dropdown
- Use equal-width segments for visual balance
- Animate the selection indicator sliding between options
- Ensure the selected state has strong contrast against unselected
- Use sentence case for segment labels
- Expose it as a `role="radiogroup"` of `role="radio"` segments (or a group of `aria-pressed` buttons); move selection with arrow keys and keep a visible focus ring

**Common layouts:**
- Map/list/grid view switcher
- Billing period toggle (Monthly / Annually)
- Light/dark mode toggle in settings
- Chart type selector (Line, Bar, Pie)

---
