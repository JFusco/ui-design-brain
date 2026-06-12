## Tabs

**Also known as:** Content tabs  ·  Section tabs  ·  Tabbed interface  ·  Tabset

A set of selectable labels that switch between content panels, keeping the layout compact.

For a compact 2–5 option switch styled as one control, use a **Segmented control** (see `segmented-control.md`).

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
