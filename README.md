# UI Design Brain

Versioned catalog of production-grade UI component patterns shared across Verndale AI tooling, distributed as an **agent skill**. This repo is the **single source of truth** for the catalog so consuming repos can vendor identical content instead of hand-maintaining copies that drift.

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
└── patterns/                 # 65 per-pattern guidance files (accordion.md … visually-hidden.md)
```

Pattern-authoring templates live alongside the skill in `skills/_meta/` (`_pattern-template.md` + `_sections.md`) — authoring-only, never loaded at runtime or vendored.

This layout (`skills/<name>/SKILL.md`) is what the [`skills` CLI](https://github.com/vercel-labs/skills) discovers. The `SKILL.md` description is shared by every consumer, so it is written to read well for both spec/acceptance-criteria authoring and interface-code generation.

The catalog is not published to npm. `package.json` is `"private": true` and exists only to drive the Husky/commitlint tooling — distribution is via the `skills` CLI, described below.

---

## The catalog

| File | What it holds |
|------|---------------|
| [`SKILL.md`](skills/ui-design-brain/SKILL.md) | Skill entry point — frontmatter description plus the resolve-and-load workflow an agent follows. |
| [`index.md`](skills/ui-design-brain/index.md) | First hop for narrowing a design label down to likely component families. |
| [`patterns-manifest.json`](skills/ui-design-brain/patterns-manifest.json) | The 65 canonical entries — each with its `name`, `slug`, `aliases` (plain or context-scoped), and `file`. This is what turns an alias like "Banner" into the right canonical component. |
| [`patterns/*.md`](skills/ui-design-brain/patterns/) | One guidance file per canonical pattern (65 total), from `accordion.md` to `visually-hidden.md`. |

Resolution flow an agent follows: read `index.md` to narrow the family → resolve the label through `patterns-manifest.json` → load the matching `patterns/<slug>.md` for guidance.

---

## Who consumes it

| Consumer | Vendored at | Why a real copy |
|----------|-------------|-----------------|
| [`@verndale/ai-orchestration`](https://github.com/verndale/front-end-build-orchestration) | `frontend-ai/skills/ui-design-brain/` | Redistributed downstream as a git submodule. |
| [`cumulative-conductor`](https://github.com/verndale/cumulative-conductor) (ba-cockpit) | `skills/ui-design-brain/` | Redistributed downstream as a `.plugin` zip. |

Both hold a **real, committed copy** of the skill — not a submodule and not a symlink. Those repos are themselves redistributed downstream, where a symlink target or a nested submodule would not resolve.

---

## How consumers use it

Each consumer commits a small `sync-ui-design-brain.sh` that uses the `skills` CLI to vendor a fresh copy into its tree. The script installs with the allowed `claude-code` agent into a throwaway temp dir, then relocates the real files into the consumer's skill path:

```bash
#!/usr/bin/env bash
set -euo pipefail
SRC="${1:-git@github.com:verndale/ui-design-brain.git}"   # pass a local path for pre-push dev
TMP="$(mktemp -d)"
( cd "$TMP" && npx skills add "$SRC" --copy --skill ui-design-brain -a claude-code -y )
rm -rf skills/ui-design-brain          # (frontend-ai/skills/ui-design-brain in ai-orchestration)
mv "$TMP/.claude/skills/ui-design-brain" skills/ui-design-brain
rm -rf "$TMP"
```

The resulting `patterns/` diff in each consumer is the human-reviewable record of the change. There is no machine lockfile in the repo — re-running the script IS the update.

---

## Updating the catalog

1. Edit files under `skills/ui-design-brain/` (add a pattern, update the manifest, refine guidance). To add a pattern, copy `skills/_meta/_pattern-template.md` → `patterns/<slug>.md` and follow `skills/_meta/_sections.md`.
2. Commit with a Conventional Commit (`pnpm commit`) and merge to `main`.
3. In each consumer, run `pnpm uidb:sync` from the repo root (wraps the vendor script) and commit the diff. In ba-cockpit, also rebuild the `.plugin` bundle so the refreshed catalog ships.

---

## Repository automation

CI enforces commit hygiene, automates semantic releases, and dogfoods Verndale's own PR tooling — the same setup as `ai-orchestration` and `ba-cockpit`.

| Workflow | Trigger | Purpose |
|----------|---------|---------|
| [`commitlint.yml`](.github/workflows/commitlint.yml) | PRs to `main`, pushes to non-`main` | Commitlint on the PR title + commit range via the `@verndale/ai-commit` preset. |
| [`pr.yml`](.github/workflows/pr.yml) | Pushes to non-`main`, `workflow_dispatch` | Creates/updates a draft PR for the branch by running `pnpm run pr:create` (`@verndale/ai-pr`). |
| [`release.yml`](.github/workflows/release.yml) | Pushes to `main` | Runs `semantic-release` to version, tag, write `CHANGELOG.md`, and cut a GitHub Release. |
| [`graph.yml`](.github/workflows/graph.yml) | PRs to `main`, `workflow_dispatch` | Knowledge-graph freshness gate (`pnpm evals:graph`) — fails if the committed graph is stale. |
| [`wiki-sync.yml`](.github/workflows/wiki-sync.yml) | PR merge | Reconciles the context wiki (journal/topics/plans), rebuilds the graph, and opens a `bot/wiki-sync/<pr>` PR. |
| [`wiki-issue-sync.yml`](.github/workflows/wiki-issue-sync.yml) | Nightly cron, `workflow_dispatch` | Marks closed GitHub issues cited in wiki topic pages; opens a bot PR. |

Locally, the same commit standard is enforced by Husky hooks (`commit-msg`, `prepare-commit-msg`) installed via the `prepare` script. A `pre-commit` hook rebuilds and stages the knowledge graph (non-blocking). Add repository secret `PR_BOT_TOKEN` (classic PAT with `repo`) if the default `GITHUB_TOKEN` is not enough for `pr.yml`.

### Release Automation

On every push to `main`, [`release.yml`](.github/workflows/release.yml) runs `semantic-release` (configured in [`.releaserc.cjs`](.releaserc.cjs)):

- **Version bump from Conventional Commits** — `feat` → minor, `fix` → patch, `BREAKING` → major, `revert` → patch.
- **Deterministic, structured release notes** generated by the local plugin [`scripts/commit-pr/semantic-release-structured-notes.cjs`](scripts/commit-pr/semantic-release-structured-notes.cjs) (Highlights, Breaking changes, Changes by type, Full commit list).
- **Updates `CHANGELOG.md` and `package.json`**, commits `chore(release): vX.Y.Z`, creates the Git tag (`v${version}`) and a GitHub Release. `npmPublish` is `false` — the repo is `private` and ships via the `skills` CLI, not npm.
- **Optional AI summary** (bounded, validated) is injected into the notes only when `RELEASE_NOTES_AI=true` plus an endpoint/model/API key are set as Actions variables + secret. Unset = deterministic notes only.

Preview locally with `pnpm release:dry` (stops at the GitHub-auth step — a token is only available in CI).

---

## Environment

- **Node 24+** — pinned in `.nvmrc` (`24.14.0`) and `package.json` engines, enforced by `engine-strict=true` in `.npmrc`.
- **pnpm 10+** — pinned via `packageManager` (`10.33.0`), enabled through Corepack.

Install with `pnpm install`.

---

## Knowledge graph & wiki

The repo carries a deterministic **knowledge graph** over the catalog + root docs + wiki, rendered in an interactive **Sigma.js** viewer, plus a **context wiki** (`wiki/` — journal, topics, plans) that records why the repo is the way it is (executed plans, decisions, PR/issue history). Both are ported from `@verndale/ai-orchestration`; Slack ingestion is excluded.

```bash
pnpm graph:build   # rebuild scripts/graph/data/graph.json (+ generated wiki/connections* pages)
pnpm graph:view    # serve the interactive viewer at http://localhost:4173
pnpm evals:graph   # freshness + integrity gate (also runs in CI + pre-commit)
```

The `catalogs` edge (manifest → each pattern) doubles as the catalog integrity check: a manifest entry pointing at a missing pattern file fails the build. See [`scripts/graph/README.md`](scripts/graph/README.md) for the node/edge model and [`wiki/MECHANICS.md`](wiki/MECHANICS.md) for the capture protocol.

---

## Where to find things

- **Catalog content:** edit under [`skills/ui-design-brain/`](skills/ui-design-brain/) only — `SKILL.md`, `index.md`, `patterns-manifest.json`, `patterns/*.md`.
- **Knowledge graph & viewer:** [`scripts/graph/`](scripts/graph/) — `pnpm graph:build` / `pnpm graph:view`; node/edge model in [`scripts/graph/README.md`](scripts/graph/README.md).
- **Context wiki:** [`wiki/`](wiki/) — start at [`wiki/INDEX.md`](wiki/INDEX.md); capture protocol in [`wiki/MECHANICS.md`](wiki/MECHANICS.md).
- **Contribution rules & commit standards:** [CONTRIBUTING.md](CONTRIBUTING.md)
- **CI workflows:** [`.github/workflows/`](.github/workflows/)
- **Release config:** [`.releaserc.cjs`](.releaserc.cjs) + the notes plugin in [`scripts/commit-pr/`](scripts/commit-pr/)
- **Consumers' sync entry point:** `pnpm uidb:sync` in each consumer (wraps `scripts/sync-ui-design-brain.sh`)

---

## Contributing

Commit standards are enforced via `@verndale/ai-commit` (commitlint) and Husky hooks. Use `pnpm commit`. See [CONTRIBUTING.md](CONTRIBUTING.md).
