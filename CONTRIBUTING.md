# Contributing

This repository is the single source of truth for the `ui-design-brain` catalog, distributed as a public npm package with exact-version agent-skill projections. It enforces strict catalog, digest, and commit standards so consuming repositories receive identical generated content.

## Quick Start (TL;DR)

    pnpm install
    git checkout -b feat/my-pattern-change
    # edit files under skills/ui-design-brain/
    pnpm verify:ci
    git add -A
    git commit -m "chore(scope): Describe the change"
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

We enforce **Conventional Commits** through standalone **Commitlint**. Types: `build`, `chore`, `ci`, `docs`, `feat`, `fix`, `perf`, `refactor`, `revert`, `style`, `test`.

Format (scope is **required**):

    type(scope): Short subject

Examples:

    feat(patterns): Add command-palette pattern
    fix(manifest): Correct banner alias resolution
    docs(readme): Clarify consumer sync flow

The first line is validated by **commitlint** via the `commit-msg` hook and in CI. Scope is required and lowercase; the subject is required, cannot end in a period, and is limited to 50 characters. The full header is limited to 120 characters and body/footer lines to 72. Subject casing is intentionally unrestricted. Conventional breaking-change/revert parsing and Commitlint's upstream default ignores are preserved; there is no repository-specific scope allowlist or ignore callback.

The root [`commitlint.config.cjs`](commitlint.config.cjs) uses the conventional preset. The local hook, PR title, and every commit in the immutable PR range use the same policy. Open an issue-linked PR with `.github/pull_request_template.md` and validate the body with `pnpm run lint:pr`.

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
| [`.github/workflows/quality.yml`](.github/workflows/quality.yml) | PRs and pushes to `main`, `workflow_dispatch` | `Quality / quality`: lint + lifecycle self-tests + the check-only graph contract |
| [`.github/workflows/release.yml`](.github/workflows/release.yml) | Successful Quality on a main push | verifies the clean tarball consumer, then `semantic-release`: public npm publication, version bump, `CHANGELOG.md`, Git tag + GitHub Release |


Releases are driven by [`semantic-release`](.releaserc.cjs) after successful Quality on a push to `main` — Conventional Commit types decide the bump (`feat` → minor; `build`, `chore`, `ci`, `docs`, `fix`, `perf`, `refactor`, `revert`, `style`, and `test` → patch; `!` → major). The release workflow rejects aggregated `BREAKING CHANGE` bodies, runs the packed-consumer gate after Quality verifies the source, and publishes through npm trusted publishing with GitHub Actions OIDC. A temporary personal `NPM_BOOTSTRAP_TOKEN` is used only to establish the new npm package; remove it after configuring trusted publishing. No AI release-notes service is used. Preview locally with `pnpm release:dry`.

The public package is limited to the audited npm allowlist in `package.json`; consumers install one exact registry version from their lockfile and never fetch or select versions in hooks. Provenance is enabled for publication from the public personal repository.

## Ownership migration and release activation

The migration targets `JFusco/ui-design-brain` and the unscoped npm package
`ui-design-brain`. Keep the complete Git history, tags, releases, PRs, issues,
and tracked wiki. Preserve historical Verndale citations; GitHub redirects them
after transfer. Never recreate the old repository path.

The transfer attempt was rejected with `Organization members cannot transfer
repositories` (HTTP 422). A Verndale organization owner must transfer the
repository or change that policy. The source remains private until transfer and
public-content review are complete. Paused workflows were restored after the
rejection. No npm package has been renamed, published, or deprecated by this PR.

Complete these steps in order:

1. Pause Release, Sync context wiki, and Sync wiki issue state; record Git refs,
   repository settings, and GitHub record identities before the owner transfers
   the existing repository. Review the historical content before making it public.
2. Verify the same repository ID, Git refs, releases, PRs, issues, wiki content,
   and old-link redirects. Review collaborator and branch-rule changes. Update
   local `origin` to `git@github.com:JFusco/ui-design-brain.git`. The checkout is
   `/Users/joe.fusco/Projects/ui-design-brain`.
3. Merge the reviewed maintenance PR. Release requires the exact personal
   repository, public visibility, `NPM_RELEASE_ENABLED=true`, and successful
   Quality for a main push. Leave the variable unset until publishing is ready.
4. Authenticate as the intended npm owner and verify the unscoped name is
   available. Supply a short-lived personal publishing credential through the
   `NPM_BOOTSTRAP_TOKEN` Actions secret, never through repository files. This
   credential is for the new package; do not reuse organization credentials.
5. Set `NPM_RELEASE_ENABLED=true`, enable Release, and merge a reviewed
   release-activation PR updating this contributor guide so a substantive main
   push runs Quality and triggers the normal release path. Do not manually publish or tag. The first planned
   unscoped version is `1.18.3`; reconcile the schema release pin if intervening
   releases change the next version.
6. Verify the registry owner, version, repository URL, provenance, schema URLs,
   and clean consumer installation. Configure npm trusted publishing for owner
   `JFusco`, repository `ui-design-brain`, workflow `release.yml`, then remove
   `NPM_BOOTSTRAP_TOKEN`. Verify OIDC on the next reviewed release. Create the
   trusted publisher close to that release so its initial validation window
   does not expire.
7. Replace any transferred organization bot credential with an appropriate
   personal credential before enabling the wiki bots. Leave optional wiki AI
   disabled unless separately configured. Record the final migration receipts.

Deprecating `@verndale/ui-design-brain` and migrating other repositories are
separate follow-ups. Existing immutable package versions remain available.

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
