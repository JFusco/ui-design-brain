#!/usr/bin/env node
"use strict";

// Knowledge-graph builder for @verndale/ui-design-brain. Walks the repo and emits a
// typed node/edge graph to scripts/graph/data/graph.json for the interactive viewer
// (scripts/graph/viewer/).
//
// Nodes  = knowledge units, one per file: the skill entry point, its index + manifest,
//          each UI pattern, root docs, and the context-wiki pages.
// Edges  = relationships already latent in the content:
//   catalogs   the patterns-manifest -> each pattern file it lists (the catalog spine)
//   see-also   a pattern -> another pattern it names in an inline-code "(see `x.md`)" ref
//   references SKILL.md / index.md -> the manifest, index, or pattern files they cite
//   links-to   relative markdown link between two node files (count = weight)
//   topic      a wiki page -> topics/<slug>.md (from frontmatter `topics:`)
//   plan       a wiki journal entry -> its archived plan (from frontmatter `plan:`)
//   covers     a wiki topic -> the runtime surfaces declared in its `covers:` metadata
//
// Everything is derived deterministically from the files — no guessing, no LLM.
// Output is timestamp-free so a rebuild only diffs when the content graph changes.
// Reuses the flat-frontmatter reader from scripts/wiki/lib/frontmatter.cjs.

const fs = require("fs");
const path = require("path");
const frontmatter = require("../wiki/lib/frontmatter.cjs");

const REPO_ROOT = path.resolve(__dirname, "..", "..");
const OUT_FILE = path.join(__dirname, "data", "graph.json");

// The catalog skill and its machine-readable backbone.
const SKILL_ROOT = "skills/ui-design-brain";
const MANIFEST_ID = `${SKILL_ROOT}/patterns-manifest.json`;
const PATTERNS_PREFIX = `${SKILL_ROOT}/patterns/`;

// The generated governance-connections pages (a view of the graph, rendered into the
// wiki as a small index at wiki/connections.md plus per-section files under
// wiki/connections/). Excluded from the graph itself — otherwise their many links would
// become links-to edges, making them mega-nodes and coupling the graph to its own view.
const CONNECTIONS_INDEX_ID = "wiki/connections.md";
const CONNECTIONS_DIR_ID = "wiki/connections";
const isConnectionsView = (id) => id === CONNECTIONS_INDEX_ID || id.startsWith(`${CONNECTIONS_DIR_ID}/`);

// Root docs promoted to their own node type. CHANGELOG.md is intentionally excluded —
// semantic-release rewrites it every release, which would churn the graph for no signal.
const ROOT_DOCS = new Set(["AGENTS.md", "README.md", "CONTRIBUTING.md", "CLAUDE.md"]);

