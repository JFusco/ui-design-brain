---
date: 2026-08-24
topics: [graph-wiki-subsystem]
plan: plans/2026-08-24-deterministic-route-first-wiki-guidance-and-pr-127-recovery.md
pr: pending
---
# Make agent wiki guidance deterministic

## Why

The catalog repository's wiki traversal prose needed the same deterministic route-first boundary used by the other governed repositories.

## What changed

Installed the canonical headless managed block with direct source lookup, one-page history lookup, weighted cross-page routing, sequential reads, exact-ID retries, and a bounded fixed-string fallback. Catalog graph commands, GitHub evidence behavior, history capture, and maintainer permission boundaries remain repository-owned guidance.

## Files

- `AGENTS.md`
- `wiki/`
