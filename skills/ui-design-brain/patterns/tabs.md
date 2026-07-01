## Tabs

**Also known as:** Content tabs  ·  Section tabs  ·  Tabbed interface  ·  Tabset

A set of selectable labels that switch between content panels, keeping the layout compact.

For a compact 2–5 option switch styled as one control, use a **Segmented control** (see `segmented-control.md`).

**Visual variants (orthogonal to ARIA):**

The tabs ARIA pattern (`role="tablist"`/`role="tab"`, `aria-selected`, roving-tabindex) is the same regardless of how the tab strip looks. The visual style is a separate axis:

- **underline** — labels with an active bottom-border indicator (the default).
- **pill** — each label is a rounded pill; the active pill is filled. A pill-styled filter/category toolbar is Tabs with `variant: pill`, not a Button group or a Segmented control.
- **segmented-look** — labels share one bordered container with a sliding/segmented active background, while still switching content panels.

Resolve a pill-styled or segmented-looking content switcher to **Tabs** plus the matching visual variant — do not pick a different canonical, and do not restyle to underline because the widget "behaves like tabs". Choose **Segmented control** or **Button group** only when the control is genuinely not a tabbed content switcher (no `tabpanel` content swap), per their pattern files.

**Best practices:**
- Limit to 2–7 tabs; more options need a scrollable tab bar or dropdown overflow
- Clearly indicate the active tab with a bottom border, background fill, or bold text
- Use short, descriptive tab labels (1–2 words)
- Place tab content immediately below the tab bar with no visual gap
- Support keyboard navigation: arrow keys between tabs, Tab to content
- Consider swapping tabs for an accordion on narrow viewports
- Use the tabs ARIA pattern: `role="tablist"`/`role="tab"` with `aria-selected` and `aria-controls`, roving-tabindex arrow-key navigation, and `role="tabpanel"` linked via `aria-labelledby`

**Common layouts:**
- Product page with Description, Reviews, and Specifications tabs
- Settings page with General, Security, Notifications sections
- Profile page with Activity, Projects, and Settings tabs
- Dashboard with different report views (Overview, Analytics, Logs)

---
