# UI Design Brain Index

Use this index to keep the full catalog out of the main prompt. Load exact pattern guidance from `patterns/` only when a task clearly needs it.

## Canonical components
- Accordion
- Alert
- Avatar
- Badge
- Breadcrumbs
- Button
- Button group
- Card
- Carousel
- Checkbox
- Color picker
- Combobox
- Context menu
- Date input
- Datepicker
- Drawer
- Dropdown menu
- Empty state
- Error message
- Fieldset
- File
- File upload
- Footer
- Form
- Header
- Heading
- Helper text
- Hero
- Icon
- Image
- Label
- Link
- List
- Modal
- Navigation
- Number input
- Pagination
- Popover
- Progress bar
- Progress indicator
- Quote
- Radio button
- Rating
- Rich text editor
- Search input
- Segmented control
- Select
- Separator
- Sidebar
- Skeleton
- Skip link
- Slider
- Spinner
- Stack
- Stepper
- Table
- Tabs
- Text input
- Textarea
- Toast
- Toggle
- Tooltip
- Tree view
- Video
- Visually hidden

## Authoritative source

`patterns-manifest.json` is the single source of truth for canonical names, aliases, and pattern-file pointers. Resolve every design name through it before falling back to "novel".

### Manifest shape

The manifest is a JSON array of canonical entries:

```jsonc
{
  "name": "Modal",              // canonical PascalCase name
  "slug": "modal",              // kebab-case slug
  "aliases": ["Dialog", "Popup", "Modal window"],
  "file": "patterns/modal.md"   // detailed guidance file
}
```

Each entry in `aliases` is **either**:

- a **plain string** (the common case) — that alias maps unambiguously to this canonical, or
- an **object** `{ "name": "...", "context": "..." }` — used when the same alias label can map to different canonicals depending on usage context. The `context` field is human-readable disambiguation.

For example, `Banner` appears under both **Alert** (`context: "page-level message/notification"`) and **Hero** (`context: "top-of-page hero/promotional area"`). Resolvers must pick the canonical whose `context` matches the Build Pack's usage; if the context is unclear, treat the name as **novel** rather than guessing.

## Loading guidance
- Start from the canonical list above to scope which patterns are likely relevant.
- For any design label, look it up in `patterns-manifest.json` — match on `name` first, then on `aliases` entries (string match for plain aliases, name+context match for object aliases).
- Once resolved, load only the matching `file` (e.g. `patterns/modal.md`) — never load the whole `patterns/` directory.
- If a name is not in the manifest as `name` or `aliases`, treat it as novel rather than guessing.
