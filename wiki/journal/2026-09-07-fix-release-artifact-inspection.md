---
date: 2026-09-07
topics: [packaging-and-distribution]
issue: https://github.com/verndale/ui-design-brain/issues/60
issues: [https://github.com/verndale/ui-design-brain/issues/60]
---
# Fix release artifact inspection

## Why

The release workflow ran `npm publish --dry-run` before semantic-release. npm still applies its registry version-conflict check during that dry run, so any normal main branch whose `package.json` contains the last released version fails before semantic-release can calculate and write the next version.

## What changed

The inspection step now uses `npm pack --dry-run --ignore-scripts`. It reports the package file set and tarball metadata without consulting the publish-version gate. The following semantic-release step remains the sole publication and version-calculation authority.

A lifecycle regression test fixes this ordering in place: artifact inspection must use pack, publish dry-run is forbidden, and semantic-release must remain present.

## Files

- `.github/workflows/release.yml`
- `scripts/tests/release-workflow.test.cjs`
- `wiki/topics/packaging-and-distribution.md`

## Follow-ups

- Merge the fix; the resulting main push will run the corrected workflow and allow semantic-release to publish the pending catalog release.
