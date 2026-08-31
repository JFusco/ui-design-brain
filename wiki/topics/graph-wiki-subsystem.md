---
aliases: [knowledge graph, context wiki, pattern graph, sigma.js viewer, plan capture]
---
# Knowledge graph & context wiki — Design History

The deterministic knowledge graph + Sigma.js viewer and the context wiki (journal / topics / plans), ported from ai-orchestration.

## Current state

- `pnpm graph:build` derives `scripts/graph/data/graph.json` from the catalog + root docs + wiki; `pnpm graph:view` renders it on loopback with a vendored Sigma.js stack; `pnpm graph:check` byte-compares a fresh rebuild and gates freshness without writes.
- Node types: `root-doc`, `skill`, `skill-index`, `manifest`, `ui-pattern`, `wiki-*`. Edges: `catalogs`, `see-also`, `references`, `links-to`, `topic`, `plan`, `covers`. The `catalogs` edge (manifest → each pattern) doubles as the catalog integrity gate.
- The manifest is required and validated before generated writes. Topic, plan, and `covers` declarations remain in the graph when unresolved so one shared dangling-edge predicate fails loudly. Malformed plan paths also dangle instead of being discarded; `none`/`pending` sentinels and normalized `plans/`/`wiki/plans/` paths remain valid.
- Pre-commit lifecycle writes skip unstaged graph input and fail open. Pre-push and CI use check-only contracts; wiki bots reuse the same builder.
- The context wiki captures executed plans (Codex + Claude), GitHub PRs, and GitHub issues. Canonical repo-qualified `githubRefs` stay on the Markdown nodes that cite them, so the offline viewer and navigator can search, open, and route evidence without GitHub nodes, PR snapshots, or a live API. Slack ingestion is deliberately excluded.
- `Quality / quality`, `Commit message lint / commitlint`, `Wiki integrity / check`, `Sync context wiki / sync`, and `Sync wiki issue state / sync` are the canonical checks. Merge reconciliation is a guarded bot PR with manual replay; issue refresh caches repeated repository-and-number lookups and annotates a line only when every cited issue is confirmed closed.
- Direct single-topic history starts at `wiki/INDEX.md`; the byte-costed navigator is reserved for cross-page why, wiring, and impact questions.
- Fence-aware evidence and Markdown-link extraction track delimiter length, and issue refresh refuses symlinked pages or wiki roots. Reconciliation validates the PR URL, repository, number, paths, and commits before writes; writer branches are fetched for lease-safe updates and closed unmerged review PRs are reopened. CLI and browser routing share byte weighting, URL suffix normalization, explicit authority, and fail-closed policy checks.

## Decisions

- 2026-08-31 — ci(release): standardize package workflow ([verndale/ui-design-brain PR #54](https://github.com/verndale/ui-design-brain/pull/54))
- 2026-08-30 — feat(projector): add deterministic UI projections ([verndale/ui-design-brain PR #49](https://github.com/verndale/ui-design-brain/pull/49))
- 2026-08-24 — Replaced generic hand-authored traversal prose with the canonical headless managed block while retaining the Brain catalog graph, evidence, authoring, and maintainer boundaries outside it ([plan](../plans/2026-08-24-deterministic-route-first-wiki-guidance-and-pr-127-recovery.md), [journal](../journal/2026-08-24-deterministic-agent-wiki-guidance.md)).
- 2026-08-24 — fix(wiki): harden post-rollout graph contracts ([verndale/ui-design-brain PR #44](https://github.com/verndale/ui-design-brain/pull/44))
- 2026-08-23 — Standardized offline repo-qualified GitHub evidence, byte-aware routing, safe viewer links, wiki hooks, and five workflow identities against ai-orchestration while retaining the Brain catalog graph model and viewer behavior ([issue #43](https://github.com/verndale/ui-design-brain/issues/43), [plan](../plans/2026-08-23-standardize-wiki-actions-and-evidence-routing.md), [journal](../journal/2026-08-23-standardize-wiki-actions-and-evidence-routing.md)).
- 2026-08-22 — chore(tooling): standardize quality gates ([PR #41](https://github.com/verndale/ui-design-brain/pull/41))
- 2026-08-22 — Standardized blocking lint/push/PR gates while keeping curated graph writes lifecycle-only and advisory; ported required-input, unresolved-edge, root-relative, discovery, server, and viewer safeguards without changing the Brain graph schema, palette, or port ([issue #40](https://github.com/verndale/ui-design-brain/issues/40), [plan](../plans/2026-08-22-standardize-brain-quality-and-graph-lifecycle.md), [journal](../journal/2026-08-22-standardize-quality-and-graph-lifecycle.md)).
- 2026-08-08 — feat(ui-design-brain): Clarify Hero and Alert message boundaries ([PR #38](https://github.com/verndale/ui-design-brain/pull/38))
- 2026-08-08 — feat(ui-design-brain): Add Mega menu pattern and update documentation ([PR #36](https://github.com/verndale/ui-design-brain/pull/36))
- 2026-08-08 — feat(ui-design-brain): Add Media object pattern ([PR #33](https://github.com/verndale/ui-design-brain/pull/33))
- 2026-08-07 — feat(ui-design-brain): Add Logo bar pattern ([PR #28](https://github.com/verndale/ui-design-brain/pull/28))
- 2026-08-07 — feat(ui-design-brain): Add Testimonial alias to Quote ([PR #27](https://github.com/verndale/ui-design-brain/pull/27))
- 2026-08-06 — feat(ci): Update documentation and workflow configurations ([PR #24](https://github.com/verndale/ui-design-brain/pull/24))
- 2026-08-03 — feat(ui-design-brain): Add in-page navigation pattern and update catalog ([PR #21](https://github.com/verndale/ui-design-brain/pull/21))
- 2026-07-31 — feat(ui-design-brain): Update UI design patterns with new aliases ([PR #18](https://github.com/verndale/ui-design-brain/pull/18))
- 2026-07-23 — fix(ui-design-brain): Update Stepper canonical description in index.md ([PR #15](https://github.com/verndale/ui-design-brain/pull/15))
- 2026-07-23 — feat(ui-design-brain): Add new UI patterns and update documentation ([PR #12](https://github.com/verndale/ui-design-brain/pull/12))
- 2026-07-23 — feat(ci): Add workflows for knowledge graph and wiki sync ([PR #9](https://github.com/verndale/ui-design-brain/pull/9))
- 2026-07-23 — Ported the knowledge-graph + wiki subsystem from ai-orchestration — full faithful port (routing + auto-generated connections in, pre-commit rebuild, dormant opt-in AI); Slack excluded ([plan](../plans/2026-07-23-port-knowledge-graph-wiki-subsystem.md), [journal](../journal/2026-07-23-knowledge-graph-wiki-subsystem.md), [issue #8](https://github.com/verndale/ui-design-brain/issues/8)).
