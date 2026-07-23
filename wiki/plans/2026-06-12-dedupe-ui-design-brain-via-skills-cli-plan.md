---
status: implemented
executed: 2026-06-12
date: 2026-06-12
evidence: []
source_tool: claude
source: "/Users/joe.fusco/Desktop/claude-plans-organized/ui-design-brain/executed/2026-06-12-dedupe-ui-design-brain-via-skills-cli-plan.md"
topics: [packaging-and-distribution]
---
# Plan: De-duplicate `ui-design-brain` via the `skills` CLI (vercel-labs/skills)

## Context

`ui-design-brain` (a catalog of 60 canonical UI component patterns + a manifest + an index) is currently **duplicated** across three places, with byte-identical catalog content that drifts by hand:

- **Source repo** — `git@github.com:verndale/ui-design-brain.git` (already its own repo, on `main`, clean). Catalog under `content/`. Published to npm as `@verndale/ui-design-brain` via semantic-release. **No `SKILL.md`.**
- **ai-orchestration** — `frontend-ai/skills/ui-design-brain/` (catalog + a local FE-specific `SKILL.md` wrapper). The whole `frontend-ai/skills/` dir is symlinked downstream; this repo ships as a git submodule.
- **ba-cockpit** — `skills/_shared/ui-design-brain/` (catalog, **no `SKILL.md`** — deliberately non-discoverable). Ships as a bundled `.plugin` zip built from `skills/`.

The goal: one source of truth, pulled into both consumers with `npx skills add` and refreshed with one command — no more hand-syncing, and **no npm package** consumption. The standalone repo already exists; it just isn't `skills`-CLI-installable yet.

**Decisions already made by the user:**
- **Scope:** de-dup *all three* (source prep + both consumers) in this plan.
- **npm:** remove npm/semantic-release entirely; `skills` CLI becomes the only distribution path.
- **Trigger:** ui-design-brain becomes a real, discoverable `SKILL.md` skill with **one shared "scoped reference" description** (it lands in both repos, so the description must read well for both BA specs/AC and FE interface code, and be narrow enough not to misfire).

**Commit policy:** Per repo rule, I will NOT commit/push. I deliver uncommitted working-tree changes across the three repos plus suggested commit messages; Joe commits and pushes.

## Confirmed mechanism (read from vercel-labs/skills `src/*`)

- Install dir = `join(cwd, agent.skillsDir)`. We use the **allowed `claude-code` agent only** (its `skillsDir` is `.claude/skills`) — company policy forbids the `openclaw`/non-standard agent presets. To land files in each consumer's bespoke dir we run the CLI in a **throwaway temp working dir**, then a tiny committed **sync script** relocates the real files into `skills/ui-design-brain` (ba-cockpit) / `frontend-ai/skills/ui-design-brain` (ai-orchestration).
- `--copy` against a **git URL or a local filesystem path** clones/reads the source, then `copyDirectory` recurses the whole `skills/ui-design-brain/` folder (SKILL.md + index.md + patterns-manifest.json + patterns/) as **plain committed files**. (The "SKILL.md-only" path is a different code path used only for skills.sh blob downloads — not us.)
- Lockfile `.skill-lock.json` is written **globally** (`~/.agents/` / `$XDG_STATE_HOME/skills/`), never in the repo. So nothing to commit, nothing to exclude from the zip — and no per-repo manifest, so "update" = re-running the sync script.

### Why not symlinks (de-dup is logical, not a shared inode)

Both consumers re-distribute, and a committed symlink dangles at the destination because its target isn't present there:
- **ba-cockpit** `.plugin` zip + fresh clones/CI: a symlinked `skills/ui-design-brain` → source repo breaks for anyone without the source repo as a sibling, and `zip` deref of symlinked *directories* is unreliable.
- **ai-orchestration** submodule: `frontend-ai/skills/` is symlinked downstream; a committed inner symlink would have to resolve on every consumer machine, where only ai-orchestration exists → the real files must live inside it → no cross-repo de-dup.

