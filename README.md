# UI Design Brain

Versioned catalog of production-grade UI component patterns shared across Verndale AI tooling, distributed as an exact-version **agent-skill projection**. This repo is the **single source of truth** for the catalog so consuming repos can commit identical generated content without hand-maintained copies that drift.

---

## Purpose

Give every Verndale AI tool one shared vocabulary for UI primitives. A design label (e.g. "disclosure", "banner", "chip") resolves to exactly one canonical component with one set of pattern guidance — so a functional spec, its acceptance criteria, and the generated interface code all name and build the same thing instead of guessing independently.

---

## What this repo contains

The repo ships a single agent skill under `skills/`:

```
skills/ui-design-brain/
├── SKILL.md                  # skill entry point (frontmatter + workflow)
├── index.md                  # narrow down likely components
├── patterns-manifest.json    # canonical names, aliases, alias-resolution rules
├── catalog-manifest.json     # generated source schema + digest provenance
└── patterns/                 # 80 per-pattern guidance files (accordion.md … wizard.md)
```

Pattern-authoring templates live alongside the skill in `skills/_meta/` (`_pattern-template.md` + `_sections.md`) — authoring-only, never loaded at runtime or projected.

This layout (`skills/<name>/SKILL.md`) is what the [`skills` CLI](https://github.com/vercel-labs/skills) discovers. The `SKILL.md` description is shared by every consumer, so it is written to read well for both spec/acceptance-criteria authoring and interface-code generation.

The catalog is not published to the public npm registry. `package.json` remains `"private": true`; exact Git/tag or reviewed tarball pins are supported until a separate registry decision is approved. The first stable projector release is planned as `1.16.0`; this implementation branch uses the explicit `1.16.0-next.0` prerelease placeholder so local provenance never claims the projector came from `v1.15.1`.

---

## The catalog

| File | What it holds |
|------|---------------|
| [`SKILL.md`](skills/ui-design-brain/SKILL.md) | Skill entry point — frontmatter description plus the resolve-and-load workflow an agent follows. |
| [`index.md`](skills/ui-design-brain/index.md) | First hop for narrowing a design label down to likely component families. |
| [`patterns-manifest.json`](skills/ui-design-brain/patterns-manifest.json) | The 80 canonical entries — each with its `name`, `slug`, `aliases` (plain or context-scoped), and `file`. This is what turns an alias like "Banner" into the right canonical component. |
| [`catalog-manifest.json`](skills/ui-design-brain/catalog-manifest.json) | Generated schema version, vocabulary-authority version, file digests, aggregate digests, and the catalog's bounded authority. |
| [`patterns/*.md`](skills/ui-design-brain/patterns/) | One guidance file per canonical pattern (80 total), from `accordion.md` to `wizard.md`. |

Resolution flow an agent follows: read `index.md` to narrow the family → resolve the label through `patterns-manifest.json` → load the matching `patterns/<slug>.md` for guidance.

UI Design Brain owns names, slugs, aliases, contextual disambiguation, and bounded product guidance. It does not own accessibility semantics, applicability, evidence routes, or UI-pattern-to-accessibility-pattern mappings. Accessibility-adjacent prose remains informative and non-normative pending parity; normative obligations come from the exact pinned `@verndale/accessibility-standards` contract.

---

## Who consumes it

| Consumer | Generated at | Why a real copy |
|----------|-------------|-----------------|
| [`verndale/ai-orchestration`](https://github.com/verndale/ai-orchestration) | `frontend-ai/skills/ui-design-brain/` | Build Pack and implementation tooling must use the same canonical vocabulary selected upstream. |
| [`verndale/COS-monorepo`](https://github.com/verndale/COS-monorepo) Conductor | `plugins/conductor/skills/ui-design-brain/` | Functional Spec and acceptance-criteria generation resolves design labels before accessibility applicability. |

Both hold a **real, committed generated projection** — not a submodule and not a symlink. The projection carries package, profile, source, config, and output digests so the Functional Spec → Build Pack chain can fail closed on drift.

---

## How consumers use it

Each consumer pins one exact package artifact in its lockfile and commits `ui-design-brain.config.json`:

```json
{
  "$schema": "./node_modules/@verndale/ui-design-brain/schemas/consumer-config.schema.json",
  "schemaVersion": 1,
  "packageName": "@verndale/ui-design-brain",
  "packageVersion": "1.16.0",
  "catalogAuthorityVersion": "1.15.1",
  "profile": "agent-skill",
  "target": "frontend-ai/skills/ui-design-brain"
}
```

The installed binary provides the deterministic contract:

```text
ui-design-brain build
ui-design-brain sync --if-needed --config ui-design-brain.config.json
ui-design-brain check --config ui-design-brain.config.json
```

Hooks invoke the installed file directly with Node, never `npx` or a package installer. They cannot contact a registry, change a lockfile, or select a newer version. Sync builds beside the target, validates the complete candidate, and promotes it atomically. It refuses targets without `.ui-design-brain-generated` and refuses locally edited generated content.

For the one-time migration from a legacy copied catalog, add `--adopt`. Adoption accepts only the complete package catalog with byte-identical Markdown and semantic-equivalent manifest JSON, then atomically adds the marker and `projection-manifest.json`. Any divergent guidance, missing file, or unexpected file fails without changing the target.

---

## Updating the catalog

1. Edit files under `skills/ui-design-brain/` (add a pattern, update the manifest, refine guidance). To add a pattern, copy `skills/_meta/_pattern-template.md` → `patterns/<slug>.md` and follow `skills/_meta/_sections.md`.
2. Run `pnpm catalog:build` and `pnpm verify:ci`; commit with `pnpm commit` and merge to `main`.
3. Release an immutable version. Each consumer updates its exact lockfile pin and config version in a reviewed change, runs `sync --if-needed`, and commits the generated diff.

---

## Repository automation

CI enforces commit hygiene, automates semantic releases, and dogfoods Verndale's own PR tooling — the same setup as `ai-orchestration` and `ba-cockpit`.

| Workflow | Trigger | Purpose |
|----------|---------|---------|
| [`commitlint.yml`](.github/workflows/commitlint.yml) | PRs to `main` (including title edits) | Blocking Commitlint check on the immutable PR title + base/head commit range via the public `@verndale/ai-commit` preset. |
| [`pr.yml`](.github/workflows/pr.yml) | Pushes to non-`main`, `workflow_dispatch` | Creates/updates a draft PR for the branch by running `pnpm run pr:create` (`@verndale/ai-pr`). |
| [`release.yml`](.github/workflows/release.yml) | Pushes to `main` | Runs `semantic-release` to version, tag, write `CHANGELOG.md`, and cut a GitHub Release. |
| [`quality.yml`](.github/workflows/quality.yml) | PRs to `main`, `workflow_dispatch` | Required `Quality / quality` check: full-repository ESLint, catalog/projection and packed-consumer tests, and the check-only graph contract. |
| [`wiki-sync.yml`](.github/workflows/wiki-sync.yml) | PR merge | Reconciles the context wiki (journal/topics/plans), rebuilds the graph, and opens a `bot/wiki-sync/<pr>` PR. |
| [`wiki-issue-sync.yml`](.github/workflows/wiki-issue-sync.yml) | Nightly cron, `workflow_dispatch` | Marks closed GitHub issues cited in wiki topic pages; opens a bot PR. |

Locally, the same commit standard is enforced by Husky hooks (`commit-msg`, `prepare-commit-msg`) installed via the `prepare` script. `pre-commit` first auto-fixes staged JavaScript, blocks on a stale catalog manifest, emits the advisory journal reminder, and rebuilds + stages the knowledge graph only when graph inputs are clean. `pre-push` blocks on the complete non-network test suite, including an offline packed-consumer fixture. Add repository secret `PR_BOT_TOKEN` (classic PAT with `repo`) if the default `GITHUB_TOKEN` is not enough for `pr.yml`.

### Release Automation

On every push to `main`, [`release.yml`](.github/workflows/release.yml) runs `semantic-release` (configured in [`.releaserc.cjs`](.releaserc.cjs)):

- **Version bump from Conventional Commits** — `feat` → minor, `fix` → patch, `BREAKING` → major, `revert` → patch.
- **Deterministic, structured release notes** generated by the local plugin [`scripts/commit-pr/semantic-release-structured-notes.cjs`](scripts/commit-pr/semantic-release-structured-notes.cjs) (Highlights, Breaking changes, Changes by type, Full commit list).
- **Updates `CHANGELOG.md` and `package.json`**, commits `chore(release): vX.Y.Z`, creates the Git tag (`v${version}`) and a GitHub Release. `npmPublish` is `false`; public registry publication remains out of scope for this delivery.
- **Optional AI summary** (bounded, validated) is injected into the notes only when `RELEASE_NOTES_AI=true` plus an endpoint/model/API key are set as Actions variables + secret. Unset = deterministic notes only.

Preview locally with `pnpm release:dry` (stops at the GitHub-auth step — a token is only available in CI).

---

## Environment

- **Node 24+** — pinned in `.nvmrc` (`24.14.0`) and `package.json` engines, enforced by `engine-strict=true` in `.npmrc`.
- **pnpm 10+** — pinned via `packageManager` (`10.33.0`), enabled through Corepack.

Install with `pnpm install`. Use `pnpm catalog:build` after catalog changes, `pnpm lint` for full first-party JavaScript linting, `pnpm verify:push` for the local push gate, and `pnpm verify:ci` for the complete quality gate. No typecheck command is present because the repository has no first-party TypeScript implementation.

---

## Knowledge graph & wiki

The repo carries a deterministic **knowledge graph** over the catalog + root docs + wiki, rendered in an interactive **Sigma.js** viewer, plus a **context wiki** (`wiki/` — journal, topics, plans) that records why the repo is the way it is (executed plans, decisions, PR/issue history). Both are ported from `@verndale/ai-orchestration`; Slack ingestion is excluded.

```bash
pnpm graph:build   # rebuild scripts/graph/data/graph.json (+ generated wiki/connections* pages)
pnpm graph:view    # serve the interactive viewer at http://127.0.0.1:4173
pnpm graph:check   # 17-case, check-only freshness + integrity contract
```

The `catalogs` edge (manifest → each pattern) doubles as the catalog integrity check: a manifest entry pointing at a missing pattern file fails the build. See [`scripts/graph/README.md`](scripts/graph/README.md) for the node/edge model and [`wiki/MECHANICS.md`](wiki/MECHANICS.md) for the capture protocol.

---

## Where to find things

- **Catalog content:** edit `SKILL.md`, `index.md`, `patterns-manifest.json`, and `patterns/*.md` under [`skills/ui-design-brain/`](skills/ui-design-brain/); rebuild `catalog-manifest.json`.
- **Projection CLI and schemas:** [`bin/ui-design-brain.mjs`](bin/ui-design-brain.mjs), [`lib/`](lib/), and [`schemas/`](schemas/).
- **Knowledge graph & viewer:** [`scripts/graph/`](scripts/graph/) — `pnpm graph:build` / `pnpm graph:view`; node/edge model in [`scripts/graph/README.md`](scripts/graph/README.md).
- **Context wiki:** [`wiki/`](wiki/) — start at [`wiki/INDEX.md`](wiki/INDEX.md); capture protocol in [`wiki/MECHANICS.md`](wiki/MECHANICS.md).
- **Contribution rules & commit standards:** [CONTRIBUTING.md](CONTRIBUTING.md)
- **CI workflows:** [`.github/workflows/`](.github/workflows/)
- **Release config:** [`.releaserc.cjs`](.releaserc.cjs) + the notes plugin in [`scripts/commit-pr/`](scripts/commit-pr/)
- **Consumers' sync entry point:** the exact installed `node_modules/@verndale/ui-design-brain/bin/ui-design-brain.mjs`; consumer package scripts wrap direct `sync --if-needed` and `check` calls.

---

## Contributing

Commit standards are enforced via `@verndale/ai-commit` (commitlint) and Husky hooks. Use `pnpm commit`. See [CONTRIBUTING.md](CONTRIBUTING.md).
