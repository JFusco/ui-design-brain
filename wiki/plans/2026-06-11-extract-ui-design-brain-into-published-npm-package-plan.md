---
status: implemented
executed: 2026-06-11
date: 2026-06-11
evidence:
  - "PR #9 https://github.com/verndale/ui-design-brain/pull/9 (merged 2026-07-23)"
source_tool: claude
source: "/Users/joe.fusco/Desktop/claude-plans-organized/ui-design-brain/executed/2026-06-11-extract-ui-design-brain-into-published-npm-package-plan.md"
topics: [packaging-and-distribution]
---
# Plan: Extract `@verndale/ui-design-brain` into its own published repo

## Context

The `ui-design-brain` catalog (canonical UI component names, `patterns-manifest.json`, `index.md`, and 60 `patterns/*.md` guidance files) currently lives **vendored in two repos**:

- ai-orchestration → `frontend-ai/skills/ui-design-brain/` (64 files; has its own `SKILL.md` + pipeline-framed `README.md`)
- ba-cockpit → `skills/_shared/ui-design-brain/` (63 files; no `SKILL.md`, BA-framed `README.md`)

The **content is byte-for-byte identical** across both; only the wrappers differ. Every catalog edit must currently be hand-applied twice — that is the drift risk. Originally this was a git submodule from `github.com/carmahhawwari/ui-design-brain`; the team deliberately vendored away from it (`chore(skills): Vendor ui-design-brain without submodule`).

**Goal:** one versioned source of truth, materialized into committed files in each consumer, so a single edit ships to both repos with no drift.

**Hard constraint — submodule inception:** the parent repos are themselves consumed downstream — ai-orchestration as a **git submodule** (downstream symlinks its working-tree `frontend-ai/skills/` into `.cursor/.claude/.agents`), and ba-cockpit as a **built `.plugin` zip** (its `skills/` tree is zipped at build time). So the catalog **must remain plain committed files** in each parent's working tree. A submodule for `ui-design-brain` would create a submodule-inside-a-submodule downstream; a live `node_modules` dependency would be invisible to the symlink target and absent from the plugin zip. Both are disallowed.

## Approach (decided)

- **Delivery:** npm package `@verndale/ui-design-brain` as single source of truth → materialized into each consumer's committed catalog path by a **sync script**. Matches the existing `@verndale/ai-commit` / `@verndale/ai-pr` convention.
- **npm visibility:** **public** (like ai-commit/ai-pr) → `publishConfig.access = "public"`, `npmPublish: true`.
- **Scope:** new repo **+ wire both consumers** (ai-orchestration and ba-cockpit, on separate branches/PRs).
- **Package ships invariant content only** (`patterns/`, `patterns-manifest.json`, `index.md`, plus a neutral package README that is NOT synced). Each consumer **keeps its own wrapper** (ai-orchestration's `SKILL.md` + framed README; ba-cockpit's `_shared` README). The sync contract: **sync `patterns/`, `patterns-manifest.json`, `index.md`; never touch the consumer's `SKILL.md` / `README.md`.**

> Git-ops note (per standing rule): I will deliver uncommitted working-tree changes + suggested commit messages only. Creating the GitHub repo, first push, and the npm publish are done by Joe.

## Part 1 — New repo: `@verndale/ui-design-brain`

Local path: `/Users/joe.fusco/Projects/@verndale/ui-design-brain` (sibling to the others). Mirror the org template from ai-orchestration, minus build/bin (markdown-only).

```
ui-design-brain/
├── package.json                 # content-only; files:["content"]; exports; public publishConfig
├── .releaserc.cjs               # copy ai-orchestration/.releaserc.cjs; flip @semantic-release/npm npmPublish -> true
├── .npmrc                       # engine-strict=true (publish auth via CI env)
├── .nvmrc                       # 24.14.0
├── .gitignore                   # .DS_Store, .env, /node_modules
├── .env-example                 # copy ai-orchestration/.env-example (ai-commit/ai-pr keys)
├── .husky/commit-msg            # pnpm exec ai-commit lint --edit "$1"
├── .husky/prepare-commit-msg    # pnpm exec ai-commit prepare-commit-msg "$1" "$2"
├── .github/workflows/release.yml    # copy ai-orchestration release.yml (+ NPM_TOKEN for publish)
├── .github/workflows/pr.yml         # copy verbatim
├── .github/workflows/commitlint.yml # copy verbatim
├── README.md                    # NEUTRAL package README (NOT synced into consumers)
├── LICENSE
├── CONTRIBUTING.md              # adapt ai-orchestration/CONTRIBUTING.md
└── content/                     # the shipped payload (the only thing consumers sync)
    ├── index.md
    ├── patterns-manifest.json
    └── patterns/*.md            # 60 files
```