So each consumer holds a **real, committed copy** kept in sync by re-running the sync script against the single source repo.

## Phase A — Source repo (`~/Projects/@verndale/ui-design-brain`) — do first

1. **Restructure the catalog** so the repo is a valid `skills` source:
   - Move `content/index.md`, `content/patterns-manifest.json`, `content/patterns/` → `skills/ui-design-brain/`.
   - Result: `skills/ui-design-brain/{index.md, patterns-manifest.json, patterns/*.md}`.
2. **Author `skills/ui-design-brain/SKILL.md`** with the shared scoped-reference description (≤1024 chars, no `<…>` tags, lowercase `name: ui-design-brain`, states what + when with trigger phrases). Draft:
   > Canonical catalog of production-grade UI component patterns (per-pattern guidance, a manifest of canonical names and aliases, and an index). Consult before naming or building any UI primitive — accordion, modal, dropdown, form, navigation, table, toast, tabs, and more — to resolve a design label to one canonical component and load its pattern guidance. Use when writing a component spec or acceptance criteria, or when generating interface code, so spec, AC, and implementation share the same component vocabulary instead of guessing.

   Body: port the existing ai-orchestration `SKILL.md` workflow/guardrails (it's already well-formed), pointing at `index.md` → `patterns-manifest.json` → `patterns/<slug>.md`.
3. **Remove npm / semantic-release only** (keep commit hygiene):
   - Delete `.releaserc*` and the npm-publish workflow under `.github/workflows/` (verify the exact filename — likely `release.yml`).
   - In `package.json`: remove `exports`, `files`, `publishConfig`, release scripts, and `semantic-release` + `@semantic-release/*` devDeps; set a static `version` or `"private": true`.
   - **Keep** `.husky/*`, commitlint, and any `commitlint.yml`/`pr.yml` — they enforce Conventional Commits, not releases. Only remove them if Joe also wants to drop commit-message discipline (ask before deleting).
4. **Rewrite `README.md`** to skills-CLI install/update instructions; delete the stale `pnpm add -D @verndale/ui-design-brain` + `uidb:sync`/`uidb:verify` narrative.
5. Verify no other workflow/script references the deleted release job.

Critical files: `package.json`, `.releaserc*`, `.github/workflows/*`, `README.md`, `content/` → `skills/ui-design-brain/`.

## Phase B — ba-cockpit (`~/Projects/@verndale/ba-cockpit`)

1. **Delete** `skills/_shared/ui-design-brain/` (including its `README.md`).
2. **Add a committed sync script** `scripts/sync-ui-design-brain.sh` and run it from repo root. It uses the allowed `claude-code` agent in a temp dir, then relocates the real files into `skills/ui-design-brain/`:
   ```bash
   #!/usr/bin/env bash
   set -euo pipefail
   SRC="${1:-git@github.com:verndale/ui-design-brain.git}"   # pass a local path for pre-push dev
   TMP="$(mktemp -d)"
   ( cd "$TMP" && npx skills add "$SRC" --copy --skill ui-design-brain -a claude-code -y )
   rm -rf skills/ui-design-brain
   mv "$TMP/.claude/skills/ui-design-brain" skills/ui-design-brain
   rm -rf "$TMP"
   ```
   Initial run (before the source is pushed) passes the local path: `./scripts/sync-ui-design-brain.sh /Users/joe.fusco/Projects/@verndale/ui-design-brain`. Expect `skills/ui-design-brain/` with SKILL.md + full catalog as regular files.
3. **Fix references** (dir moved out of `_shared/`):
   ```
   grep -rln '_shared/ui-design-brain' skills/
   sed -i '' 's#_shared/ui-design-brain#ui-design-brain#g' <those files>
   grep -rn '_shared/ui-design-brain' skills/   # expect zero
   ```
   Depth-agnostic substring swap covers all hits in `ba-spec-writer/SKILL.md`, `ba-spec-writer/references/spec-template.md`, `acceptance-criteria-writer/references/writing-rules.md`. **Leave** the bare `ui-design-brain/patterns/` ref in `skills/_shared/a11y-semantics.md` — it's already correct post-move.
4. **Docs:** update `CONTRIBUTING.md` "Shared references" prose (lines ~94–116) so it no longer lists ui-design-brain under `_shared/`; remove the deleted `_shared` README mention.
5. **Eval guard:** CONTRIBUTING (~line 61) states every shipped `skills/*/SKILL.md` needs a centralized eval suite. `scripts/evals/check.cjs` won't break mechanically, but confirm the policy guard — add a minimal eval scenario for `ui-design-brain` or exempt it.
6. **Release:** minor version bump in `.claude-plugin/plugin.json` + `CHANGELOG.md` (restructured reference layout). Rebuild the `.plugin` zip (the `zip -r ... skills ...` command auto-includes `skills/ui-design-brain/`; no `-x` change needed) and run the post-build validations (no XML-like tags in any `SKILL.md` description, etc.).

Critical files: `skills/ba-spec-writer/SKILL.md`, `skills/ba-spec-writer/references/spec-template.md`, `skills/acceptance-criteria-writer/references/writing-rules.md`, `skills/_shared/a11y-semantics.md`, `CONTRIBUTING.md`, `.claude-plugin/plugin.json`, `CHANGELOG.md`.

## Phase C — ai-orchestration (`~/Projects/@verndale/ai-orchestration`)

1. **Delete** `frontend-ai/skills/ui-design-brain/` (catalog + the old FE-specific `SKILL.md`/`README.md`).
2. **Add a committed sync script** `frontend-ai/scripts/sync-ui-design-brain.sh` — same as ba-cockpit's but the relocate target is `frontend-ai/skills/ui-design-brain` (run from the `frontend-ai/` dir):
   ```bash
   #!/usr/bin/env bash
   set -euo pipefail
   SRC="${1:-git@github.com:verndale/ui-design-brain.git}"
   TMP="$(mktemp -d)"
   ( cd "$TMP" && npx skills add "$SRC" --copy --skill ui-design-brain -a claude-code -y )
   rm -rf skills/ui-design-brain
   mv "$TMP/.claude/skills/ui-design-brain" skills/ui-design-brain
   rm -rf "$TMP"
   ```
   Real committed copy is **mandatory** (a symlink would break submodule + downstream symlink redistribution — Risk R3). Initial run uses the local path as above.
3. **No reference-path edits** — same location. The ~11 rule/skill references only pre-flight-check that `frontend-ai/skills/ui-design-brain/patterns-manifest.json` *exists*; they don't read the description, so replacing the FE-specific SKILL.md with the shared one is safe.
4. **Docs:** update `AGENTS.md` and `frontend-ai/README.md` provenance to point at `git@github.com:verndale/ui-design-brain.git` and the `npx skills` workflow. **Fix the wrong fork URL** in `frontend-ai/README.md` (~line 80: `carmahhawwari/ui-design-brain` → `verndale/ui-design-brain`). Keep the downstream symlink instructions for `frontend-ai/skills/`.

Critical files: `frontend-ai/skills/ui-design-brain/` (replaced), `AGENTS.md`, `frontend-ai/README.md`.

## Cross-cutting

- **Documented update workflow** (committed in both repos): re-run the repo's `sync-ui-design-brain.sh` with no argument (defaults to the git URL, so it works off `main` after Joe pushes the source). Note there's no committed lockfile — re-running the script IS the update. Optionally pin the CLI version inside the script (`npx skills@<x.y.z> ...`) so the fetch behavior can't shift (Risk R2).
- **Ordering:** Phase A's restructure must exist in the source **working tree** before B/C (the local-path vendor reads it). The *git-URL* update command only works after Joe commits + pushes A to `main`.
- **Memory:** after implementation, update `memory/project_ui_design_brain_package.md` — it currently describes the npm + `uidb:sync`/`uidb:verify` model, which this change supersedes.

## Risks (accepted / mitigated)

- **R1 — ba-cockpit gains a discoverable skill** (was deliberately non-discoverable). Accepted per the "scoped reference" decision; the narrow description minimizes misfire in the BA plugin.
- **R2 — CLI behavior could shift between versions.** We only use the allowed `claude-code` agent + a temp dir + `mv` (no `openclaw`/non-standard presets). Mitigate further by pinning the CLI version inside the sync script.
- **R3 — symlinks break downstream travel.** Each consumer commits real files via `--copy` + relocate; never commit a symlink (see "Why not symlinks"). Verify the vendored entries are regular files, not links.
- **R4 — over-deleting commit tooling in source.** Only delete release config; keep husky/commitlint unless told otherwise.
- **R5 — stale `uidb:sync`/`uidb:verify` wiring.** Earlier scan found none in either consumer; re-grep package.json/CI during teardown to be safe.

## Verification

1. **Mechanism check first** (cheapest failure): after Phase A restructure, run ba-cockpit's `sync-ui-design-brain.sh` against the local path and confirm `skills/ui-design-brain/` contains `SKILL.md` + `patterns-manifest.json` + all 60 `patterns/*.md` as **regular files** (`ls -la` shows no `->` symlink arrows). Confirm the temp dir was cleaned up. Repeat for Phase C's script targeting `frontend-ai/skills/ui-design-brain/`.
2. **ba-cockpit:** `grep -rn '_shared/ui-design-brain' skills/` → zero; `grep -rn 'ui-design-brain' skills/` → every hit resolves under `skills/ui-design-brain/`. Build the zip; `unzip -l dist/cumulative-conductor.plugin | grep ui-design-brain` shows the catalog under `skills/ui-design-brain/`; confirm `.skill-lock.json` is NOT in the zip. Run the eval suite if the SKILL.md→eval guard is enforced.
3. **ai-orchestration:** confirm `frontend-ai/skills/ui-design-brain/patterns-manifest.json` exists at the unchanged path; spot-check that a pre-flight reference (e.g. `frontend-ai/skills/agent-orchestrator/references/preflight.md`) still resolves. Confirm the new SKILL.md description is the shared one.
4. **Source repo:** `npm pack`/publish is gone — confirm `package.json` no longer has `publishConfig`/`files`/`exports` and the release workflow is deleted; `git status` shows the `content/` → `skills/ui-design-brain/` move.
5. **End-to-end de-dup:** all three locations now derive from the single `skills/ui-design-brain/` source; a future catalog change is propagated by re-running the documented `npx skills add` command in each consumer.

---

# Addendum: Automate the sync (CI-driven PRs)

## Context

The migration above leaves propagation manual (`pnpm uidb:sync` by hand). To keep the two consumers fresh without anyone remembering to run it, add CI that re-vendors the catalog and **opens a reviewable PR** when the committed copy drifts from the source repo's `main`. Per the user's choices: **scheduled (weekly) + a manual button**, self-contained in each consumer (no source-repo changes, no cross-repo dispatch token), and for **ba-cockpit the workflow also rebuilds the committed `.plugin`** so the deliverable stays consistent. PRs only — never a direct push to `main`.

Reuses what already exists: the standard Node 24 + pnpm-via-corepack + `pnpm install --frozen-lockfile` setup, the `pnpm uidb:sync` script (already takes a `SRC` arg), and the `@verndale/ai-pr` (`pnpm pr:create`) + `PR_BOT_TOKEN` PR flow. Only GitHub- and org-owned actions are used (org policy forbids third-party actions like `peter-evans/create-pull-request`).

## Approach — one workflow per consumer

Add `.github/workflows/sync-ui-design-brain.yml` to **each** consumer. Identical except the synced path is each repo's own (handled by that repo's `uidb:sync` script) and ba-cockpit adds the bundle-rebuild step.