const LINK_RE = /\[[^\]]*\]\(([^)]+)\)/g;
const FENCE_RE = /^```/;
const H1_RE = /^#\s+(.+?)\s*$/;
// Inline-code file references — `drawer.md`, `index.md`, `patterns-manifest.json`,
// `patterns/modal.md`. Excludes `<` / `>` so the template placeholder `patterns/<slug>.md`
// never matches. This is how the pattern catalog cross-references itself (no markdown links).
const BACKTICK_FILE_RE = /`([A-Za-z0-9._/-]+\.(?:md|json))`/g;
const PR_RE = /github\.com\/[^/]+\/[^/]+\/pull\/(\d+)/g;
const ISSUE_RE = /github\.com\/[^/]+\/[^/]+\/issues\/(\d+)/g;
// NUL joins the (source, target) halves of an internal edge key so a node id that ever
// contained a space could never mis-split it (matches routing.cjs's edgeKey separator).
const EDGE_KEY_SEP = String.fromCharCode(0);

const toPosix = (p) => p.split(path.sep).join("/");
const rel = (abs) => toPosix(path.relative(REPO_ROOT, abs));

// Same skip rules as link resolution: external, anchors, template vars, placeholders.
function isSkippable(target) {
  return (
    target === "" ||
    target.startsWith("#") ||
    /^(https?:|mailto:)/.test(target) ||
    target.includes("${") ||
    target.includes("<") ||
    target.includes("...") ||
    target.startsWith("/")
  );
}

// Recursively collect files under `target` (a dir or file), excluding node_modules,
// dotfiles, and the authoring-only _meta/ templates (never runtime content).
function walk(target, exts) {
  let stat;
  try {
    stat = fs.statSync(target);
  } catch {
    return [];
  }
  if (stat.isFile()) return exts.some((e) => target.endsWith(e)) ? [target] : [];
  const out = [];
  for (const entry of fs.readdirSync(target, { withFileTypes: true })) {
    if (entry.name === "node_modules" || entry.name === "_meta" || entry.name.startsWith(".")) continue;
    const p = path.join(target, entry.name);
    if (entry.isDirectory()) out.push(...walk(p, exts));
    else if (entry.isFile() && exts.some((e) => p.endsWith(e))) out.push(p);
  }
  return out;
}

// Map a repo-relative posix path to a node type, or null to skip it.
function typeOf(r) {
  if (ROOT_DOCS.has(r)) return "root-doc";
  if (r === MANIFEST_ID) return "manifest";

  if (r.startsWith(`${SKILL_ROOT}/`)) {
    if (r === `${SKILL_ROOT}/SKILL.md`) return "skill";
    if (r === `${SKILL_ROOT}/index.md`) return "skill-index";
    if (r.startsWith(PATTERNS_PREFIX) && r.endsWith(".md")) return "ui-pattern";
    return null;
  }

  if (r.startsWith("wiki/")) {
    if (!r.endsWith(".md")) return null;
    const base = path.basename(r);
    if (base === "INDEX.md" || base === "MECHANICS.md") return "wiki-index";
    if (r.startsWith("wiki/journal/")) return "wiki-journal";
    if (r.startsWith("wiki/topics/")) return "wiki-topic";
    if (r.startsWith("wiki/plans/")) return "wiki-plan"; // plans/INDEX.md is caught by the base check above
    return "wiki-index";
  }
  return null;
}

// Canonical pattern name + aliases come from the manifest, not the file: pattern files
// use H2 headings and carry no frontmatter, so aliases and the display label would
// otherwise be lost. Flattens object-form aliases ({ name, context }) to their name.
function loadManifest(abs) {
  const bySlug = new Map();
  let entries;
  try {
    entries = JSON.parse(fs.readFileSync(abs, "utf8"));
  } catch {
    return bySlug;
  }
  for (const e of entries) {
    if (!e || !e.slug) continue;
    const aliases = (e.aliases || []).map((a) => (typeof a === "string" ? a : a && a.name)).filter(Boolean);
    bySlug.set(e.slug, { name: e.name || e.slug, aliases, file: e.file || `patterns/${e.slug}.md` });
  }
  return bySlug;
}

function extractLabel(id, type, text, patternName) {
  if (type === "skill") {
    const name = frontmatter.readField(text, "name");
    if (name) return name;
  }
  if (type === "ui-pattern" && patternName) return patternName;
  if (type === "manifest") return "Patterns manifest";
  for (const line of text.split(/\r?\n/)) {
    const m = line.match(H1_RE);
    if (m) return m[1].replace(/`/g, "");
  }
  return path.basename(id);
}

// Extract resolvable relative markdown-link targets (repo-relative posix), skipping
// fenced code blocks and non-local targets.
function extractLinks(absFile, text) {
  const targets = [];
  const lines = text.split(/\r?\n/);
  let fenced = false;
  for (const line of lines) {
    if (FENCE_RE.test(line)) {
      fenced = !fenced;
      continue;
    }
    if (fenced) continue;
    LINK_RE.lastIndex = 0;
    let m;
    while ((m = LINK_RE.exec(line)) !== null) {
      const full = m[1].trim();
      const raw = full.split("#")[0].split(" ")[0];
      if (isSkippable(raw)) continue;
      const resolvedAbs = path.resolve(path.dirname(absFile), raw);
      targets.push({ target: rel(resolvedAbs), anchor: full.includes("#") ? full.split("#")[1] : null });
    }
  }
  return targets;
}