`package.json` essentials (content-only — no build, no bin, no main):

```json
{
  "name": "@verndale/ui-design-brain",
  "version": "0.0.0-development",
  "description": "Versioned catalog of production-grade UI component patterns (markdown + manifest) shared across Verndale AI tooling.",
  "license": "MIT",
  "packageManager": "pnpm@10.33.0",
  "engines": { "node": ">=24.14.0" },
  "files": ["content"],
  "exports": {
    "./content/*": "./content/*",
    "./patterns-manifest.json": "./content/patterns-manifest.json",
    "./index.md": "./content/index.md",
    "./package.json": "./package.json"
  },
  "publishConfig": { "access": "public" },
  "scripts": {
    "prepare": "husky",
    "commit": "ai-commit run",
    "pr:create": "ai-pr",
    "release:dry": "semantic-release --dry-run"
  },
  "devDependencies": {
    "@commitlint/cli": "^21.0.2",
    "@semantic-release/changelog": "^6.0.3",
    "@semantic-release/commit-analyzer": "^13.0.1",
    "@semantic-release/git": "^10.0.1",
    "@semantic-release/github": "^12.0.8",
    "@semantic-release/npm": "^13.1.5",
    "@semantic-release/release-notes-generator": "^14.1.1",
    "@verndale/ai-commit": "^2.6.3",
    "@verndale/ai-pr": "^1.3.5",
    "husky": "^9.1.7",
    "semantic-release": "^25.0.3"
  }
}
```

**Differences vs. ai-commit/ai-pr (because markdown-only + this one actually publishes):**
1. `files: ["content"]` + `exports` declare the payload/entry points (parents are `private:true` and never publish).
2. **Publishes to npm:** in the copied `.releaserc.cjs`, set `@semantic-release/npm` `npmPublish: true` (parents use `false`) and add `publishConfig.access: "public"`. This is the one substantive `.releaserc.cjs` change.
3. `release.yml` needs `NPM_TOKEN` (and `registry-url: https://registry.npmjs.org`) since it publishes; parents don't.
4. No `build`, no `bin`, no `main`/`module`; no `evals.yml` (nothing to eval).
5. `.releaserc.cjs` references a local `./scripts/commit-pr/semantic-release-structured-notes.cjs` in the parents — either copy that script in too, or drop that plugin line and rely on `@semantic-release/release-notes-generator`. Prefer copying it to keep release notes on org style.

## Part 2 — Sync + verify script (added to each parent repo)

Add `scripts/sync-ui-design-brain.cjs` to each parent. It copies invariant content from `node_modules/@verndale/ui-design-brain/content` into the committed catalog path, preserving the wrapper.

Target paths:
- ai-orchestration → `frontend-ai/skills/ui-design-brain/`
- ba-cockpit → `skills/_shared/ui-design-brain/`

Logic (identical except `TARGET`):
```
SRC    = node_modules/@verndale/ui-design-brain/content
SYNCED = ["index.md", "patterns-manifest.json", "patterns"]   // NEVER README.md / SKILL.md
sync:    for each in SYNCED -> rm TARGET/<each>; copy SRC/<each> -> TARGET/<each>
         leave TARGET/README.md and TARGET/SKILL.md untouched; print synced package version
--check: re-materialize to a temp dir, diff against committed TARGET (synced entries only), exit non-zero on any diff
```

package.json additions (each parent):
```json
"scripts": {
  "uidb:sync":   "node scripts/sync-ui-design-brain.cjs",
  "uidb:verify": "node scripts/sync-ui-design-brain.cjs --check"
}
```
- Add `@verndale/ui-design-brain` to each parent's `devDependencies`, **pinned exactly** (no `^`/`~`), e.g. `"@verndale/ui-design-brain": "1.0.0"`.
- CI: add a `uidb:verify` step (in `pr.yml` or a new tiny job): `pnpm install --frozen-lockfile && pnpm run uidb:verify`. Drift between the committed catalog and the pinned version fails the PR.

## Part 3 — Cutover per consumer (separate branch/PR each)

Bootstrapping order: the package must be installable first. For local validation before the public publish exists, temporarily resolve via `file:`/`link:` to the local repo, prove sync produces a **no-op diff**, then switch the pin to the published version.

