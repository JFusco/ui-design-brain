# UI Design Brain

`@verndale/ui-design-brain` is a versioned catalog of canonical UI component
patterns for deterministic AI-assisted product delivery.

The published package contains only the catalog skill, schemas, projection CLI,
license, and this public documentation. Repository operational material,
including planning records, journals, source history, workflows, and internal
consumer configuration, is not included in the npm tarball.

## Install

Install an exact version in a consuming repository:

```sh
npm install --save-dev @verndale/ui-design-brain@<version>
```

Use your package manager's lockfile as the authoritative resolved version. Do
not use `npx` or a range when deterministic projections are required.

## Contents

```text
bin/ui-design-brain.mjs             projection CLI
lib/                                catalog and projection implementation
schemas/                            catalog and consumer contract schemas
skills/ui-design-brain/             canonical patterns and catalog manifests
```

The catalog owns canonical pattern names, slugs, aliases, contextual
disambiguation, and bounded product guidance. It does not define accessibility
semantics, applicability, evidence routes, or conformance requirements.

## Deterministic projection

Consumers pin an exact version, commit a configuration file, and use the
installed binary:

```text
ui-design-brain build
ui-design-brain sync --if-needed --config ui-design-brain.config.json
ui-design-brain check --config ui-design-brain.config.json
```

`sync --if-needed` validates the complete candidate projection before
atomically promoting only generated, marker-owned paths. It refuses unmarked or
locally modified generated targets. The command does not select a package
version or alter a lockfile.

## Security and release model

Releases are immutable npm versions. The source repository remains private.
The publishing workflow uses npm trusted publishing with GitHub Actions OIDC,
so it does not require a long-lived npm publish token. Before each release, the
package validates its catalog and a packed-consumer fixture.

Review the published contents before release with:

```sh
pnpm pack --dry-run
```

## License

[MIT](LICENSE)
