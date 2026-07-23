---
status: implemented
executed: 2026-07-23
date: 2026-07-23
evidence: []
source_tool: claude
source: "/Users/joe.fusco/.claude/plans/i-want-to-copy-hidden-stroustrup.md"
topics: [graph-wiki-subsystem]
audit_note: "Implemented on branch feat/knowledge-graph-wiki; tracking issue #8. Evidence (PR) backfilled on merge by wiki-sync."
---
# Port the knowledge-graph + wiki subsystem into `ui-design-brain`

## Context

`@verndale/ai-orchestration` runs a **context wiki** (hand-authored markdown: journal / topics / plans) plus a **deterministic knowledge graph** derived from those files and rendered in an interactive **Sigma.js** viewer. The wiki captures *why the repo is the way it is* — executed plans, decisions, PR/issue evidence — and the graph makes that web navigable.

`ui-design-brain` has none of this today. This plan replicates the same subsystem here, adapted to this repo's content (the 65-pattern catalog under `skills/ui-design-brain/`), so executed plans (Codex + Claude), GitHub PRs, and GitHub issues are collected into a wiki and visualized as a graph. **Slack ingestion is deliberately excluded.** Per the maintainer's choices this is a **full faithful port**: it includes ai-orchestration's routing/navigation + auto-generated connections layer, a pre-commit graph auto-rebuild, and the opt-in (dormant) AI drafting hooks. This very plan is archived into the new wiki as plan #1.

**Decisions locked in:** Full faithful port (routing + connections IN) · Pre-commit auto-rebuild (IN) · Opt-in AI drafting (ported dormant, off unless `WIKI_AI=true`).

Source repo: ai-orchestration. Target: ui-design-brain (slug `verndale/ui-design-brain`, pnpm@10.33.0, Node ≥24.14.0, CommonJS `.cjs`). The subsystem is **zero new npm dependencies** — Node stdlib + three vendored browser bundles.

## Pre-implementation workflow (do this first, before any file changes)

Executed in order, on the maintainer's explicit request. The `github-issue-creator` skill drafts and confirms the issue before it is created.

