---
status: implemented
executed: 2026-11-08
date: 2026-11-08
evidence:
  - "scripts/semantic-release-analyzer.cjs"
  - "scripts/tests/release-policy.test.cjs"
  - "jfusco/ui-design-brain PR #105 https://github.com/jfusco/ui-design-brain/pull/105 (merged 2026-11-08)"
source_tool: file
source: "/tmp/pin-courier-implementation/ui-design-brain-plan.md"
topics: [packaging-and-distribution]
---
# Harden publisher release maintenance

- Filter literal `[skip release]` from complete commit messages before official version analysis and notes generation; preserve existing release rules.
- Preserve tested revision, OIDC, preflight, provenance and packed-consumer checks.
- Give Dependabot zero routine-version PRs and marked maintenance commit metadata.
- Distinguish registry readiness, timeout and error; report partial notification delivery and support notification-only replay.
- Pin current release action versions to full SHAs; verify isolated release histories and normal release controls.
