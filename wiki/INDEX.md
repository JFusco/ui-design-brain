# Context Wiki

Why this repo is the way it is: executed plans, decisions, and change history. Read this index first; open only the pages it routes to.

## Contents

- How to navigate
- Topics
- Journal
- Plans
- Connections

## How to navigate

1. "Why is X like this / what's the design of X" → match X in Topics below; open that one page.
2. "What changed when / history of X" → scan the Journal lines below; open only matching entries.
3. "Was plan X implemented / what plans exist" → [plans/INDEX.md](plans/INDEX.md) is the audit table; archived plan files sit next to it.
4. Full plan detail behind a change → follow the plan link inside the journal entry or topic page.
5. "How does X wire to the rest of the catalog/wiki" → [connections.md](connections.md), a small index over the generated map; open the section your question needs: [catalog membership](connections/catalog.md), [pattern cross-references](connections/see-also.md), [skill references](connections/references.md), [wiki wiring](connections/wiki-wiring.md).
6. Cross-system "why", wiring, or impact question → agents silently use `pnpm graph:navigate` (`scripts/wiki/navigate.cjs`) before reading files; it returns a deterministic, minimal itinerary. Developers do not need to run or remember this utility.
7. No index hit or no route → grep `wiki/` for the term; then fall back to `git log` / `gh`. Never load the whole wiki.

## Topics

<!-- One line per topic page: [Title](topics/<slug>.md) — hook. Keep alphabetical by slug. -->

- [Agent guidance](topics/agents-guidance.md) — how the repo's `AGENTS.md` and `CONTRIBUTING.md` are organized.
- [Component catalog](topics/component-catalog.md) — the canonical UI-pattern catalog: manifest, aliases, cross-references, and the exact-string resolution consumers depend on.
- [Knowledge graph & context wiki](topics/graph-wiki-subsystem.md) — the deterministic graph + Sigma.js viewer and the context wiki, ported from ai-orchestration.
- [Packaging & distribution](topics/packaging-and-distribution.md) — how the catalog became a standalone published package that consumers vendor.

## Journal

<!-- Reverse-chronological, one line per entry: YYYY-MM-DD — [Title](journal/<file>.md) — hook. -->

