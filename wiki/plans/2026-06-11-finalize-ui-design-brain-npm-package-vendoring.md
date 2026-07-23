---
status: implemented
executed: 2026-06-11
date: 2026-06-11
evidence: []
source_tool: claude
source: "/Users/joe.fusco/Desktop/claude-plans-organized/ui-design-brain/executed/2026-06-11-finalize-ui-design-brain-npm-package-vendoring.md"
topics: [packaging-and-distribution]
---
# Plan: Finalize ui-design-brain extraction (vendor-only, npm + sync)

## Context

After the npm + sync extraction was built and verified, the question was raised: couldn't ui-design-brain just be a **Claude Code skill** — even published to the **public skill directory** — instead of vendored files?

Verified against the official Claude Code docs and both repos' reference patterns, the answer is **no, that can't replace vendoring** for these two consumers:

- **Install location is outside the repo tree.** Marketplace/public skills install to `~/.claude/plugins` (the user's cache), not the consuming repo's working tree. ai-orchestration ships its skills by **git-submodule symlink of `frontend-ai/skills/`**, and ba-cockpit by **zipping its whole `skills/` tree into a `.plugin`** — both package only what's in the repo tree. A cache-installed skill is invisible to both. "Public" only changes discoverability, not location.
- **Path coupling.** Docs: *"Plugins are copied to a cache, so paths referencing files outside the plugin directory won't work."* The pipeline's `.mdc` rules read the catalog by relative path (`../skills/ui-design-brain/patterns-manifest.json`; ba-cockpit `../_shared/ui-design-brain/...`) — those break against a cache-installed skill.
- **It's a passive file catalog, not an autonomous skill** (ba-cockpit's copy has no `SKILL.md`; other rules just read its files).

**Decision:** keep the **npm package + `uidb:sync` vendor** approach, **vendor-only** (no public-skill shaping now — it stays a clean later-add since one repo can carry a `.claude-plugin/` manifest + `package.json` + content simultaneously). Wire **both consumers**.

## Already done (built + verified in the prior session)

- **New repo** `@verndale/ui-design-brain` at `/Users/joe.fusco/Projects/@verndale/ui-design-brain` — content-only public npm package, full scaffolding (package.json, `.releaserc.json` with `npmPublish:true`+`provenance:true`, 3 workflows, husky, README/CONTRIBUTING/LICENSE, `content/` = 62 catalog files). JSON validated; `content/` byte-identical to the vendored catalog.
- **ai-orchestration** — `scripts/sync-ui-design-brain.cjs`; `uidb:sync`/`uidb:verify` + exact `@verndale/ui-design-brain` pin in package.json; 3 stale `carmahhawwari` URLs repointed. `uidb:sync` produced **zero catalog diff** (wrapper untouched); `evals:all` PASS.

## Remaining action

ba-cockpit's `package.json` wiring was reverted (its `scripts/sync-ui-design-brain.cjs` is still present). Re-apply it:

1. In `/Users/joe.fusco/Projects/@verndale/ba-cockpit/package.json`:
   - Add scripts `"uidb:sync": "node scripts/sync-ui-design-brain.cjs"` and `"uidb:verify": "node scripts/sync-ui-design-brain.cjs --check"`.
   - Add devDependency `"@verndale/ui-design-brain": "1.0.0"` (exact pin).
2. Re-verify (offline, via `UIDB_SRC`): `uidb:verify` reports in-sync; `uidb:sync` write yields **zero git diff** in `skills/_shared/ui-design-brain/` (the `_shared` README untouched); ba-cockpit `evals:check` PASS.

## Verification

- ba-cockpit: `UIDB_SRC=<new>/content node scripts/sync-ui-design-brain.cjs --check` → in sync (62 files); write → zero catalog diff; `node scripts/evals/check.cjs` → PASS.
- ai-orchestration (already green): `uidb:verify` + `evals:all`.

## Hand-off (Joe does git/publish/install)

Bootstrapping order (the `@1.0.0` pins won't resolve until published — don't run a frozen install in the consumers until after publish):
1. New repo: `pnpm install` (lockfile + husky) → `git init` → create `github.com/verndale/ui-design-brain` → push `main`.
2. Add CI secret `NPM_TOKEN` (publish rights to `@verndale`, public). First push to `main` → `release.yml` publishes **v1.0.0**.
3. Each consumer: `pnpm install` (resolves 1.0.0, updates lockfile) → `pnpm run uidb:verify` passes → commit.

Suggested commit messages:
- New repo: `feat(catalog): Add ui-design-brain UI pattern catalog and repo scaffolding`
- ai-orchestration: `chore(skills): Vendor ui-design-brain via @verndale/ui-design-brain package`
- ba-cockpit: `chore(skills): Vendor ui-design-brain via @verndale/ui-design-brain package`
