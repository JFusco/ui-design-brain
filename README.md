# @verndale/ui-design-brain

Versioned catalog of production-grade UI component patterns shared across Verndale AI tooling. This package is the **single source of truth** for the catalog so consuming repos can vendor identical content instead of hand-maintaining copies that drift.

## Contents

- [What ships](#what-ships)
- [Who consumes it](#who-consumes-it)
- [How consumers use it](#how-consumers-use-it)
- [Updating the catalog](#updating-the-catalog)
- [Releases](#releases)
- [Contributing](#contributing)

## What ships

The published package contains only the invariant catalog payload, under `content/`:

```
content/
├── index.md                 # entry point: narrow down likely components
├── patterns-manifest.json   # canonical names, aliases, alias-resolution rules
└── patterns/                # 60 per-pattern guidance files (accordion.md … visually-hidden.md)
```

It deliberately does **not** ship a `SKILL.md` or a consumer-facing wrapper README — each consuming repo keeps its own wrapper (see below).

## Who consumes it

- [`@verndale/ai-orchestration`](https://github.com/verndale/front-end-build-orchestration) — vendored at `frontend-ai/skills/ui-design-brain/` (keeps its own `SKILL.md` + pipeline README).
- [`cumulative-conductor`](https://github.com/verndale/cumulative-conductor) (ba-cockpit) — vendored at `skills/_shared/ui-design-brain/` (keeps its own `_shared` README, no `SKILL.md`).

## How consumers use it

Consumers do **not** add this as a git submodule (those repos are themselves consumed downstream as submodules / plugin bundles, and a nested submodule breaks that). Instead they pin it as a dev dependency and vendor the content into their committed tree with a small sync script:

```bash
pnpm add -D @verndale/ui-design-brain@<exact-version>
pnpm run uidb:sync      # copies content/ into the repo's catalog path; never touches the local wrapper
pnpm run uidb:verify    # CI guard: fails if the committed copy drifts from the pinned version
```

Because the version is pinned exactly and a CI check enforces `committed copy == pinned version`, the two repos cannot silently drift from each other.

## Updating the catalog

1. Edit files under `content/` (add a pattern, update the manifest, refine guidance).
2. Commit with a Conventional Commit (`pnpm commit`). A `feat:`/`fix:` triggers a release.
3. After the release publishes, bump the pin in each consumer and run `pnpm run uidb:sync` there. The resulting `patterns/` diff in each consumer is the human-reviewable record of the change.

## Releases

Releases are automated with [semantic-release](https://semantic-release.gitbook.io/) on push to `main`: Conventional Commits drive the version bump, `CHANGELOG.md` is generated, and the package is published to npm with provenance. See [CONTRIBUTING.md](CONTRIBUTING.md).

## Contributing

Commit standards are enforced via `@verndale/ai-commit` (commitlint) and Husky hooks. Use `pnpm commit`. See [CONTRIBUTING.md](CONTRIBUTING.md).
