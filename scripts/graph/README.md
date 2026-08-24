# Knowledge graph

A visual, interactive map of this repo's knowledge — the catalog skill, its manifest and index,
each UI pattern, root docs, and the context-wiki pages as nodes; the relationships already latent
in the content as edges. Built deterministically from the files (no LLM), rendered in the browser.

## Contents

- Usage
- Node types
- Edge types
- How it works
- Internal agent navigation
- Adding a source

## Usage

```bash
pnpm graph:build   # parse the repo → scripts/graph/data/graph.json
pnpm graph:view    # serve the viewer at http://127.0.0.1:4173
pnpm graph:check   # check-only freshness, determinism, and integrity contract
```

Open the printed URL. In the viewer: scroll to zoom, drag to pan, **search** by name, path, alias,
or repo-qualified GitHub citation (searching "disclosure" finds Accordion), toggle **node types** in the legend, and **click a
node** to focus its neighborhood and open a metadata panel (path, connection count, aliases, topics,
cited PRs/issues, and clickable neighbors). Choose a source and target under **Shortest path** to
inspect the same weighted, hub-avoiding route used by internal agent navigation.

`graph:view` serves only `scripts/graph/` on the `127.0.0.1` loopback interface — nothing is deployed. Set `GRAPH_PORT`
to change the port. A local server is required because browsers block `fetch()` of the JSON over
`file://`.

## Node types

One node per file, typed by path: `root-doc`, `skill` (SKILL.md), `skill-index` (index.md),
`manifest` (patterns-manifest.json), `ui-pattern` (one per `patterns/<slug>.md`), and the wiki pages
`wiki-index`, `wiki-journal`, `wiki-topic`, `wiki-plan`. `_meta/` authoring templates and
`CHANGELOG.md` are excluded. Pattern labels and aliases come from the manifest (pattern files carry
no frontmatter). Markdown nodes retain legacy number-only `prs` / `issues` and add canonical offline
`githubRefs` records (`kind`, lower-cased `repository`, `number`, canonical `url`). GitHub evidence
remains metadata on its citing node; no PR/issue nodes or live API are part of the graph. Node size
scales with degree (connection count); color encodes type.

## Edge types

All derived deterministically — every edge is grounded in file content, nothing is inferred:

- `catalogs` — the manifest → each `patterns/<slug>.md` it lists. Every manifest entry emits one,
  even when the target is missing, so a stale/renamed pattern file becomes a dangling edge and the
  build fails: this is the catalog's integrity check.
- `see-also` — a pattern → another pattern it names in an inline-code reference, e.g. Modal's
  ``…use a **Drawer** (see `drawer.md`)`` (`count` = number of references = weight).
- `references` — `SKILL.md` / `index.md` → the manifest, index, or pattern files they cite in
  inline code.
- `links-to` — a relative markdown link between two node files (root docs + wiki; `count` = weight).
- `topic` — a wiki page → `topics/<slug>.md`, from frontmatter `topics:`.
- `plan` — a wiki journal entry → its archived plan, from frontmatter `plan:`.
- `covers` — a wiki topic → the runtime surfaces (pattern/skill files) it declares in `covers:`.

## How it works

[`build-graph.cjs`](build-graph.cjs) is zero-dependency Node. It reuses the flat-frontmatter reader
from [`../wiki/lib/frontmatter.cjs`](../wiki/lib/frontmatter.cjs). Output is timestamp-free, so a
rebuild only changes `graph.json` when the underlying content graph changes. The build fails if any
edge endpoint doesn't resolve to a node. Alongside `graph.json`, the build regenerates the
human-readable connections pages ([`../../wiki/connections.md`](../../wiki/connections.md) + sections
under `wiki/connections/`) — a markdown view of the same graph; do not edit those by hand.
[`../evals/graph-check.cjs`](../evals/graph-check.cjs) (`pnpm graph:check`) byte-compares a fresh
rebuild against the committed artifacts so nothing drifts.

The viewer ([`viewer/`](viewer/)) is a static page that renders `graph.json` with a **vendored**
[Sigma.js](https://www.sigmajs.org/) (WebGL) stack — `viewer/vendor/sigma.min.js` over a
[graphology](https://graphology.github.io/) model (`graphology.umd.min.js`), laid out with
ForceAtlas2 from `graphology-library.min.js`. All three are committed static assets, not
`package.json` dependencies. Search, type filters, and click-to-focus are driven by Sigma's
node/edge reducers.

## Internal agent navigation

[`../wiki/navigate.cjs`](../wiki/navigate.cjs) (`pnpm graph:navigate`) resolves an agent-selected
`why`, `wiring`, or `impact` intent to a compact reading itinerary. It uses
[`routing-policy.json`](routing-policy.json) and this graph only: no embeddings, LLM classification,
or inferred edges. Each itinerary step states the traversed edge and the graph declaration that makes
the next file authoritative. The graph freshness check rejects malformed policy schemas and unsafe
numeric weights before either the Node or browser resolver can traverse them.

Evidence queries accept full GitHub URLs, `owner/repo PR #N`, `owner/repo issue #N`, and
`owner/repo#N`; bare numbers are rejected. Each itinerary reports file bytes and a total read budget
so agents can stop as soon as the question is answered. The viewer uses the same evidence for search
and safe clickable links.

## Adding a source

The node typing lives in `typeOf()` in [`build-graph.cjs`](build-graph.cjs); new content kinds become
new branches there plus, if needed, a new edge pass. Add the matching color/label to `TYPE_COLORS` /
`TYPE_LABELS` (and any new edge hue to `EDGE_COLORS`) in [`viewer/viewer.js`](viewer/viewer.js) so the
legend and rendering pick it up, and add an edge cost + intent coverage to
[`routing-policy.json`](routing-policy.json) so `pnpm graph:check` stays green.
