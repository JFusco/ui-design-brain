---
date: 2026-11-03
topics: [packaging-and-distribution]
plan: plans/2026-11-02-transfer-ui-design-brain-with-its-history-intact.md
pr: https://github.com/jfusco/ui-design-brain/pull/85
issue: https://github.com/JFusco/ui-design-brain/issues/83
issues: ["https://github.com/jfusco/ui-design-brain/issues/83"]
---
# Publish the first personal npm package

## Why

- Repository ownership does not move an npm namespace. The owner needs an unscoped package under personal npm account `jfusco` with verified registry delivery.
- The first publication needs a bootstrap credential; normal releases should use GitHub OIDC, verified by an actual subsequent release.

## What changed

- Stored the user-created bootstrap token directly in the GitHub secret without printing or writing its value to a file.
- Enabled Release and reran Quality on the merged ownership revision. Release run 41744885318 published `ui-design-brain@1.18.3` and GitHub release `v1.18.3` with provenance.
- Verified the direct public registry version and `latest` tag, maintainer `jfusco`, and provenance. Initial cached metadata briefly showed a staging placeholder; the stage list was empty and no promotion or repeated publication was performed.
- A clean exact-version install with a fresh npm cache passed projection, repeat-sync idempotence, and check. All four schema URLs resolve at `v1.18.3`.
- The owner approved the npm trust configuration with a passkey. The trust is bound to `JFusco/ui-design-brain`, workflow `release.yml`, and publish permission.
- Removed the temporary GitHub secret and its workflow reference. This closeout change exercises the next release through OIDC alone.
- Kept wiki writers paused and tracked credential verification/restoration separately in issue #84.

## Files

- .github/workflows/release.yml, scripts/tests/release-workflow.test.cjs
- README.md, CONTRIBUTING.md
- wiki/topics/packaging-and-distribution.md

## Follow-ups

- Verify the closeout release through OIDC and the public registry before marking issue #83 delivered.
- [JFusco/ui-design-brain issue #84](https://github.com/JFusco/ui-design-brain/issues/84): personal wiki-bot verification and writer restoration.
- Consumer updates and old-package deprecation remain separate follow-ups after replacement verification.