Triggers:
```yaml
on:
  schedule:
    - cron: "0 6 * * 1"   # weekly, Mon 06:00 UTC — adjustable
  workflow_dispatch: {}    # manual "Run workflow" button
```

Job steps (single job):
1. `actions/checkout@v4` with `token: ${{ secrets.PR_BOT_TOKEN }}` and `persist-credentials: true` (so the later `git push` is authenticated as the bot and the PR triggers the consumer's `pull_request` CI).
2. `actions/setup-node@v4` (Node 24) + `corepack enable && corepack prepare pnpm@<repo's pinned> --activate` + `actions/cache@v4` for the pnpm store + `pnpm install --frozen-lockfile` — copy the steps verbatim from the repo's existing `pr.yml`/`evals.yml`.
3. Reset a **stable** branch to main so reruns roll a single PR rather than piling up:
   `git fetch origin main && git checkout -B bot/uidb-sync origin/main`
4. Run the sync against the **private source over HTTPS+token** (SSH won't work in CI):
   `pnpm uidb:sync "https://x-access-token:${PR_BOT_TOKEN}@github.com/verndale/ui-design-brain.git"`
   (the token value is masked in logs; the script clones the source's default branch `main`).
5. **ba-cockpit only:** rebuild the bundle with the exact `zip -r … skills … -x …` command from `CONTRIBUTING.md` ("Packaging a release"), writing `dist/cumulative-conductor.plugin`. (Skip the `.v<previous>` rollback `mv`; CI just produces a fresh bundle.)
6. Stage the changed paths and **no-op if nothing changed**:
   `git add frontend-ai/skills/ui-design-brain` (ai-orchestration) / `git add skills/ui-design-brain dist/cumulative-conductor.plugin` (ba-cockpit); then `git diff --cached --quiet && echo "no drift" && exit 0`.
7. Commit with a **conventional subject** (so the consumers' commitlint + the squash-merge title pass): `chore(ui-design-brain): sync catalog from source repo`. `git push -f origin bot/uidb-sync`.
8. Open/update the PR via the existing tool: `pnpm pr:create` with `GH_TOKEN=${{ secrets.PR_BOT_TOKEN }}`, `PR_BASE_BRANCH=main`, `PR_HEAD_BRANCH=bot/uidb-sync`, `PR_DRAFT=false` (plus the `PR_AI*` vars if AI summaries are wanted). `ai-pr` find-or-updates the PR from the already-pushed branch. PR body should remind the reviewer to **bump `plugin.json` if the change is user-visible** (ba-cockpit) before merge.

## Prerequisite — token scope (the one new requirement)

`PR_BOT_TOKEN` must be able to **read `verndale/ui-design-brain`** (a different private repo) in addition to its existing push/PR rights on the consumer. If it's repo-scoped too narrowly, add a dedicated read token (e.g. `UIDB_SYNC_TOKEN`, fine-grained: Contents:read on the source repo) and use it only in the clone URL of step 4, keeping `PR_BOT_TOKEN` for checkout/push/PR. Flag this clearly — it's the most likely first-run failure.

## Files

- **New:** `ai-orchestration/.github/workflows/sync-ui-design-brain.yml`, `ba-cockpit/.github/workflows/sync-ui-design-brain.yml`
- **Docs:** add a short "Automated sync" note to each consumer's existing section (`ba-cockpit/CONTRIBUTING.md` → "Vendored skills"; `ai-orchestration/frontend-ai/README.md` → "Updating ui-design-brain") — weekly + manual, opens a PR, plus the token prerequisite.
- No source-repo (`ui-design-brain`) changes.

## Verification

1. **YAML sanity:** run `actionlint` if available, or careful review; confirm only `actions/*` and `pnpm`/`gh`/`ai-pr` are invoked (org-policy compliant).
2. **Manual dry run:** after the workflows are on `main`, trigger each via the Actions UI / `gh workflow run sync-ui-design-brain.yml`. Expect: no drift → clean no-op exit; drift → a `bot/uidb-sync` PR with the catalog diff (and a rebuilt `.plugin` for ba-cockpit).
3. **Token check:** the first run proves whether `PR_BOT_TOKEN` can clone the source; a `fatal: could not read … ui-design-brain` means the token needs source read (apply the prerequisite fix).
4. **Bundle check (ba-cockpit):** `unzip -l dist/cumulative-conductor.plugin | grep ui-design-brain` in the PR shows the refreshed catalog; confirm `.skill-lock.json`/`.claude` did not leak (already verified the local build is clean).
5. **Idempotence:** a second run with no upstream change opens/updates nothing (the `git diff --cached --quiet` gate).

---

# Addendum 2: Fix the source-clone auth (private repo) — observed failure

## Context

First real run failed at the clone step: `Authentication failed for https://github.com/verndale/ui-design-brain.git`. Verified from the CLI source (`git.ts`): it clones via `simple-git`, passes the URL **verbatim** (no cred stripping) and respects ambient git config — so this is **not** a tool bug. The token in `${{ secrets.UIDB_SYNC_TOKEN || secrets.PR_BOT_TOKEN }}` is unset or can't read the *separate* `verndale/ui-design-brain` repo (`PR_BOT_TOKEN` is scoped to the consumer repo only). User chose: keep source **private**, authorize with a dedicated `UIDB_SYNC_TOKEN`.

Separately confirmed there is currently **zero drift** (source `main` is byte-identical to both vendored copies), so even after auth is fixed a run is **green with no PR** until a real catalog change lands on `main`.

## User action (GitHub settings — only they can do this)

Create a **fine-grained PAT** → Repository access: `verndale/ui-design-brain` → Permissions: **Contents: Read-only**. Add it as an Actions secret **`UIDB_SYNC_TOKEN`** in **both** consumer repos (`front-end-build-orchestration`, `cumulative-conductor`) — or one org-level secret scoped to both. The workflow already prefers it over `PR_BOT_TOKEN`, so no other secret change is needed.

## Code change (both `.github/workflows/sync-ui-design-brain.yml`)

Harden the "Vendor … and detect drift" step so auth problems fail fast and clearly:
- If `SYNC_TOKEN` is empty → `::error::` with the exact remediation (set `UIDB_SYNC_TOKEN`) and `exit 1`.
- Probe access with `git ls-remote "$SRC_URL" HEAD` before the full sync; on failure → `::error::Cannot read verndale/ui-design-brain …` and `exit 1` (turns the opaque CLI error into a precise one — this is exactly today's failure mode).
- **Auth via `git config insteadOf`, NOT token-in-URL.** Verified empirically against a live run: the `git ls-remote` probe passes with a token (raw git authenticates fine), but the skills CLI's *own* clone **strips inline credentials** and fails with the clean URL. Fix: `git config --global url."https://x-access-token:${SYNC_TOKEN}@github.com/verndale/ui-design-brain".insteadOf "https://github.com/verndale/ui-design-brain"` (scoped to the source repo so it cannot hijack the consumer-repo push), then pass the **clean** `https://github.com/verndale/ui-design-brain.git` to `pnpm uidb:sync`. Confirmed locally that the CLI's `simple-git` clone honors the rewrite (cloned a clean URL via an SSH `insteadOf`).

No change to triggers, the drift gate, the ba-cockpit bundle rebuild, or the PR step.

## Verification

1. Re-validate YAML parses (ruby/`actionlint`).
2. After the user adds `UIDB_SYNC_TOKEN`: **Run workflow** manually on a consumer → expect a **green** run ending "ui-design-brain is already up to date; no PR needed" (auth now works, no drift).
3. End-to-end proof: make a real edit on source `main` (e.g. add a line to `skills/ui-design-brain/patterns/button.md`) → Run workflow → expect a `bot/uidb-sync` PR with that diff.
4. Negative check: with no token, the run now fails fast with the clear `::error::` instead of the opaque clone failure.
