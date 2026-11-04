---
date: 2026-11-03
topics: [packaging-and-distribution]
plan: none
pr: https://github.com/jfusco/ui-design-brain/pull/90
issue: https://github.com/JFusco/ui-design-brain/issues/89
issues: ["https://github.com/jfusco/ui-design-brain/issues/89"]
---
# Notify the Renovate runner after each release

## Why

- Consumers receive `ui-design-brain` updates from the Pin Courier GitHub App, which runs Renovate centrally from `JFusco/renovate-config`. Without a notification, a release waits for the runner's six-hour schedule.
- npm accepts an upload minutes before the registry serves it, and Renovate reads the registry document. A notification sent straight after publication can find nothing new.

## What changed

- After semantic-release, the release job detects a publication by comparing `HEAD` with the revision recorded before it, because `@semantic-release/git` commits only when a version is published.
- After a publication, the job polls the npm registry for the new version for up to ten minutes. It then mints a Pin Courier installation token limited to `renovate-config` with contents write, and sends a `package-released` repository dispatch. A registry timeout warns and dispatches anyway.
- The steps match `JFusco/cms-field-vocabulary`, where the same sequence delivered release 1.3.10 to the runner. The Pin Courier secrets and installation were already in place.
- Ruled out: a webhook from npm, which needs a paid organization hook, and per-consumer schedules, which keep the delay.

## Files

- .github/workflows/release.yml, scripts/tests/release-workflow.test.cjs

## Follow-ups

- Consumers moved from `@verndale/ui-design-brain` to `ui-design-brain` in their own repositories. `verndale/ai-orchestration` still uses the scoped package. Deprecating the scoped package needs the verndale npm owner.
