---
status: implemented
executed: 2026-06-13
date: 2026-06-13
evidence: []
source_tool: claude
source: "/Users/joe.fusco/Desktop/claude-plans-organized/ui-design-brain/executed/2026-06-13-align-agents-md-with-agents-md-best-practices.md"
topics: [agents-guidance]
---
# Plan: Align `AGENTS.md` with AGENTS.md best practices (+ record the references in CONTRIBUTING)

## Context

Audited our `AGENTS.md` against the official spec ([agents.md](https://agents.md), Agentic AI Foundation / Linux Foundation) and two best-practices resources — the empirical [augmentcode study](https://www.augmentcode.com/blog/how-to-write-good-agents-dot-md-files) and a general [gist guide](https://gist.github.com/0xfauzi/7c8f65572930a21efa62623557d83f6e). Our file already follows the high-value patterns (progressive disclosure, lean ~50 lines, numbered procedural checklist, paired don't/do, modular, no secrets). Two minor, standard-recommended gaps remain: an explicit **Environment/"nothing to run"** note and an explicit **permission boundary**. Separately, the "follow these when editing AGENTS.md" reference list is repo-shareable guidance → it belongs in a version-controlled file (**CONTRIBUTING.md**), **not** memory (per promote-don't-mirror).

Confirmed decisions: add the small standard-aligned section to `AGENTS.md`; put the best-practices pointer + links in `CONTRIBUTING.md`. No memory changes.

## Changes

### 1. `AGENTS.md` — two small additions (keep it lean)
- **Insert a new `## Environment` section** after "## What this repo is":
  > Node 24+ and pnpm 10+ (via Corepack); `pnpm install`. There is **no build step, no test suite, and no catalog validator** — by design (integrity is maintained by hand; see Catalog integrity). Editing catalog files needs no local setup; the commit/release tooling is the maintainer's job (see below).
- **Add a permission-boundary lead line** to the "## Commits & release — the maintainer's job" section, before the existing "Do not commit…":
  > **Permission boundary:** edit files under `skills/ui-design-brain/` and `skills/_meta/` freely without asking — that's the autonomous zone. Everything in this section is the maintainer's.

(Both align with the standard's recommended *Setup* + *Safety/Permissions* sections; ~6 lines total, file stays well under the 100–150-line guidance.)

### 2. `CONTRIBUTING.md` — add a `## Maintaining AGENTS.md` subsection
Records the references in version control (the answer to "do we need a memory log?" → no, this is its home):
> `AGENTS.md` is the canonical, tool-agnostic agent guide (`CLAUDE.md` is a thin `@AGENTS.md` import). When editing it, follow AGENTS.md best practices: keep it lean (≤~150 lines), use progressive disclosure (link to `skills/_meta/`, README, etc. instead of inlining), pair every "don't" with a "do", and never include secrets.
> - Official spec: https://agents.md
> - Empirical patterns: https://www.augmentcode.com/blog/how-to-write-good-agents-dot-md-files
> - General guide: https://gist.github.com/0xfauzi/7c8f65572930a21efa62623557d83f6e

### 3. Memory — no changes
The reference list lives in CONTRIBUTING.md, not memory. Memory stays the organic/personal layer.

## Verification

1. `AGENTS.md` has a `## Environment` section and a `**Permission boundary:**` line; total length still well under 150 (`wc -l AGENTS.md`).
2. `CONTRIBUTING.md` has a `## Maintaining AGENTS.md` subsection with all three links (`grep -n 'agents.md\|augmentcode\|gist.github' CONTRIBUTING.md`).
3. No memory files changed (`git`-independent: memory dir unchanged; still 4 files + MEMORY.md).
4. Spot-check don't/do pairing and that no secrets were introduced.

## Boundary

No commit/push/release — working-tree changes only (`AGENTS.md`, `CONTRIBUTING.md`) for the user to review and commit.
