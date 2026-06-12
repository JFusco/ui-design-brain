# Contributing

This repository is the single source of truth for the `ui-design-brain` catalog. It enforces strict commit standards and automated releases so consuming repos can vendor identical, versioned content.

## Quick Start (TL;DR)

    pnpm install
    git checkout -b feat/my-pattern-change
    # edit files under content/
    git add -A
    pnpm commit
    git push

## What lives here

Only the catalog payload, under `content/`:

- `content/index.md` — entry point for narrowing components
- `content/patterns-manifest.json` — canonical names, aliases, alias-resolution rules
- `content/patterns/*.md` — one guidance file per pattern

Do **not** add a `SKILL.md` or a consumer-specific wrapper README here — those are owned by each consuming repo. This package ships invariant content only (see `files` in `package.json`).

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

1. Land your change here and let it release (below).
2. In each consumer (`ai-orchestration`, `ba-cockpit`), bump the pinned `@verndale/ui-design-brain` version, then run `pnpm run uidb:sync` and commit. The `content/`/`patterns/` diff there is the reviewable record of the change.

Consumers pin an **exact** version and run `pnpm run uidb:verify` in CI, so a release does not reach a consumer until that consumer bumps and re-syncs — and the two consumers cannot silently drift while pinned to the same version.

## Repository automation

| Workflow | Trigger | Purpose |
| --- | --- | --- |
| [`.github/workflows/commitlint.yml`](.github/workflows/commitlint.yml) | PRs to `main`, pushes to non-`main` | Commitlint on PR title + commit range |
| [`.github/workflows/pr.yml`](.github/workflows/pr.yml) | Pushes to non-`main`, `workflow_dispatch` | Dogfood: install deps, run **`pnpm run pr:create`** |
| [`.github/workflows/release.yml`](.github/workflows/release.yml) | Push to **`main`** | **semantic-release** — version bump, **`CHANGELOG.md`**, git tag, npm publish (with provenance), GitHub Release |

Add repository secret **`PR_BOT_TOKEN`** (classic PAT with **`repo`**) if the default **`GITHUB_TOKEN`** is not enough for **`pr.yml`**.

## Publishing (maintainers)

Releases run via **[semantic-release](https://github.com/semantic-release/semantic-release)** on push to **`main`** ([`.releaserc.json`](.releaserc.json)).

### Secrets and registry

- **`NPM_TOKEN`** (repo or org secret) — must allow **`npm publish`** in CI **without** an interactive OTP. The Release workflow sets **`NPM_TOKEN`** and **`NODE_AUTH_TOKEN`** from it.
  - **If the job fails with `EOTP` / “one-time password”:** 2FA is enforced on publish and the token cannot skip OTP. Fix in one of these ways:
    - **Classic token:** [npmjs.com](https://www.npmjs.com/) → **Access Tokens** → **Generate New Token** (classic) → type **Automation** (not “Publish”). Store as **`NPM_TOKEN`**.
    - **Granular token:** **New Granular Access Token** → enable **Bypass two-factor authentication (2FA)**. Under **Packages and scopes**, **Read and write** for **`@verndale/ui-design-brain`**. Leave **Allowed IP ranges** empty unless required (Actions egress is not a single fixed IP).
  - Or finish **[Trusted Publishing](https://docs.npmjs.com/trusted-publishers)** for this repo and package (OIDC); you may still need npm-side setup—see npm’s docs for your account.
- **`GITHUB_TOKEN`** — Provided by Actions. Checkout and **`@semantic-release/git`** use **`SEMANTIC_RELEASE_TOKEN`** when set; otherwise **`GITHUB_TOKEN`**.

**npm provenance:** [`.releaserc.json`](.releaserc.json) sets **`"provenance": true`** on **`@semantic-release/npm`**, which matches **npm Trusted Publishing** from this GitHub repo. On [npmjs.com](https://www.npmjs.com/), enable **Trusted Publishing** for this package linked to **`verndale/ui-design-brain`** (or your fork). If publish fails until that works, finish Trusted Publishing or temporarily set **`"provenance": false`** in **`.releaserc.json`** (you lose the provenance badge).

### Branch protection

semantic-release pushes a **release commit** and **tag** back to **`main`** via **`@semantic-release/git`**. If **`main`** is protected and the default token cannot push, either allow **GitHub Actions** to bypass protection for this repository, or add a PAT (classic: **`repo`**; fine-grained: **Contents** read/write) as **`SEMANTIC_RELEASE_TOKEN`**. The Release workflow passes **`SEMANTIC_RELEASE_TOKEN || GITHUB_TOKEN`** to checkout and to semantic-release as **`GITHUB_TOKEN`**.

### Commits that produce releases

**Conventional Commits** on **`main`** drive the analyzer (patch / minor / major) using each commit’s **first line**; PR bodies do not replace that.

With default [`.releaserc.json`](.releaserc.json) (no custom **`releaseRules`**), types like **`chore`**, **`docs`**, **`ci`**, **`style`**, **`test`**, **`build`** do **not** bump version or update **`CHANGELOG.md`**. For user-facing releases, use **`feat`**, **`fix`**, **`perf`**, **`revert`**, or breaking markers. With **squash merge**, the merged message is usually the **PR title**—keep it commitlint-clean.

To release from **`chore`**/**`docs`**-only merges, maintainers can add **`releaseRules`** to **`@semantic-release/commit-analyzer`** in **`.releaserc.json`**; the default skips those types so releases stay signal-heavy.

**Local try:** `pnpm release:dry` (no publish) or `pnpm release` (needs tokens and git state; use a fork or **`--dry-run`** as appropriate).

## Installation

Requirements:

- Node 24+ (see `.nvmrc` and `package.json` engines)
- pnpm 10+ (see `packageManager`)

Install:

    pnpm install

## What Not To Do

- Do not commit secrets or `.env`
- Do not bypass commitlint or disable hooks
- Do not add wrapper files (`SKILL.md`, consumer READMEs) to `content/`
