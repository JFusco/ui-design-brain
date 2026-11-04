---
date: 2026-11-04
topics: [packaging-and-distribution]
plan: none
pr: https://github.com/jfusco/ui-design-brain/pull/93
issue: https://github.com/JFusco/ui-design-brain/issues/92
issues: ["https://github.com/jfusco/ui-design-brain/issues/92"]
---
# Wait for the release tarball before notifying Renovate

## Why

- The [registry wait](2026-11-03-notify-renovate-runner.md) stopped once the packument listed the new version, but consumers install the tarball, which the registry serves separately and can lag.
- In `JFusco/brain` pull request 318, the dispatched update to 1.18.6 failed its install with `ERR_PNPM_FETCH_404` for the tarball and passed on rerun once the registry served it.

## What changed

- The wait step now also requires a HEAD request to the version's `dist.tarball` URL to return 200 before it mints the Pin Courier token and dispatches. The 40-check limit, `continue-on-error` and dispatch-anyway warning are unchanged.
- `scripts/tests/release-workflow.test.cjs` asserts the tarball check.
- The same change landed in `JFusco/cms-field-vocabulary`.
- Local runs of the exact step passed at once for `ui-design-brain@1.18.6`; against a local server whose tarball returned 404 twice, it waited and passed on the third check. The next real release is the connected proof.

## Files

- .github/workflows/release.yml, scripts/tests/release-workflow.test.cjs
