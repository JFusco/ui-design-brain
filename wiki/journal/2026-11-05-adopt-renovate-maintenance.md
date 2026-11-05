---
date: 2026-11-05
topics: [packaging-and-distribution]
plan: none
pr: pending
issue: https://github.com/JFusco/ui-design-brain/issues/95
issues: [https://github.com/JFusco/ui-design-brain/issues/95]
---
# Adopt Renovate dependency maintenance

## Why

- Nothing updated the 15 devDependencies or the GitHub Actions: there was no `renovate.json` and never a Dependabot configuration, so the central Pin Courier runner discovered this repository and skipped it.
- `JFusco/cms-field-vocabulary` already runs the shared `maintenance` preset ([its PR 133](https://github.com/JFusco/cms-field-vocabulary/pull/133)); the two publishers should age the same way.

## What changed

- `renovate.json` mirrors cms-field-vocabulary's: `github>JFusco/renovate-config:maintenance`, Mondays in America/New_York, exact pins, ten concurrent pull requests, and npm and Actions minor and patch updates grouped into one pull request each.
- Maintenance commits and titles end with `[skip release]`, so merging one publishes nothing; both packages have no runtime dependencies, and semantic-release excludes such commits. The suffix pushes titles past the 50-character subject rule, so `commitlint.yml` now skips "Validate PR body", "Lint PR title" and "Lint immutable PR commit range" when `scripts/is-pin-courier-pr.cjs` identifies the installed Pin Courier App (login, numeric id, Bot type, same-repository `renovate/` head, `main` base). A branch-prefix exemption was ruled out because any user can push a `renovate/` branch; Quality is unchanged and still runs `verify:ci` on every pull request.
- `scripts/tests/pin-courier-pr.test.cjs` pins the identity guard and the three conditions.

## Files

- renovate.json, .github/workflows/commitlint.yml, scripts/is-pin-courier-pr.cjs, scripts/tests/pin-courier-pr.test.cjs

## Follow-ups

- The first Monday run is the connected proof: a grouped pull request whose metadata lint steps are skipped and whose Quality run passes.