// Extract inline-code file references (`x.md`, `patterns/x.md`, `patterns-manifest.json`),
// skipping fenced code blocks so example snippets don't create phantom edges.
function extractBacktickFiles(text) {
  const out = [];
  const lines = text.split(/\r?\n/);
  let fenced = false;
  for (const line of lines) {
    if (FENCE_RE.test(line)) {
      fenced = !fenced;
      continue;
    }
    if (fenced) continue;
    BACKTICK_FILE_RE.lastIndex = 0;
    let m;
    while ((m = BACKTICK_FILE_RE.exec(line)) !== null) out.push(m[1]);
  }
  return out;
}

function uniqueMatches(text, re) {
  const out = [];
  let m;
  re.lastIndex = 0;
  while ((m = re.exec(text)) !== null) if (!out.includes(m[1])) out.push(m[1]);
  return out;
}

function build({ repoRoot = REPO_ROOT } = {}) {
  const manifestAbs = path.join(repoRoot, MANIFEST_ID);
  const bySlug = loadManifest(manifestAbs);

  const roots = [
    path.join(repoRoot, "skills"),
    path.join(repoRoot, "wiki"),
    ...[...ROOT_DOCS].map((d) => path.join(repoRoot, d)),
  ];
  const mdFiles = roots.flatMap((rt) => walk(rt, [".md"]));
  const absFiles = [...new Set([...mdFiles, manifestAbs])];

  const nodes = new Map(); // id -> node
  const fileText = new Map(); // id -> raw text

  for (const abs of absFiles) {
    const id = rel(abs);
    if (isConnectionsView(id)) continue; // the generated view is never a node in the graph
    const type = typeOf(id);
    if (!type) continue;
    let text;
    try {
      text = fs.readFileSync(abs, "utf8");
    } catch {
      continue;
    }
    fileText.set(id, text);
    const isMd = id.endsWith(".md");
    const slug = type === "ui-pattern" ? path.basename(id, ".md") : null;
    const entry = slug ? bySlug.get(slug) : null;
    nodes.set(id, {
      id,
      label: extractLabel(id, type, text, entry?.name),
      type,
      dir: toPosix(path.dirname(id)),
      topics: isMd ? frontmatter.readList(text, "topics") : [],
      aliases: type === "ui-pattern" ? entry?.aliases || [] : isMd ? frontmatter.readList(text, "aliases") : [],
      prs: uniqueMatches(text, PR_RE),
      issues: uniqueMatches(text, ISSUE_RE),
      bytes: Buffer.byteLength(text, "utf8"),
      degree: 0,
    });
  }

  const edges = [];

  // 1. catalogs — the manifest -> each pattern file it lists. Emitted for every manifest
  //    entry regardless of whether the target resolves: a missing/renamed pattern file
  //    becomes a dangling edge and the integrity gate fails loudly. This is the catalog validator.
  for (const [, entry] of bySlug) {
    edges.push({ source: MANIFEST_ID, target: `${SKILL_ROOT}/${entry.file}`, type: "catalogs" });
  }

  // 2. see-also — a pattern -> another pattern it names in an inline-code reference.
  const seeAlso = new Map(); // `${src} ${tgt}` -> count
  for (const [id, text] of fileText) {
    if (nodes.get(id)?.type !== "ui-pattern") continue;
    for (const file of extractBacktickFiles(text)) {
      const target = file.includes("/") ? `${SKILL_ROOT}/${file}` : `${PATTERNS_PREFIX}${file}`;
      if (target === id || nodes.get(target)?.type !== "ui-pattern") continue;
      const key = `${id}${EDGE_KEY_SEP}${target}`;
      seeAlso.set(key, (seeAlso.get(key) || 0) + 1);
    }
  }
  for (const [key, count] of seeAlso) {
    const [source, target] = key.split(EDGE_KEY_SEP);
    edges.push({ source, target, type: "see-also", count });
  }

  // 3. references — SKILL.md / index.md -> the manifest, index, or pattern files they cite.
  const referenced = new Set(); // `${src} ${tgt}`
  for (const [id, text] of fileText) {
    const t = nodes.get(id)?.type;
    if (t !== "skill" && t !== "skill-index") continue;
    for (const file of extractBacktickFiles(text)) {
      let target;
      if (file === "patterns-manifest.json") target = MANIFEST_ID;
      else if (file === "index.md") target = `${SKILL_ROOT}/index.md`;
      else if (file.startsWith("patterns/")) target = `${SKILL_ROOT}/${file}`;
      else if (!file.includes("/") && file.endsWith(".md")) target = `${PATTERNS_PREFIX}${file}`;
      else continue;
      if (target === id || !nodes.has(target)) continue;
      const key = `${id}${EDGE_KEY_SEP}${target}`;
      if (referenced.has(key)) continue;
      referenced.add(key);
      edges.push({ source: id, target, type: "references" });
    }
  }

  // 4. links-to — relative markdown links between two known node files (root docs + wiki).
  const linkCounts = new Map(); // `${src} ${tgt}` -> {count, anchors:Set}
  for (const [id, text] of fileText) {
    if (!id.endsWith(".md")) continue;
    for (const { target, anchor } of extractLinks(path.join(repoRoot, id), text)) {
      if (target === id || !nodes.has(target)) continue;
      const key = `${id}${EDGE_KEY_SEP}${target}`;
      let entry = linkCounts.get(key);
      if (!entry) {
        entry = { count: 0, anchors: new Set() };
        linkCounts.set(key, entry);
      }
      entry.count += 1;
      if (anchor) entry.anchors.add(anchor);
    }
  }
  for (const [key, { count, anchors }] of linkCounts) {
    const [source, target] = key.split(EDGE_KEY_SEP);
    edges.push({ source, target, type: "links-to", count, anchors: [...anchors] });
  }

  // 5. topic / 6. plan / 7. covers — wiki frontmatter relations. topics/covers are
  //    list-valued, so dedup identical (type, source, target) the way the passes above do.
  const wikiSeen = new Set();
  const pushWiki = (source, target, type) => {
    const key = `${type}${EDGE_KEY_SEP}${source}${EDGE_KEY_SEP}${target}`;
    if (wikiSeen.has(key)) return;
    wikiSeen.add(key);
    edges.push({ source, target, type });
  };
  for (const [id, text] of fileText) {
    if (!id.startsWith("wiki/")) continue;
    for (const slug of frontmatter.readList(text, "topics")) {
      const target = `wiki/topics/${slug}.md`;
      if (nodes.has(target) && target !== id) pushWiki(id, target, "topic");
    }
    const planField = frontmatter.readField(text, "plan");
    if (planField && planField !== "none") {
      // Journal `plan:` is repo-root-relative (e.g. plans/... or wiki/plans/...).
      const candidate = planField.startsWith("wiki/") ? planField : `wiki/${planField.replace(/^\.?\//, "")}`;
      if (nodes.has(candidate)) pushWiki(id, candidate, "plan");
    }
    if (nodes.get(id)?.type === "wiki-topic") {
      for (const target of frontmatter.readList(text, "covers")) {
        // Preserve unresolved targets so the integrity gate can fail loudly instead of
        // silently dropping a stale topic-to-runtime declaration.
        pushWiki(id, target, "covers");
      }
    }
  }

  // Degree.
  for (const e of edges) {
    if (nodes.has(e.source)) nodes.get(e.source).degree += 1;
    if (nodes.has(e.target)) nodes.get(e.target).degree += 1;
  }

  const nodeList = [...nodes.values()].sort((a, b) => a.id.localeCompare(b.id));
  const edgeList = edges.sort(
    (a, b) => a.type.localeCompare(b.type) || a.source.localeCompare(b.source) || a.target.localeCompare(b.target),
  );

  const byType = {};
  for (const n of nodeList) byType[n.type] = (byType[n.type] || 0) + 1;
  const byEdge = {};
  for (const e of edgeList) byEdge[e.type] = (byEdge[e.type] || 0) + 1;

  return {
    counts: { nodes: nodeList.length, edges: edgeList.length, byType, byEdgeType: byEdge },
    nodes: nodeList,
    edges: edgeList,
  };
}

