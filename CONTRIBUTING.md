# Contributing

This repository is the single source of truth for the `ui-design-brain` catalog, distributed as a private exact-version agent-skill projection. It enforces strict catalog, digest, and commit standards so consuming repositories receive identical generated content.

## Quick Start (TL;DR)

    pnpm install
    git checkout -b feat/my-pattern-change
    # edit files under skills/ui-design-brain/
    pnpm verify:ci
    git add -A
    pnpm commit
    git push

## What lives here

A single agent skill, under `skills/ui-design-brain/`:

- `skills/ui-design-brain/SKILL.md` — skill entry point (frontmatter + workflow)
- `skills/ui-design-brain/index.md` — entry point for narrowing components
- `skills/ui-design-brain/patterns-manifest.json` — canonical names, aliases, alias-resolution rules
- `skills/ui-design-brain/patterns/*.md` — one guidance file per pattern

**Authoring a pattern:** copy `skills/_meta/_pattern-template.md` to `skills/ui-design-brain/patterns/<slug>.md` and follow `skills/_meta/_sections.md` (the canonical pattern structure). `skills/_meta/` is authoring-only — it has no `SKILL.md`, so it is never loaded at runtime or projected to consumers. Then complete the catalog-integrity sync (manifest + `index.md` + README count) and run `pnpm catalog:build`.

The `SKILL.md` `description` is shared by every consumer, so keep it neutral enough to read well for both spec/acceptance-criteria authoring and interface-code generation.

## Maintaining `AGENTS.md`

`AGENTS.md` is the canonical, tool-agnostic agent guide (`CLAUDE.md` is a thin `@AGENTS.md` import). When editing it, follow AGENTS.md best practices: keep it lean (≤~150 lines), use progressive disclosure (link to `skills/_meta/`, `README.md`, etc. instead of inlining), pair every "don't" with a "do", and never include secrets.

- Official spec: <https://agents.md>
- Empirical patterns: <https://www.augmentcode.com/blog/how-to-write-good-agents-dot-md-files>
- General guide: <https://gist.github.com/0xfauzi/7c8f65572930a21efa62623557d83f6e>

## Commit Messages (Required)

We enforce **Conventional Commits** through **`@verndale/ai-commit`** (commitlint preset). Types: `build`, `chore`, `ci`, `docs`, `feat`, `fix`, `perf`, `refactor`, `revert`, `style`, `test`.

Format (scope is **required**):

    type(scope): Short subject

Examples:

    feat(patterns): Add command-palette pattern
    fix(manifest): Correct banner alias resolution
    docs(readme): Clarify consumer sync flow

The first line is validated by **commitlint** via the `commit-msg` hook and in CI. Scope is required and lowercase; the subject is required, cannot end in a period, and is limited to 50 characters. The full header is limited to 120 characters and body/footer lines to 72. Subject casing is intentionally unrestricted. Conventional breaking-change/revert parsing and Commitlint's upstream default ignores are preserved; there is no repository-specific scope allowlist or ignore callback.

The root [`commitlint.config.cjs`](commitlint.config.cjs) consumes the public `@verndale/ai-commit` export. The blocking local hook, the squash-merge PR title, and every commit in the immutable PR base/head range all use that same config. `pnpm lint:commits:last` is only a local one-commit convenience; CI always checks the full PR range. With the pinned pnpm 10, pass flags directly (`pnpm run lint:commit --edit …`): inserting a standalone `--` forwards it to Commitlint and causes following flags to be treated as positional input. Use `pnpm commit` (runs `ai-commit run`) for AI-assisted authoring; `OPENAI_API_KEY` in `.env` is optional. The direct `commitlint` hook remains authoritative.

## Quality gates

- `pnpm lint` checks all first-party `.js`, `.cjs`, and `.mjs` files without modifying them; generated graph data and vendored viewer libraries are explicit exclusions.
- `pnpm lint:fix` is the opt-in whole-repository fixer. The pre-commit hook fixes only staged JavaScript through lint-staged and blocks if errors remain.
- `pnpm test:fast` checks catalog digest freshness and the existing graph contract suite.
- `pnpm test` adds graph lifecycle, projection, adoption, dirty-file refusal, and packed offline-consumer coverage. `pnpm verify:push` runs that full suite, and `pnpm verify:ci` adds full lint. There is no typecheck command because this repository has no first-party TypeScript implementation.

## How changes reach consumers

1. Land your change here and merge to `main`.
2. Release an immutable public npm package and update each consumer's exact lockfile pin and `ui-design-brain.config.json` in one reviewable change.
3. Run the installed package's `sync --if-needed` command and commit the marker-owned projection plus `projection-manifest.json`.

Consumer hooks invoke the already-installed exact package directly with Node. They never run `npx`, contact a registry, choose a newer version, or alter a lockfile. The one-time `sync --adopt` migration accepts only a byte-identical legacy catalog (with semantic-equivalent JSON formatting) before atomically adding ownership and provenance.

## Repository automation

| Workflow | Trigger | Purpose |
| --- | --- | --- |
| [`.github/workflows/commitlint.yml`](.github/workflows/commitlint.yml) | PRs to `main`, including title edits | `Commit message lint / commitlint`: same-config checks for PR title + immutable base/head range |
| [`.github/workflows/quality.yml`](.github/workflows/quality.yml) | PRs to `main`, `workflow_dispatch` | `Quality / quality`: lint + lifecycle self-tests + the check-only graph contract |
| [`.github/workflows/pr.yml`](.github/workflows/pr.yml) | Pushes to non-`main`, `workflow_dispatch` | Dogfood: install deps, run **`pnpm run pr:create`** |
| [`.github/workflows/release.yml`](.github/workflows/release.yml) | Pushes to `main` | verifies the source and clean tarball consumer, then `semantic-release`: public npm publication, version bump, `CHANGELOG.md`, Git tag + GitHub Release |

Add repository secret **`PR_BOT_TOKEN`** (classic PAT with **`repo`**) if the default **`GITHUB_TOKEN`** is not enough for **`pr.yml`**.

Releases are driven by [`semantic-release`](.releaserc.cjs) on every push to `main` — Conventional Commit types decide the bump (`feat` → minor; `build`, `chore`, `ci`, `docs`, `fix`, `perf`, `refactor`, `revert`, `style`, and `test` → patch; `!` → major). The release workflow rejects aggregated `BREAKING CHANGE` bodies, runs the same source and packed-consumer gates as Accessibility Standards, and publishes through npm trusted publishing with GitHub Actions OIDC. No npm token or AI release-notes service is used. Preview locally with `pnpm release:dry`.

The source repository remains private. The public package is limited to the audited npm allowlist in `package.json`; consumers install one exact registry version from their lockfile and never fetch or select versions in hooks. npm provenance remains disabled because npm does not support automatic provenance for a public package published from a private GitHub source repository.

## Installation

Requirements:

- Node 24+ (see `.nvmrc` and `package.json` engines)
- pnpm 10+ (see `packageManager`)

Install:

    pnpm install

## What Not To Do

- Do not commit secrets or `.env`
- Do not bypass commitlint or disable hooks
- Do not edit generated consumer projections directly — change the catalog here, release an exact version, and re-sync