For each of ai-orchestration and ba-cockpit:
1. Branch off `main`.
2. Note the wrapper files to preserve — ai-orchestration: `SKILL.md` + framed `README.md`; ba-cockpit: `_shared` `README.md`.
3. Add the pinned devDependency (`pnpm add -D @verndale/ui-design-brain@<version>`).
4. Add `scripts/sync-ui-design-brain.cjs` + the `uidb:sync`/`uidb:verify` scripts.
5. Run `pnpm run uidb:sync`. **Expected: zero diff** to `patterns/`, `patterns-manifest.json`, `index.md` (content already matches) — this proves the sync is faithful. Any diff there means the package content is wrong; fix before continuing.
6. Confirm `git status` shows the wrapper untouched.
7. **ai-orchestration only:** repoint the 3 stale upstream URLs from `github.com/carmahhawwari/ui-design-brain` → `github.com/verndale/ui-design-brain`, and note the catalog is now vendored via `pnpm run uidb:sync`:
   - `AGENTS.md:34`
   - `frontend-ai/README.md:75`
   - `frontend-ai/README.md:80`
8. Hand off uncommitted changes + suggested conventional-commit messages (Joe commits/pushes/PRs).

## Part 4 — Drift prevention

- **Exact pins** in each parent + `pnpm-lock.yaml` integrity hash lock the bytes.
- **Committed-copy == pinned-version invariant** enforced by `uidb:verify` in CI → drift cannot merge, and while both repos pin the same version they cannot diverge.
- **Upgrade flow:** bump pin → `pnpm install` → `pnpm run uidb:sync` → commit (the `patterns/` diff is the human-reviewable catalog changelog) → repeat in the other repo.

## Files to reference / touch

New repo (template sources, copy from ai-orchestration):
- `/Users/joe.fusco/Projects/@verndale/ai-orchestration/package.json`
- `/Users/joe.fusco/Projects/@verndale/ai-orchestration/.releaserc.cjs` (flip `npmPublish` → true; add public access)
- `/Users/joe.fusco/Projects/@verndale/ai-orchestration/.github/workflows/{release,pr,commitlint}.yml`
- `/Users/joe.fusco/Projects/@verndale/ai-orchestration/.husky/{commit-msg,prepare-commit-msg}`
- `/Users/joe.fusco/Projects/@verndale/ai-orchestration/{CONTRIBUTING.md,.env-example,.nvmrc,.npmrc,.gitignore}`
- Content source: `/Users/joe.fusco/Projects/@verndale/ai-orchestration/frontend-ai/skills/ui-design-brain/{index.md,patterns-manifest.json,patterns/}`

ai-orchestration (consumer wiring):
- `package.json` (pin + scripts), new `scripts/sync-ui-design-brain.cjs`
- Preserve `frontend-ai/skills/ui-design-brain/SKILL.md` + `README.md`
- Repoint URLs: `AGENTS.md:34`, `frontend-ai/README.md:75`, `frontend-ai/README.md:80`
- Runtime gate that must keep passing (unchanged path): `frontend-ai/skills/agent-orchestrator/references/preflight.md:31`

ba-cockpit (consumer wiring):
- `package.json` (pin + scripts), new `scripts/sync-ui-design-brain.cjs`
- Preserve `skills/_shared/ui-design-brain/README.md`
- Plugin build that must still bundle the catalog: `CONTRIBUTING.md:151-170`
- Do NOT move `skills/_shared/a11y-semantics.md` (ba-cockpit-specific, not part of the catalog)

## Verification

New repo:
- `pnpm install` then `pnpm run release:dry` (semantic-release config parses; would publish public).
- Confirm `content/` payload matches the current vendored catalog (sync into a consumer yields zero diff).

ai-orchestration:
- `pnpm run uidb:sync` → **zero diff** on `patterns/`, `patterns-manifest.json`, `index.md`; wrapper untouched.
- `pnpm run uidb:verify` passes.
- `pnpm run evals:all` (evals:check + evals:validators) passes — catalog path/manifest unchanged, so runtime gates and `.mdc` rules still resolve `patterns-manifest.json`.

ba-cockpit:
- `pnpm run uidb:sync` → zero diff; `pnpm run uidb:verify` passes.
- `pnpm run evals:check` passes (no eval depends on the catalog).
- Rebuild the `.plugin` zip per `CONTRIBUTING.md:151-170`; confirm `skills/_shared/ui-design-brain/` (patterns + manifest + index + BA README) is present inside `dist/cumulative-conductor.plugin` — the real end-to-end check for ba-cockpit's delivery path.
