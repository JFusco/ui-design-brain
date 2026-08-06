## Search overlay

**Also known as:** Command palette  ·  Search modal

A full-screen or large surface that opens over the current page to host a search experience — a prominent input with supporting affordances (quick links, recent searches, live suggestions) and its own open/closed and idle/active states.

For a search field that lives inline in the layout, use a **Search input** (see `search-input.md`); for a plain content dialog with no search role, use a **Modal** (see `modal.md`); for inline autosuggest under a field, use a **Combobox** (see `combobox.md`). A Search overlay composes these but adds its own trigger, state machine, and dismissal contract.

**Best practices:**
- Open it from a persistent trigger in global navigation, and give the surface `role="dialog"` with `aria-modal="true"` and an accessible name
- Move focus to the search input on open, trap focus within the overlay, restore focus to the trigger on close, and close on Escape
- Model two states explicitly: an idle state (empty input, quick links / entry points) and an active state (a results panel of recent searches and live suggestions once the user types)
- Expose the suggestions list with combobox semantics (`aria-controls`, `aria-activedescendant`) so arrow keys move through results and Enter selects, without losing the input
- Debounce and announce result updates via a polite live region so screen-reader users hear that suggestions changed
- Dim or inert the page behind the overlay so background content is neither focusable nor read

**Common layouts:**
- Full-screen overlay: centered headline, large input, quick-links grid below
- Top-anchored sheet that slides down from the header, page dimmed beneath
- Idle state with author-managed quick links; active state swapping in a recent-searches + suggestions panel
- A results panel split into "Recent searches" and "Suggestions" columns or stacked sections

---
