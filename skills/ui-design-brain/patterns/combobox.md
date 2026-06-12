## Combobox

**Also known as:** Autocomplete  ·  Autosuggest

A select-like input enhanced with a free-text field that filters available options as you type.

**Best practices:**
- Show suggestions after 1–2 characters to reduce noise
- Highlight matched text within each suggestion for scannability
- Allow keyboard navigation (arrow keys + Enter) through the dropdown
- Show a 'no results' message instead of an empty dropdown
- Debounce input to avoid excessive API calls (200–300 ms)

**Common layouts:**
- Search bar with autocomplete suggestions
- Address input with location suggestions
- Tag input that suggests existing tags
- Assignee picker in a project management tool

---