// Canonical serialization — the exact bytes graph:build writes. Shared with the
// graph-freshness eval so builder and checker never disagree on formatting.
function render(graph) {
  return JSON.stringify(graph, null, 2) + "\n";
}

// Coarse "area" for cross-subsystem filtering: the pattern catalog, the wiki, and root
// docs. A links-to edge is a seam when its endpoints sit in different areas.
function areaOf(id) {
  if (id.startsWith(`${SKILL_ROOT}/`) || id === MANIFEST_ID) return "catalog";
  if (id.startsWith("wiki/")) return "wiki";
  return "root";
}

// Render the graph as a set of human/agent-readable markdown pages: a small index at
// wiki/connections.md that routes to per-section files under wiki/connections/. Returns a
// { <repo-relative-posix-path>: <content> } map so a reader loads only the section its
// question needs. Node links from a section file resolve to the repo root via `../../<id>`
// (section files sit two levels down). Deterministic + timestamp-free, like render() above.
function renderConnections(graph) {
  const byId = new Map(graph.nodes.map((n) => [n.id, n]));
  const link = (id) => {
    const n = byId.get(id);
    const label = (n ? n.label : path.basename(id)).replace(/[[\]]/g, "");
    return `[${label}](../../${id})`;
  };
  const edgesOf = (t) => graph.edges.filter((e) => e.type === t);
  const finish = (lines) => lines.join("\n").replace(/\n*$/, "") + "\n";

  const head = (title, desc) => [
    `# Connections — ${title}`,
    "",
    desc,
    "",
    "Part of the [connections map](../connections.md), generated from the knowledge graph — **do not edit by hand**. Rebuilt on every `pnpm graph:build` and verified fresh by `pnpm evals:graph`.",
    "",
  ];

  // Catalog membership — the manifest and every pattern it catalogs.
  const catalog = () => {
    const out = head("Catalog membership", "Every pattern the manifest catalogs, with its alias and cross-reference counts.");
    const patterns = graph.nodes.filter((n) => n.type === "ui-pattern").sort((a, b) => a.id.localeCompare(b.id));
    const seeAlso = edgesOf("see-also");
    out.push(`The manifest catalogs ${patterns.length} pattern${patterns.length === 1 ? "" : "s"}:`, "");
    for (const p of patterns) {
      const refs = seeAlso.filter((e) => e.source === p.id || e.target === p.id).length;
      out.push(`- ${link(p.id)} — ${p.aliases.length} alias${p.aliases.length === 1 ? "" : "es"}, ${refs} see-also link${refs === 1 ? "" : "s"}`);
    }
    return finish(out);
  };

  // Pattern cross-references — the see-also mesh.
  const seeAlsoSection = () => {
    const out = head("Pattern cross-references", "Patterns that point at one another through inline-code `see-also` references.");
    const patterns = graph.nodes.filter((n) => n.type === "ui-pattern").sort((a, b) => a.id.localeCompare(b.id));
    const seeAlso = edgesOf("see-also");
    let any = false;
    for (const p of patterns) {
      const targets = seeAlso.filter((e) => e.source === p.id).map((e) => e.target).sort();
      if (!targets.length) continue;
      any = true;
      out.push(`- ${link(p.id)} → ${targets.map(link).join(", ")}`);
    }
    if (!any) out.push("_No see-also references yet._");
    return finish(out);
  };

  // Skill references — SKILL.md / index.md into the catalog.
  const references = () => {
    const out = head("Skill references", "What the skill entry point and its index cite: the manifest, the index, and pattern files.");
    const sources = graph.nodes.filter((n) => n.type === "skill" || n.type === "skill-index").sort((a, b) => a.id.localeCompare(b.id));
    const refEdges = edgesOf("references");
    for (const s of sources) {
      const refs = refEdges.filter((e) => e.source === s.id).map((e) => e.target).sort();
      out.push(refs.length ? `- ${link(s.id)} → ${refs.map(link).join(", ")}` : `- ${link(s.id)} — no catalog references`);
    }
    return finish(out);
  };

  // Wiki wiring — topics/plans/journal relations plus cross-area seams.
  const wikiWiring = () => {
    const out = head("Wiki wiring", "How the context wiki connects: journal → plan, page → topic, and links that cross between the catalog and the wiki.");
    const planEdges = edgesOf("plan").sort((a, b) => a.source.localeCompare(b.source));
    out.push("## Journal → plan", "");
    if (planEdges.length) for (const e of planEdges) out.push(`- ${link(e.source)} → ${link(e.target)}`);
    else out.push("_No journal-to-plan links yet._");
    const topicEdges = edgesOf("topic").sort((a, b) => a.source.localeCompare(b.source) || a.target.localeCompare(b.target));
    out.push("", "## Page → topic", "");
    if (topicEdges.length) for (const e of topicEdges) out.push(`- ${link(e.source)} → ${link(e.target)}`);
    else out.push("_No topic links yet._");
    const seams = edgesOf("links-to")
      .filter((e) => areaOf(e.source) !== areaOf(e.target))
      .sort((a, b) => a.source.localeCompare(b.source) || a.target.localeCompare(b.target));
    out.push("", "## Cross-area links (seams)", "");
    if (seams.length) for (const e of seams) out.push(`- ${link(e.source)} → ${link(e.target)}${e.count > 1 ? ` (×${e.count})` : ""}`);
    else out.push("_No cross-area links yet._");
    return finish(out);
  };

  const index = () =>
    finish([
      "# Connections — catalog + wiki wiring",
      "",
      "Generated from the knowledge graph ([`scripts/graph/build-graph.cjs`](../scripts/graph/build-graph.cjs)) — **do not edit by hand**.",
      "Rebuilt on every `pnpm graph:build` and verified fresh by `pnpm evals:graph`. It maps how the catalog and the",
      "context wiki wire together (open the graph viewer with `pnpm graph:view` for the full, interactive picture).",
      "",
      "This is a small index — open the section your question needs:",
      "",
      "- [Catalog membership](connections/catalog.md) — every pattern the manifest catalogs, with alias and cross-reference counts.",
      "- [Pattern cross-references](connections/see-also.md) — the see-also mesh between patterns.",
      "- [Skill references](connections/references.md) — what SKILL.md and index.md cite in the catalog.",
      "- [Wiki wiring](connections/wiki-wiring.md) — journal → plan, page → topic, and cross-area seams.",
    ]);

  return {
    [CONNECTIONS_INDEX_ID]: index(),
    [`${CONNECTIONS_DIR_ID}/catalog.md`]: catalog(),
    [`${CONNECTIONS_DIR_ID}/see-also.md`]: seeAlsoSection(),
    [`${CONNECTIONS_DIR_ID}/references.md`]: references(),
    [`${CONNECTIONS_DIR_ID}/wiki-wiring.md`]: wikiWiring(),
  };
}

