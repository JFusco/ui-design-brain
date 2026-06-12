# UI Design Brain

Versioned catalog of production-grade UI component patterns shared across Verndale AI tooling, distributed as an **agent skill**. This repo is the **single source of truth** for the catalog so consuming repos can vendor identical content instead of hand-maintaining copies that drift.

## Contents

- [What ships](#what-ships)
- [Who consumes it](#who-consumes-it)
- [How consumers use it](#how-consumers-use-it)
- [Updating the catalog](#updating-the-catalog)
- [Contributing](#contributing)

## What ships

The repo ships a single agent skill under `skills/`:

```
skills/ui-design-brain/
├── SKILL.md                  # skill entry point (frontmatter + workflow)
├── index.md                  # narrow down likely components
├── patterns-manifest.json    # canonical names, aliases, alias-resolution rules
└── patterns/                 # 60 per-pattern guidance files (accordion.md … visually-hidden.md)
```

This layout (`skills/<name>/SKILL.md`) is what the [`skills` CLI](https://github.com/vercel-labs/skills) discovers. The `SKILL.md` description is shared by every consumer, so it is written to read well for both spec/acceptance-criteria authoring and interface-code generation.

## Who consumes it

- [`@verndale/ai-orchestration`](https://github.com/verndale/front-end-build-orchestration) — vendored at `frontend-ai/skills/ui-design-brain/`.
- [`cumulative-conductor`](https://github.com/verndale/cumulative-conductor) (ba-cockpit) — vendored at `skills/ui-design-brain/`.

Both hold a **real, committed copy** of the skill (not a submodule and not a symlink — those repos are themselves redistributed downstream as a git submodule / a `.plugin` zip, where a symlink target or nested submodule would not resolve).

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

## Updating the catalog

1. Edit files under `skills/ui-design-brain/` (add a pattern, update the manifest, refine guidance).
2. Commit with a Conventional Commit (`pnpm commit`) and merge to `main`.
3. In each consumer, run `pnpm uidb:sync` from the repo root (wraps the vendor script) and commit the diff. In ba-cockpit, also rebuild the `.plugin` bundle so the refreshed catalog ships.

## Contributing

Commit standards are enforced via `@verndale/ai-commit` (commitlint) and Husky hooks. Use `pnpm commit`. See [CONTRIBUTING.md](CONTRIBUTING.md).
