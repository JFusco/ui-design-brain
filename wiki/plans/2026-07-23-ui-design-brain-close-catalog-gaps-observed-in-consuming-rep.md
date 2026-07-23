---
status: implemented
executed: 2026-07-23
date: 2026-07-23
evidence:
  - "PR #12 https://github.com/verndale/ui-design-brain/pull/12 (merged 2026-07-23)"
source_tool: claude
source: "/Users/joe.fusco/.claude/plans/i-made-this-plan-functional-dragon.md"
topics: [component-catalog]
---
# ui-design-brain: close catalog gaps observed in consuming repos

> **Tracking:** [verndale/ui-design-brain#11](https://github.com/verndale/ui-design-brain/issues/11) (`enhancement`) · **Branch:** `feat/catalog-gap-patterns` (from `main`)

## Context

`@verndale/ui-design-brain` is the single source of truth for a catalog of canonical UI
component patterns. Two downstream repos — `@verndale/ai-orchestration` and
`@verndale/ba-cockpit` — vendor the skill **byte-identically** via daily bot-sync PRs;
hand-editing downstream is forbidden, so every gap must be fixed **here**.

Both consumers resolve every component label through `patterns-manifest.json` by **exact
string** (name → plain alias → context alias; unresolved = "novel"), then lift measurable
a11y "Best practices" bullets from the resolved `patterns/<slug>.md` into acceptance
criteria / implementation. `ai-orchestration` additionally derives `patterns/<kebab-name>.md`
directly from canonical names (hard reliance on `slug == kebab(name) == filename`; its
preflight hard-gates on the manifest parsing).

**Problem:** the highest-frequency page-building labels BAs actually use fall through to
"novel", so the canonicalization guarantee fails exactly where it's needed most —
Eyebrow/Kicker/Overline (~20 ba-cockpit files), Marquee/Ticker, Filter/Facet/Refinements
(~12–36 files, esp. Sitecore Search), and Masthead (~18 files, the interior-page identity
band). Separately, the "Visual variants" section born from the documented pill-tabs
production failure lives only in `tabs.md` and is undocumented in the authoring docs — the
kind of orphan a future normalization pass deletes.

**Outcome:** five new patterns (65 → 70) plus bidirectional cross-refs, so the most-used
labels resolve to canonical patterns with liftable a11y bullets; and codify the
child-part and Visual-variants conventions in `skills/_meta/` so they survive.

**Scope (confirmed with Joe):** all four Tier-1 patterns + Wizard (five total), Tier 2
included. **Masthead ships with no aliases** — "Interior hero" was flagged speculative and
Joe chose to drop it; only consumer-evidenced aliases go in this batch.

**Permission boundary:** everything here is under `skills/ui-design-brain/` and
`skills/_meta/` (the autonomous zone) plus the root `README.md` count. No commit / push /
merge / tag / release / consumer-sync — deliver an uncommitted working tree and hand back.

---

## Verified against the repo (ground truth)

- Manifest is a top-level JSON array of `{ name, slug, aliases, file }`, **65 entries**.
  Six existing object-form context aliases (Banner×2, CTA×2, Label, Stepper) — **none of
  the 5 new patterns add a context alias**, so the `index.md` "Context-scoped aliases"
  table does **not** change.
- Alphabetical insertion points confirmed: Eyebrow after `Error message`; Filter after
  `File upload`; Marquee + Masthead between `List` and `Modal` (currently adjacent);
  Wizard last, after `Visually hidden`.
- Cross-refs are **inline prose** right after the definition — bolded canonical name +
  backticked filename, e.g. `see **Name** (\`file.md\`)`. No "See also" heading exists.
  `carousel.md`, `accordion.md`, `search-input.md` currently have **no** cross-ref line
  (their new prose lands in the empty slot before Best practices).
- `tabs.md` is the **only** file with a `**Visual variants (orthogonal to ARIA):**` block
  (line 9), sitting between its cross-ref and Best practices. `_meta` docs never mention
  "Visual variants" or "child parts".
- **README correction:** the count "65" appears on lines **22, 39, 40**, and there are
  **two** file-range notes — line 22 (`accordion.md … visually-hidden.md`) **and** line 40
  (`accordion.md` to `visually-hidden.md`). Both endpoints become `wizard.md`. (The
  original plan only called out line 22; line 40's range must change too.)

---

## Tier 1 — five new patterns + integrity sync (65 → 70)

Create each from `skills/_meta/_pattern-template.md`, following `skills/_meta/_sections.md`:
H2 title == manifest `name`; alias line in manifest order (**omit the line entirely when
there are no aliases** — applies to Masthead); one-sentence definition; bidirectional
cross-ref prose; ~6 Best practices (**≥1 a11y**); ~4 Common layouts; closing `---`.

### 1. `patterns/eyebrow.md` — aliases: Kicker, Overline
- **Def:** a short text label displayed directly above a heading — categorizing or framing
  the content it introduces.
- **Cross-refs:** **Heading** (`heading.md`) — the title itself; an eyebrow is plain text,
  not a heading. **Badge** (`badge.md`) — a pill/tag-styled category marker.
- **Best practices (topics):** 1–4 words; distinct styling (smaller, letter-spaced/
  uppercase, muted/accent); uppercase via CSS `text-transform`, source text normal case;
  (a11y) plain-text markup (`p`/`span`), never a heading element — keeps the document
  outline clean; (a11y) keep the eyebrow **out of the section's accessible name** — the
  heading alone names the section (mirrors ba-cockpit's `aria-labelledby` rule); (a11y)
  muted text still meets WCAG AA contrast; category-link eyebrows use a Link with a visible
  focus style.
- **Layouts:** category eyebrow on a blog card; section eyebrow above an H2 in a marketing
  band; kicker above a hero headline; date/topic eyebrow on news-listing items.

### 2. `patterns/marquee.md` — aliases: News ticker, Ticker
- **Def:** a strip of content that scrolls continuously and loops automatically — logos,
  headlines, or announcements moving without user paging.
- **Cross-refs:** **Carousel** (`carousel.md`) — discrete slides the user advances; a
  Marquee moves continuously, a Carousel steps. **Alert** (`alert.md`) — static page-level
  announcement.
- **Best practices (topics):** ambient/supplementary content only, never sole access to
  essential content; seamless loop via duplicated content with `aria-hidden="true"` on the
  duplicate; slow steady speed, pause on hover and focus; (a11y) visible pause/stop control
  per WCAG 2.2.2; (a11y) honor `prefers-reduced-motion` with a static/scrollable fallback;
  avoid interactive items in the moving strip — if links exist, focus must pause motion.
- **Layouts:** logo-wall marquee; news/announcement ticker under the header; stock/score
  ticker on a dashboard; repeating brand-statement band between sections.

### 3. `patterns/filter.md` — aliases: Facet, Faceted navigation, Facets, Filter panel, Filters, Refinements
(plural forms included deliberately — consumer resolution is exact-string.)
- **Def:** a group of controls that narrows a list or search result set by attribute
  values — each facet exposing its options, typically with result counts.
- **Cross-refs:** **Search input** (`search-input.md`) — entering the query vs refining the
  returned result set (bidirectional). Composition note (no `see` pointer, so no
  bidirectional obligation): value pickers are standard form primitives (Checkbox, Radio
  button, Select, Combobox, Slider); applied-filter chips are the Badge pattern.
- **Best practices (topics):** result counts per value, hide/disable zero-result values;
  one application model (instant vs explicit Apply), used consistently; applied filters as
  removable chips + "Clear all"; collapsible facet groups, most-used expanded; filter state
  in the URL (shareable, back-button safe); (a11y) `fieldset`/`legend` (or labeled
  `role="group"`) per facet, live-region result-count announcements, full focus management
  for the mobile filter drawer (see `drawer.md`).
- **Layouts:** left-rail facets beside a product grid; horizontal filter bar above results
  with chips beneath; full-screen mobile filter drawer with sticky Apply; data-table
  toolbar combining search, column filters, chips.

### 4. `patterns/masthead.md` — **no aliases** (no "Also known as:" line; manifest `aliases: []`)
- **Def:** the page-top identity band on interior pages — page title, often breadcrumbs and
  intro text, over an optional background image.
- **Cross-refs:** **Hero** (`hero.md`) — promotional, CTA-led band; a Masthead identifies
  the page, a Hero sells. **Header** (`header.md`) — persistent site chrome, even where
  publishing vocabulary calls it a masthead.
- **Best practices (topics):** (a11y) contains the page's single H1; materially shorter
  than a homepage hero — orient, then yield; consistent breadcrumbs position across
  templates; (a11y) title contrast over media (scrim / safe zone, WCAG AA); focal-point/
  crop rules for authored background images across breakpoints; consistent no-media
  typographic fallback.
- **Layouts:** title + breadcrumbs over full-width image; text-only band with eyebrow, H1,
  intro; split masthead (title left, image right); compact article masthead with title +
  metadata.

### 5. `patterns/wizard.md` — alias: Multi-step form
- **Def:** a flow that splits one long task into ordered steps with explicit Back/Next
  navigation, collecting input across screens before a final review and submit.
- **Cross-refs:** **Progress indicator** (`progress-indicator.md`) — the step display
  inside a wizard (bidirectional). **Stepper** (`stepper.md`) — name-collision
  disambiguation: the quantity +/- control, not a step flow (bidirectional).
- **Best practices (topics):** one task per step; show step position via a Progress
  indicator ("Step X of Y"); Back never loses entered data; validate per step, not at the
  end; include a review step before submit; (a11y) on step change, move focus to the step
  heading and announce "Step X of Y".
- **Layouts:** checkout flow; onboarding/account setup; multi-section application form;
  product configurator.

### Reverse cross-refs (one added inline sentence each — 9 existing files)
Inserted in the cross-ref slot right after the definition (bolded name + backticked file):
- `heading.md` → **Eyebrow** (short label line above a heading)
- `badge.md` → **Eyebrow** (plain-text category line is an Eyebrow, not a Badge)
- `carousel.md` → **Marquee** (continuous auto-scroll vs discrete slides) *(file has no
  cross-ref today; this creates the slot — child-part line follows it, see Tier 2)*
- `alert.md` → **Marquee** (scrolling announcement strip)
- `search-input.md` → **Filter** (refining an already-returned result set) *(no cross-ref
  today; lands directly after the definition)*
- `hero.md` → **Masthead** (interior-page title band — identity, not promotion)
- `header.md` → **Masthead** (page-top title band sometimes called a masthead)
- `progress-indicator.md` → **Wizard** (the multi-step flow that hosts a step display)
- `stepper.md` → **Wizard** (name-collision note: a multi-step flow is a Wizard, not a Stepper)

### Integrity sync (atomic with the above — AGENTS.md "Catalog integrity" checklist)
- **`patterns-manifest.json`:** 5 new entries at the confirmed alphabetical positions.
  Masthead's `aliases` is `[]`; all other new aliases are plain strings — **no context-
  scoped `{name, context}` entries**. Append Wizard as the new last element (add a comma
  after the current final `Visually hidden` object). Must still parse afterward.
- **`index.md`:** 5 insertions in the "Canonical components" list at the same positions
  (Eyebrow before `Fieldset`; Filter before `Footer`; Marquee + Masthead between `List` and
  `Modal`; Wizard after `Visually hidden`). **Context-scoped aliases table unchanged.**
- **`README.md` (4 edits):** three counts `65` → `70` (lines 22, 39, 40); **both** range
  endpoints `visually-hidden.md` → `wizard.md` (line 22's `accordion.md … visually-hidden.md`
  **and** line 40's `accordion.md` to `visually-hidden.md`).
- **`SKILL.md`:** no change (no counts/enumeration).

---

## Tier 2 — child-part naming + authoring-doc codification

### Child-part prose (prose only — **never** manifest aliases; preserves ba-cockpit child-spec smart-linking)
Placed in the cross-ref slot, before Best practices:
- `carousel.md`: the repeating module inside a Carousel is a **Slide** — a child of this
  pattern, not a separate catalog entry. *(follows the new Marquee cross-ref)*
- `tabs.md`: each selectable label is a **Tab**, its content region a **Tab panel** —
  children of this pattern, not separate catalog entries. *(placed before the existing
  Visual variants block)*
- `accordion.md`: each heading + collapsible-region pair is an **Accordion item** — a child
  of this pattern, not a separate catalog entry. *(file has no cross-ref; this line sits
  directly after the definition)*

### `skills/_meta/_sections.md` (authoring-only — never vendored, zero consumer impact)
- "Canonical structure" list: add **two optional parts after cross-references (item 4)** —
  a child-part line, and the `**Visual variants (orthogonal to ARIA):**` block — then
  renumber. Change the length note `~20–30 lines` → `~20–35 lines`.
- New `### Child parts (optional)` subsection with the hard rule: child-part names must
  **never** be promoted to manifest aliases or the "Also known as" line (consumers
  deliberately treat child modules as unresolved for child-spec linking).
- New `### Visual variants (optional)` subsection: verbatim heading; variants never change
  the resolved canonical (consumers express `Name (variant: pill)`); add a block only when
  a real restyle/misresolution incident justifies it (sole current example: `tabs.md`); no
  speculative variant blocks (explicitly: no Button-variants block now).
- "Conventions (hard constraints)" list: add `child-part names are prose only, never
  aliases` and `visual variants never change canonical resolution`.

---

## Explicitly NOT doing (recorded decisions)
- **Section / Row / Container / Column** layout regions — CMS page-builder vocabulary, no
  interaction/a11y payload; aliasing would mass-rename page-structure H3s. Novel is correct.
- **Aliasing Slide / Tab panel / Accordion item** — would break ba-cockpit child-spec
  smart-linking. They stay prose-only.
- **Machine-structured AC/behavior surface** — 65+ file blast radius; collides with
  ba-cockpit's ARIA-precedence contract. Keep a11y bullets measurable free-text so existing
  lifting works.
- **Validators / tooling** — forbidden by AGENTS.md unless the maintainer asks.
- **"Interior hero" Masthead alias** — dropped (speculative, unevidenced in consumers).

---

## Files touched
- **New (5):** `skills/ui-design-brain/patterns/{eyebrow,marquee,filter,masthead,wizard}.md`
- **Edited catalog integrity (3):** `skills/ui-design-brain/patterns-manifest.json`,
  `skills/ui-design-brain/index.md`, `README.md`
- **Edited pattern files (11):** `patterns/{heading,badge,carousel,alert,search-input,hero,
  header,progress-indicator,stepper,tabs,accordion}.md`
- **Edited authoring doc (1):** `skills/_meta/_sections.md`

---

## Assumptions (load-bearing flagged)
- **Masthead = interior-page identity band** — VERIFIED against ba-cockpit's worked example
  (People Detail Masthead: fixed hero atop a profile page, H1 + portrait + title).
- **"Overline"/"Kicker" aliases** — verified (ba-cockpit treats eyebrow/kicker/overline as
  one set).
- Consumers re-sync via their existing daily bot PRs; nothing here changes sync tooling.

## What could break (blast radius)
- Alias additions flip existing consumer labels "novel" → canonical on next sync (~20
  Eyebrow files, ~18 Masthead files, Sitecore Search Filter/Facet specs). **Intended** —
  re-processed specs resolve differently and start lifting the new patterns' a11y bullets.
- Edge: a spec using "Filter" for a single sort-by dropdown now resolves to Filter — 
  mitigated by the Search-input cross-ref + composition note.
- Wizard: lowest risk (~2 files flip; new strings, no collisions). Added at Joe's direction
  despite thin evidence — risk is only that the pattern sits unused, nothing misresolves.
- Malformed manifest JSON would trip ai-orchestration's preflight — mitigated by the parse
  check below.
- `_meta` changes: zero consumer impact (never vendored).

---

## Verification
1. `python3 -m json.tool skills/ui-design-brain/patterns-manifest.json > /dev/null`
   (must parse — read-only; ai-orchestration's preflight hard-gates on this file).
2. Hand-run the AGENTS.md integrity checklist: manifest ↔ `index.md` ↔ pattern files ↔
   README count (**70**) ↔ context table (unchanged); each new file's "Also known as" line
   matches its manifest aliases in order (Masthead has none — no line); every cross-ref is
   bidirectional; each new file has ≥1 a11y bullet; `slug == kebab(name) == filename`.
3. `pnpm evals:graph` — the sanctioned catalog validator (freshness + integrity; fails on a
   dangling manifest→file edge). *(Note: `pnpm graph:build` regenerates committed graph/wiki
   artifacts and is normally the maintainer's; run `evals:graph` read-only to validate, and
   flag if the graph needs a rebuild rather than committing one.)*
4. Check each new file against `_sections.md` structure and the Anthropic skill
   best-practices checklist (per AGENTS.md).
5. Launch read-only review agent(s) over the diff; report findings.
6. Stop at an uncommitted working tree. Suggested Conventional Commits message (maintainer
   runs `pnpm commit`; do **not** commit/push/release/sync):
   `feat(ui-design-brain): add eyebrow, filter, marquee, masthead, and wizard patterns`