function run() {
  const graph = build();

  // Integrity gate: every edge endpoint must resolve to a node. Check before writing so
  // a broken graph never overwrites the committed artifacts.
  const ids = new Set(graph.nodes.map((n) => n.id));
  const dangling = graph.edges.filter((e) => !ids.has(e.source) || !ids.has(e.target));
  if (dangling.length) {
    console.error(`FAIL: ${dangling.length} edge(s) with unresolved endpoints.`);
    for (const d of dangling.slice(0, 10)) console.error(`  ${d.type} ${d.source} -> ${d.target}`);
    process.exit(1);
  }

  fs.mkdirSync(path.dirname(OUT_FILE), { recursive: true });
  fs.writeFileSync(OUT_FILE, render(graph));

  const connFiles = renderConnections(graph);
  for (const [relPath, content] of Object.entries(connFiles)) {
    const abs = path.join(REPO_ROOT, relPath);
    fs.mkdirSync(path.dirname(abs), { recursive: true });
    fs.writeFileSync(abs, content);
  }

  console.log(`Knowledge graph → ${rel(OUT_FILE)}`);
  console.log(`Connections pages → ${Object.keys(connFiles).length} files (index + sections under ${CONNECTIONS_DIR_ID}/)`);
  console.log(`  nodes: ${graph.counts.nodes}   edges: ${graph.counts.edges}`);
  const fmt = (obj) =>
    Object.entries(obj)
      .sort((a, b) => b[1] - a[1])
      .map(([k, v]) => `${k}=${v}`)
      .join("  ");
  console.log(`  node types: ${fmt(graph.counts.byType)}`);
  console.log(`  edge types: ${fmt(graph.counts.byEdgeType)}`);
}

if (require.main === module) run();

module.exports = {
  build,
  render,
  renderConnections,
  typeOf,
  extractLinks,
  extractBacktickFiles,
  extractLabel,
  OUT_FILE,
  REPO_ROOT,
  CONNECTIONS_INDEX_ID,
  CONNECTIONS_DIR_ID,
};
