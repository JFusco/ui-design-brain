## Search input

**Also known as:** Search

A text field designed for entering search queries to find content.

**Best practices:**
- Place a magnifying glass icon inside the field to signal purpose
- Support Cmd/Ctrl+K as a global shortcut to focus the search
- Show recent searches and suggested queries in a dropdown
- Debounce input and show a loading indicator during server queries
- Provide a clear/reset button (×) once text is entered
- Give the field an `aria-label` and `type="search"`; for a suggestions list use the combobox pattern (`aria-expanded`, `aria-controls`) and announce result counts via a live region

**Common layouts:**
- Global search in the top navigation bar
- Command palette overlay (Cmd+K) with categorized results
- Inline search/filter above a data table
- Full-page search with prominent input and categorized results below

---
