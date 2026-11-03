# UI Design Brain

`ui-design-brain` is a versioned catalog of canonical UI component
patterns for deterministic AI-assisted product delivery.

The published package contains only the catalog skill, schemas, projection CLI,
license, and this public documentation. Repository operational material,
including planning records, journals, source history, and workflows, is retained
in the repository and is not included in the npm tarball.

The move from `@verndale/ui-design-brain` to the unscoped package is being
prepared. Use the new install command only after its first registry release;
existing scoped versions remain available during the transition.

## Install

Install an exact version in a consuming repository:

```sh
npm install --save-dev --save-exact ui-design-brain@<version>
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

The catalog contains 82 canonical patterns and owns canonical pattern names, slugs, aliases, contextual
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

Releases are immutable npm versions. The intended source repository is
[`JFusco/ui-design-brain`](https://github.com/JFusco/ui-design-brain). Publication
is gated on that repository being public and its release setup being enabled.
Automated releases validate the catalog and a packed-consumer fixture. After
the first package publication establishes ownership, subsequent releases use
npm trusted publishing with GitHub Actions OIDC and provenance.

Review the published contents before release with:

```sh
npm pack --dry-run --ignore-scripts
```

## Migrating from the scoped package

After the first unscoped release, replace the scoped dependency with an exact
`ui-design-brain` version. In `ui-design-brain.config.json`, set `packageName`
to `ui-design-brain`, pin the installed `packageVersion`, and update `$schema`
to `./node_modules/ui-design-brain/schemas/consumer-config.schema.json` if used.
Keep `catalogAuthorityVersion` at `1.18.0`.

Generate into a new, unused `target` directory and run `check` before switching
consumer references to it. Preserve the previous projection until that review
passes. The new package deliberately refuses to overwrite an existing
`@verndale/ui-design-brain` projection, including with `--adopt`. Update direct
Node invocations to `node_modules/ui-design-brain/bin/ui-design-brain.mjs`.
The `ui-design-brain` executable name is unchanged.

The existing MIT attribution and project history are retained.

## License

[MIT](LICENSE)
