## Select

**Also known as:** Dropdown  ·  Select input  ·  SelectField

A form input that shows the current selection when collapsed and reveals a scrollable option list when expanded.

A button-triggered menu of **actions** is not a Select — that is a **Dropdown menu** (see `dropdown-menu.md`). For a value picker with free-text filtering over many options, use a **Combobox** (see `combobox.md`).

**Best practices:**
- Use native select for simple use cases (better accessibility and mobile UX)
- For custom selects, ensure full keyboard support and ARIA attributes
- Show a placeholder label ('Select an option…') when no value is chosen
- Group long option lists with optgroups or headings
- For searchable selects with many options, use a **Combobox** (see `combobox.md`)
- For a custom select, use `role="combobox"` with `aria-expanded` on the trigger and `role="listbox"`/`role="option"` with `aria-selected` for the popup; support type-ahead and arrow keys

**Common layouts:**
- Country/region picker in an address form
- Sort-by dropdown in a product listing toolbar
- Role selector in a user invitation flow
- Language/locale switcher

---
