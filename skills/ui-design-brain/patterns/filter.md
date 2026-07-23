## Filter

**Also known as:** Facet  ·  Faceted navigation  ·  Facets  ·  Filter panel  ·  Filters  ·  Refinements

A group of controls that narrows a list or search result set by attribute values — each facet exposing its options, typically with result counts.

Entering the query itself is the **Search input** pattern (see `search-input.md`); a Filter refines the result set a search or listing already returned. The value pickers inside a facet are standard form primitives — **Checkbox**, **Radio button**, **Select**, **Combobox**, **Slider** — and applied-filter chips are the **Badge** pattern.

**Best practices:**
- Show a result count next to each value, and hide or disable values that would return zero results
- Pick one application model — filters apply instantly, or apply on an explicit Apply — and use it consistently
- Surface applied filters as removable chips with a "Clear all" affordance
- Group facets into collapsible sections, with the most-used facets expanded by default
- Reflect filter state in the URL so a filtered view is shareable and back-button safe
- Give each facet a `fieldset`/`legend` (or a labeled `role="group"`), announce updated result counts through a live region, and fully manage focus when the filters open in a mobile drawer (the **Drawer** pattern)

**Common layouts:**
- Left-rail facets beside a product grid
- Horizontal filter bar above search results, with applied-filter chips beneath
- Full-screen mobile filter drawer with a sticky Apply button
- Data-table toolbar combining search, column filters, and chips

---
