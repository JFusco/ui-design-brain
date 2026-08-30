# Plan Audit

Every agent plan executed for this repo, gathered from Claude plan stores and Codex sessions, with whether it actually shipped. Implemented and partial plans are archived here (linked); not-implemented, superseded, and out-of-scope plans are listed for the record and stay at their source on disk.

## Contents

- Status legend
- Plans

## Status legend

- **implemented** — substantially shipped (deltas noted in the archived file's `audit_note`).
- **partial** — a subset shipped; the rest never landed.
- **superseded** — replaced by a later plan before shipping as written.
- **not-implemented** — nothing shipped; may still be actionable.
- **out-of-scope** — targets another repo/product.
- **not-verified** — recovered by `pnpm wiki:find-plans --archive`; nobody has checked yet whether it shipped.

Totals: 9 implemented, 1 partial (10 plans).

## Plans

| Date | Plan | Status | Evidence | Topics |
| --- | --- | --- | --- | --- |
| 2026-08-30 | [Deterministic UI Design Brain projections for COS and ai-orchestration](2026-08-30-deterministic-ui-design-brain-projections.md) | partial | [verndale/ui-design-brain issue #47](https://github.com/verndale/ui-design-brain/issues/47), working-tree implementation and tests; PR pending | component-catalog, packaging-and-distribution |
| 2026-07-23 | [Port the knowledge-graph + wiki subsystem into ui-design-brain](2026-07-23-port-knowledge-graph-wiki-subsystem.md) | implemented | [PR #9](https://github.com/verndale/ui-design-brain/pull/9) | graph-wiki-subsystem |
| 2026-06-13 | [Plan: Align `AGENTS.md` with AGENTS.md best practices (+ record the references in CONTRIBUTING)](2026-06-13-align-agents-md-with-agents-md-best-practices.md) | implemented | — | agents-guidance |
| 2026-06-12 | [Plan: De-duplicate `ui-design-brain` via the `skills` CLI (vercel-labs/skills)](2026-06-12-dedupe-ui-design-brain-via-skills-cli-plan.md) | implemented | — | packaging-and-distribution |
| 2026-06-11 | [Plan: Finalize ui-design-brain extraction (vendor-only, npm + sync)](2026-06-11-finalize-ui-design-brain-npm-package-vendoring.md) | implemented | — | packaging-and-distribution |
| 2026-06-11 | [Plan: Extract `@verndale/ui-design-brain` into its own published repo](2026-06-11-extract-ui-design-brain-into-published-npm-package-plan.md) | implemented | [PR #9](https://github.com/verndale/ui-design-brain/pull/9) | packaging-and-distribution |
| 2026-07-23 | [ui-design-brain: close catalog gaps observed in consuming repos](2026-07-23-ui-design-brain-close-catalog-gaps-observed-in-consuming-rep.md) | implemented | [PR #12](https://github.com/verndale/ui-design-brain/pull/12) | component-catalog |
| 2026-07-23 | [Fix the stale Stepper canonical row in the context-scoped aliases table](2026-07-23-fix-the-stale-stepper-canonical-row-in-the-context-scoped-al.md) | implemented | [PR #15](https://github.com/verndale/ui-design-brain/pull/15) | — |
| 2026-08-22 | [Standardize Brain quality and graph lifecycle](2026-08-22-standardize-brain-quality-and-graph-lifecycle.md) | implemented | working tree implementation for issue #40, [PR #41](https://github.com/verndale/ui-design-brain/pull/41) | graph-wiki-subsystem |
| 2026-08-23 | [Standardize wiki actions and evidence routing](2026-08-23-standardize-wiki-actions-and-evidence-routing.md) | implemented | [issue #43](https://github.com/verndale/ui-design-brain/issues/43), PR pending, [verndale/ui-design-brain PR #44](https://github.com/verndale/ui-design-brain/pull/44) | graph-wiki-subsystem |