- 2026-08-08 — [Add the Mega menu pattern](journal/2026-08-08-add-mega-menu-pattern.md) — a full-width, multi-column navigation disclosure panel dropped from a top-level nav item, distinct from the Navigation bar, a Dropdown menu, and a Drawer; promoted on cross-client recurrence (two clients, fingerprint + spec). Aliases Header mega menu, Mega menu panel (79 → 80).
- 2026-08-08 — [Add the Media object pattern](journal/2026-08-08-add-media-object-pattern.md) — a full-width image↔text content band (the OOCSS "media object" at section scale), distinct from the tile-in-grid Card, the page-top Hero, and the media-less Section header; minted on broad intra-project recurrence (four initiatives, each spec-backed). Alias Media block (78 → 79).
- 2026-08-06 — [Add the Logo bar pattern](journal/2026-08-06-add-logo-bar-pattern.md) — a full-width, non-interactive band of partner/customer logos as social proof (often auto-scrolling), distinct from the text **Marquee**; promoted on two independent sources (build pack + approved spec) within one retrospective, with the reciprocal Marquee → Logo bar cross-reference (77 → 78).
- 2026-08-06 — [Add Testimonial alias to Quote](journal/2026-08-06-add-testimonial-alias-to-quote.md) — a project's "Testimonial" label (a first-person quote with portrait + author attribution) registered as a plain Quote alias; the "testimonial block with photo, quote, name, and title" layout Quote's guidance already claims (77 → 77).
- 2026-08-05 — [Add Article hero alias to Masthead](journal/2026-08-05-add-article-hero-alias-to-masthead.md) — a project's "Article hero" label for an editorial article masthead (publish-date badge + title + tags), registered as Masthead's first alias; distinct from Hero by the no-CTA/identify-vs-sell line (77 → 77).
- 2026-08-05 — [Add the Utility bar pattern](journal/2026-08-05-add-utility-bar-pattern.md) — a persistent, fixed-position cluster of global page utilities (scroll-to-top, help/chat) that stays put across scroll; distinct from the in-flow **Button group**/Toolbar; promoted on two independent sources (component registry + approved spec) within one retrospective (76 → 77).
- 2026-08-05 — [Add the Comparison table pattern](journal/2026-08-05-add-comparison-table-pattern.md) — a feature/plan comparison matrix (entities as columns, attributes as rows, boolean cells, mobile column-selector), distinct from the data **Table** and a **Card**; promoted on two independent sources (component registry + approved spec) within one retrospective (75 → 76).
- 2026-08-05 — [Add the Search overlay pattern](journal/2026-08-05-add-search-overlay-pattern.md) — a full-screen search surface (input + quick links + recent/suggestions) with an open/closed × idle/active state machine, distinct from Search input, Modal, and Combobox; promoted on two independent sources (build pack + approved spec) within one retrospective (74 → 75).
- 2026-08-03 — [Add the In-page navigation pattern](journal/2026-08-03-add-in-page-navigation-pattern.md) — a sticky "on this page" section-nav bar with scroll-spy, promoted on two independent sources (build pack + approved spec) within one retrospective (73 → 74).
- 2026-08-03 — [Add Segmented toggle alias to Segmented control](journal/2026-08-03-add-segmented-toggle-alias-to-segmented-control.md) — a project's "segmented toggle" label, resolved to Segmented control via a consumer-evidenced plain alias (74 → 74).
- 2026-07-31 — [Add FAQ block alias to Accordion](journal/2026-07-31-add-faq-block-alias-to-accordion.md) — a project's FAQ module (faq-block), resolved to Accordion via a consumer-evidenced alias (73 → 73).
- 2026-07-31 — [Add Hero banner alias to Hero](journal/2026-07-31-add-hero-banner-alias-to-hero.md) — a project's top-of-page slide hero, resolved to Hero via a plain alias (73 → 73).
- 2026-07-31 — [Add Section intro alias to Section header](journal/2026-07-31-add-section-intro-alias-to-section-header.md) — a project's most-composed section-intro primitive, resolved to Section header (73 → 73).
- 2026-07-31 — [Add Range field alias to Slider](journal/2026-07-31-add-range-field-alias-to-slider.md) — a project's labelled range control, resolved to Slider via a consumer-evidenced alias (73 → 73).
- 2026-07-31 — [Add Generic card alias to Card](journal/2026-07-31-add-generic-card-alias-to-card.md) — a project's base content card ("generic card"), resolved to Card via a consumer-evidenced alias (73 → 73).
- 2026-07-30 — [Add the Section header pattern](journal/2026-07-30-add-section-header-pattern.md) — an interior-page section intro (eyebrow + heading + description), promoted on recurrence across two project retrospectives (72 → 73).
- 2026-07-30 — [Add the Rich text pattern](journal/2026-07-30-add-rich-text-pattern.md) — a read-only renderer of already-authored content (distinct from the Rich text editor), promoted on recurrence across two project retrospectives (71 → 72).
- 2026-07-30 — [Add the Stat pattern](journal/2026-07-30-add-stat-pattern.md) — a standalone value-plus-label figure, promoted on recurrence across two project retrospectives (70 → 71).
- 2026-07-23 — [Fix stale Stepper canonical row in the context-scoped aliases table](journal/2026-07-23-fix-stale-stepper-canonical-row.md) — reworded index.md's Stepper (the canonical) context from "multi-step form / wizard control" to the numeric +/- quantity control.
- 2026-07-23 — [Close consumer catalog gaps: eyebrow, filter, marquee, masthead, wizard](journal/2026-07-23-close-consumer-catalog-gaps.md) — added five patterns (65 → 70) plus cross-refs so the highest-frequency BA labels stop falling through to "novel".
- 2026-07-23 — [Knowledge graph + context wiki subsystem](journal/2026-07-23-knowledge-graph-wiki-subsystem.md) — ported the deterministic graph + Sigma.js viewer and the context wiki (executed plans / PRs / issues; no Slack) from ai-orchestration.

## Plans

- [Plan audit table](plans/INDEX.md) — every plan executed for this repo, with implementation status and evidence.

## Connections

- [Catalog + wiki wiring](connections.md) — a small index that routes to the generated map of how the catalog and wiki wire together: [catalog membership](connections/catalog.md), [pattern cross-references](connections/see-also.md), [skill references](connections/references.md), [wiki wiring](connections/wiki-wiring.md). Rendered from the knowledge graph; **do not hand-edit** — rebuilt by `pnpm graph:build` and verified by `pnpm evals:graph`.
