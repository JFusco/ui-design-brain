# UI Design Brain — agent guide

Guidance for any AI coding agent (Claude Code, Codex, Cursor, Copilot, …) working in this repository.

## What this repo is

`@verndale/ui-design-brain` is the single source of truth for **one** agent skill — a catalog of canonical UI component patterns. All catalog content lives under `skills/ui-design-brain/` and nowhere else:

- `SKILL.md` — skill entry point (frontmatter + resolve-and-load workflow)
- `index.md` — flat list of all canonical component names (first hop)
- `patterns-manifest.json` — top-level JSON array of `{ name, slug, aliases, file }`; `slug == kebab(name) == filename`
- `patterns/<slug>.md` — one guidance file per pattern

Pattern-authoring templates live in `skills/_meta/` (sibling of the skill) — authoring-only: never loaded at runtime, never vendored.

Everything outside `skills/` is repo tooling (commits, release, CI). See [README.md](README.md) ("Where to find things") and [CONTRIBUTING.md](CONTRIBUTING.md) for the long-form detail.

## Environment

Node 24+ and pnpm 10+ (via Corepack); `pnpm install`. Editing the catalog needs **no build step and no local setup** — it is markdown + JSON, authored by hand. The repo does carry one subsystem of tooling: the knowledge graph + context wiki (see [Knowledge graph & wiki](#knowledge-graph--wiki)), whose only quality gate is `pnpm evals:graph`. There is no test suite for the catalog content itself. The commit/release tooling is the maintainer's job (see below).

## Editing this skill

**Whenever you edit, add, or change anything under `skills/ui-design-brain/`, follow Anthropic's agent-skill best practices and run its checklist before considering the change done:**
<https://platform.claude.com/docs/en/agents-and-tools/agent-skills/best-practices>

The practices that bite for this markdown-only catalog skill:

- **Frontmatter (`SKILL.md`)** — `name`: lowercase letters/numbers/hyphens only, ≤64 chars, no `anthropic`/`claude`, no XML. `description`: third person, ≤1024 chars, states both *what it does* and *when to use it*.
- **Concise** — keep the `SKILL.md` body under 500 lines; don't explain things the agent already knows.
- **Progressive disclosure, one level deep** — `SKILL.md` → `index.md` / `patterns-manifest.json` / `patterns/<slug>.md`. Don't add deeper nested reference chains.
- **TOC for long files** — any `patterns/*.md` over ~100 lines gets a contents list at the top so partial reads still see the full scope.
- **Consistent terminology; no time-sensitive info** — one term per concept; no "before/after <date>" phrasing in skill content (use an "old patterns" `<details>` block if history is needed).
- **Concrete examples; one sensible default over a menu of options.**
- **Forward slashes in all paths.**

## Catalog integrity (manifest is the source of truth)

`patterns-manifest.json` is authoritative for canonical names and aliases. When you add/rename/realias a pattern, update **all** of these together — they drift easily:

1. `patterns-manifest.json` entry (`name`, `slug`, `aliases`, `file`)
2. `index.md` canonical-component list
3. `patterns/<slug>.md` — create it from `skills/_meta/_pattern-template.md`; its `**Also known as:**` line must match the manifest entry's aliases, in manifest order
4. the pattern count in `README.md`
5. if the alias is **context-scoped** (an object-form `{ name, context }` entry), mirror it into `index.md`'s **Context-scoped aliases** table

The alias/name/count fields (steps 1–5) are maintained **by hand**, but the manifest↔file mapping is now checked: `pnpm graph:build` emits a `catalogs` edge from the manifest to each `patterns/<slug>.md`, and the build **fails on a dangling edge** — a manifest entry whose `file` points at a missing or renamed pattern. `pnpm evals:graph` (CI + the pre-commit hook) enforces it. That is the sanctioned catalog validator; don't add a *second* bespoke validator unless the maintainer asks.

## Authoring a pattern file (`patterns/<slug>.md`)

`skills/_meta/` is authoritative for pattern structure. When creating or editing a pattern, **copy `skills/_meta/_pattern-template.md` to `skills/ui-design-brain/patterns/<slug>.md`** and follow `skills/_meta/_sections.md`, then complete the Catalog-integrity steps above. (`skills/_meta/` is authoring-only — never loaded at runtime, never vendored.)

## Knowledge graph & wiki

The repo carries a deterministic **knowledge graph** — over the manifest, patterns, root docs, and the wiki — rendered in a vendored Sigma.js viewer, plus a **context wiki** (`wiki/` — journal, topics, plans) recording *why the repo is the way it is*. Both are ported from `@verndale/ai-orchestration`. Details: [`scripts/graph/README.md`](scripts/graph/README.md) and [`wiki/MECHANICS.md`](wiki/MECHANICS.md).

- `pnpm graph:build` — rebuild `scripts/graph/data/graph.json` + the generated `wiki/connections*` pages (both committed; the pre-commit hook rebuilds and stages them).
- `pnpm graph:view` — serve the interactive viewer at `http://localhost:4173`.
- `pnpm graph:navigate --intent why|wiring|impact --query <term>` — a deterministic reading itinerary over the graph; agents use it before broad cross-system reads.
- `pnpm evals:graph` — freshness + integrity gate (CI backstop for the pre-commit rebuild).

Capturing history is part of a substantive change: follow `wiki/MECHANICS.md` (journal entry + archived plan + topic Decisions). Executed plans are archived with `pnpm wiki:archive-plan`; the collectors also ingest GitHub PRs and issues on merge/nightly. Slack ingestion is intentionally **not** part of this subsystem.

## Commits & release — the maintainer's job, not the agent's

**Permission boundary:** edit files under `skills/ui-design-brain/` and `skills/_meta/` freely without asking — that's the autonomous zone. Everything in this section is the maintainer's.

**Do not commit, push, merge, tag, release, or run the consumer sync.** Make the requested edits, then stop and hand back to the maintainer for review. The maintainer commits with `pnpm commit` (Conventional Commits, required scope) and pushes; `semantic-release` then runs on `main`. Never edit the vendored copies in consumer repos — change the catalog here and let the maintainer re-sync.