1. **Branch off `main`.** From a clean `main`: `git switch -c feat/knowledge-graph-wiki`. All work below lands on this branch; `main` is never touched.
2. **Create repo labels first** — mirror ai-orchestration's `area:`-prefixed taxonomy. `enhancement` and `documentation` already exist; create only the missing area labels: `area: graph` (`#1d76db`), `area:wiki` (`#6b37f1`, verbatim mirror), `area: tooling` (`#c5def5`).
3. **File an `[Enhancement]` issue** via the `github-issue-creator` skill (feature-request/enhancement mode) → [#8](https://github.com/verndale/ui-design-brain/issues/8).
4. **Label the issue** `enhancement`, `area: graph`, `area:wiki`, `area: tooling`.

## Grounding facts (verified against real files — these drive every adaptation)

1. **Pattern files have no markdown links.** All 65 `patterns/<slug>.md` cross-reference via inline-code bare filenames — e.g. Modal → ``…use a **Drawer** (see `drawer.md`).`` A verbatim `links-to` pass (keys on `[..](..)`) yields **zero** pattern-to-pattern edges → a new `see-also` pass reading backticked filenames is the single most important adaptation.
2. **Patterns have no frontmatter and use H2 headings** (`## Modal`), not H1 → labels + aliases come from `patterns-manifest.json`, not from the file.
3. **Manifest is the spine:** `{ name, slug, aliases[], file }`; aliases are plain strings or `{ name, context }` objects → a `catalogs` edge (manifest → each pattern) becomes the integrity gate = the sanctioned catalog validator the maintainer is now authorizing.
4. **`docs(wiki):` commits do not cut releases** — `.releaserc.cjs` bumps only on `feat|fix|breaking|revert`. The wiki-sync bot merging to `main` is release-safe (verified).
5. **`graph.json` is committed** (the freshness gate byte-compares the committed file), matching ai-orchestration.

## Node / edge model (tuned to this repo)

**Node types** (ai-orch's `hook`/`validator`/`eval-runner`/`reference`/`skill-readme` are dropped — no such files here): `root-doc` (README/AGENTS/CONTRIBUTING/CLAUDE, 4; CHANGELOG excluded), `skill` (SKILL.md), `skill-index` (index.md), `manifest` (patterns-manifest.json), `ui-pattern` (patterns/*.md, 65), `wiki-index` (INDEX/MECHANICS/plans-INDEX), `wiki-journal`, `wiki-topic`, `wiki-plan`.

**Edge passes:** `catalogs` (manifest → each ui-pattern; dangling ⇒ integrity gate fails), `see-also` (pattern ↔ pattern, fence-aware backtick scan, dedupe with count), `references` (skill/skill-index → manifest/pattern files), `links-to` (verbatim), `topic` / `plan` (verbatim, frontmatter-driven), `covers` (wiki-topic → runtime surfaces). Dropped: `registers`, `eval-of`, `enforces`, and the `coverageProblems` gate.

## Files to create

### Graph subsystem — `scripts/graph/`
- `build-graph.cjs` — adapt: rewrite `typeOf()`, walked roots (skills/ + manifest + wiki/ + 4 root-docs), manifest load (labels/aliases), new `catalogs`/`see-also`/`references` passes; keep `links-to`/`topic`/`plan`/`covers`, sort, integrity gate, retuned `renderConnections()`.
- `serve.cjs`, `routing.cjs`, `viewer/routing.js`, `viewer/viewer.css`, `viewer/vendor/{sigma,graphology.umd,graphology-library}.min.js` — verbatim.
- `viewer/index.html` — retitle; keep routing UI. `viewer/viewer.js` — retune TYPE_COLORS/TYPE_LABELS/EDGE_COLORS, extend search to aliases; keep routing. `routing-policy.json` — rewrite edgeCosts + intents for the new types. `data/graph.json` — generated + committed. `README.md` — adapt.

### Evals — `scripts/evals/`
- `graph-check.cjs` — adapt: keep freshness/determinism/integrity + connections + routing-policy schema; drop `coverageProblems`.

### Wiki collectors + libs — `scripts/wiki/`
- `lib/frontmatter.cjs`, `lib/wiki-io.cjs` (Slack-only `augmentTopicDecision` trimmed), `lib/codex-plans.cjs`, `lib/ai.cjs` (dormant), `archive-plan.cjs`, `navigate.cjs`, `ci-journal-warn.cjs` — verbatim/near-verbatim.
- `lib/substantive.cjs` — rewrite path regex tables. `find-unarchived-plans.cjs` / `pre-commit-journal.cjs` — `REPO_MATCH = /ui-design-brain/`. `on-merge-sync.cjs` / `refresh-issue-state.cjs` — repo slug → `verndale/ui-design-brain`.

### GitHub workflows — `.github/workflows/`
- `wiki-sync.yml` (PR-merge → bot PR), `wiki-issue-sync.yml` (nightly issue state), `graph.yml` (freshness gate on PRs). Slack workflow excluded; no `SLACK_WIKI_BOT_TOKEN`.

### Pre-commit hook — `.husky/pre-commit`
- Journal nudge + `if [ -z "$CI" ]` rebuild graph and stage graph.json + connections.

### package.json scripts
`graph:build`, `graph:view`, `graph:navigate`, `evals:graph`, `wiki:archive-plan`, `wiki:find-plans`, `wiki:issue-sync`. No new deps.

### Docs to reconcile
- `AGENTS.md` — supersede the "no build/validator by design" language; add a Knowledge graph & wiki section.
- `README.md` — add a Knowledge graph subsection.

## Seed wiki (this plan = plan #1)

`wiki/plans/2026-07-23-port-knowledge-graph-wiki-subsystem.md` (this file), `wiki/plans/INDEX.md`, `wiki/journal/2026-07-23-knowledge-graph-wiki-subsystem.md`, `wiki/topics/graph-wiki-subsystem.md`, `wiki/INDEX.md`, `wiki/MECHANICS.md`, and the generated `wiki/connections*` pages.

## Verification (end-to-end)

1. `pnpm graph:build` → `catalogs === 65`, `ui-pattern === 65`, exit 0.
2. Integrity negative test: bogus manifest `file` → exit 1 (dangling `catalogs`); revert.
3. `pnpm graph:view` → Sigma canvas; search "disclosure" → Accordion; Modal focus shows Drawer; routing resolves; console clean.
4. `pnpm evals:graph` → PASS; edit a see-also line without rebuilding → FAIL stale; rebuild → PASS.
5. Connections pages regenerated + byte-compared by the gate.
6. Collectors dry-run (find-unarchived-plans, on-merge-sync fixture, navigate).
7. Determinism: two builds byte-identical.

## Handoff (maintainer-owned)

Delivered as an uncommitted working tree on `feat/knowledge-graph-wiki`. The branch, labels, and issue #8 are created. The maintainer commits, pushes, and opens the PR (closes #8); `wiki-sync` backfills this plan's evidence on merge. No commits/push/PR/release/consumer-sync/memory writes by the agent.
