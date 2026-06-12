# Contributing

This repository is the single source of truth for the `ui-design-brain` catalog, distributed as an agent skill. It enforces strict commit standards so consuming repos can vendor identical content via the [`skills` CLI](https://github.com/vercel-labs/skills).

## Quick Start (TL;DR)

    pnpm install
    git checkout -b feat/my-pattern-change
    # edit files under skills/ui-design-brain/
    git add -A
    pnpm commit
    git push

## What lives here

A single agent skill, under `skills/ui-design-brain/`:

- `skills/ui-design-brain/SKILL.md` — skill entry point (frontmatter + workflow)
- `skills/ui-design-brain/index.md` — entry point for narrowing components
- `skills/ui-design-brain/patterns-manifest.json` — canonical names, aliases, alias-resolution rules
- `skills/ui-design-brain/patterns/*.md` — one guidance file per pattern

The `SKILL.md` `description` is shared by every consumer, so keep it neutral enough to read well for both spec/acceptance-criteria authoring and interface-code generation.

## Commit Messages (Required)

We enforce **Conventional Commits** through **`@verndale/ai-commit`** (commitlint preset). Types: `build`, `chore`, `ci`, `docs`, `feat`, `fix`, `perf`, `refactor`, `revert`, `style`, `test`.

Format (scope is **required**):

    type(scope): Short subject

Examples:

    feat(patterns): Add command-palette pattern
    fix(manifest): Correct banner alias resolution
    docs(readme): Clarify consumer sync flow

The first line is validated by **commitlint** via the `commit-msg` hook and in CI. Use `pnpm commit` (runs `ai-commit run`) for an AI-assisted, pre-validated message; `OPENAI_API_KEY` in `.env` enables AI generation and is optional (safe fallback otherwise). See `.env-example`.

## How changes reach consumers

1. Land your change here and merge to `main`.
2. In each consumer (`ai-orchestration`, `ba-cockpit`), run `pnpm uidb:sync` from the repo root (wraps `scripts/sync-ui-design-brain.sh`, which vendors a fresh copy via the `skills` CLI) and commit. The `patterns/` diff there is the reviewable record of the change.

Each consumer commits a real copy, so the vendored content travels with that repo's downstream distribution (git submodule / `.plugin` zip). Re-running the sync script is the only update step — there is no version pin or CI drift check.

## Repository automation

| Workflow | Trigger | Purpose |
| --- | --- | --- |
| [`.github/workflows/commitlint.yml`](.github/workflows/commitlint.yml) | PRs to `main`, pushes to non-`main` | Commitlint on PR title + commit range |
| [`.github/workflows/pr.yml`](.github/workflows/pr.yml) | Pushes to non-`main`, `workflow_dispatch` | Dogfood: install deps, run **`pnpm run pr:create`** |
| [`.github/workflows/release.yml`](.github/workflows/release.yml) | Pushes to `main` | `semantic-release`: version bump, `CHANGELOG.md`, Git tag + GitHub Release |

Add repository secret **`PR_BOT_TOKEN`** (classic PAT with **`repo`**) if the default **`GITHUB_TOKEN`** is not enough for **`pr.yml`**.

Releases are driven by [`semantic-release`](.releaserc.cjs) on every push to `main` — Conventional Commit types decide the bump (`feat` → minor, `fix` → patch, `BREAKING` → major). Release notes are deterministic and structured via the local plugin [`scripts/commit-pr/semantic-release-structured-notes.cjs`](scripts/commit-pr/semantic-release-structured-notes.cjs); an optional bounded AI summary runs only when `RELEASE_NOTES_AI=true` and an endpoint/model/API key are configured. Preview locally with `pnpm release:dry`.

This repo is **not published to npm** — it is distributed as an agent skill via the `skills` CLI. `package.json` is `"private": true` and `npmPublish` is `false`, so `semantic-release` versions and tags the repo (and updates `CHANGELOG.md`) without ever publishing a package.

## Installation

Requirements:

- Node 24+ (see `.nvmrc` and `package.json` engines)
- pnpm 10+ (see `packageManager`)

Install:

    pnpm install

## What Not To Do

- Do not commit secrets or `.env`
- Do not bypass commitlint or disable hooks
- Do not edit the vendored copies in consumer repos directly — change the catalog here and re-sync
