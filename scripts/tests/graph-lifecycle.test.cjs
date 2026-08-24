"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const test = require("node:test");

const { build, danglingEdges } = require("../graph/build-graph.cjs");

function write(root, rel, text) {
  const target = path.join(root, rel);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, text);
}

function fixture(t) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "ui-design-brain-graph-"));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  write(root, "skills/ui-design-brain/SKILL.md", [
    "---",
    "name: ui-design-brain",
    "description: Fixture catalog.",
    "---",
    "# Fixture skill",
    "",
    "Read `index.md` and `patterns-manifest.json`.",
    "",
  ].join("\n"));
  write(root, "skills/ui-design-brain/index.md", "# Fixture index\n\nRead `patterns/alpha.md`.\n");
  write(root, "skills/ui-design-brain/patterns/alpha.md", "# Alpha\n");
  write(root, "skills/ui-design-brain/patterns-manifest.json", `${JSON.stringify([
    { name: "Alpha", slug: "alpha", aliases: [], file: "patterns/alpha.md" },
  ], null, 2)}\n`);
  write(root, "wiki/INDEX.md", "# Fixture wiki\n");
  write(root, "wiki/topics/demo.md", [
    "---",
    "aliases: [demo]",
    "covers: [skills/ui-design-brain/patterns/alpha.md]",
    "---",
    "# Demo",
    "",
  ].join("\n"));
  write(root, "wiki/plans/known.md", "# Known plan\n");
  write(root, "wiki/journal/known.md", [
    "---",
    "topics: [demo]",
    "plan: ./plans/known.md",
    "---",
    "# Known journal entry",
    "",
  ].join("\n"));
  write(root, "scripts/graph/data/graph.json", "sentinel\n");
  return root;
}

test("alternate repo roots produce normalized repo-relative ids", (t) => {
  const root = fixture(t);
  const graph = build({ repoRoot: root });
  assert.equal(danglingEdges(graph).length, 0);
  assert.ok(graph.nodes.some((node) => node.id === "skills/ui-design-brain/patterns/alpha.md"));
  assert.ok(graph.nodes.every((node) => !node.id.startsWith("../") && !path.isAbsolute(node.id)));
});

test("legacy evidence arrays and Markdown edges use canonical fence-safe extraction", (t) => {
  const root = fixture(t);
  fs.appendFileSync(path.join(root, "wiki/topics/demo.md"), [
    "", "````md", "```js", "[phantom](../plans/known.md)",
    "https://github.com/verndale/ui-design-brain/pull/999", "```",
    "https://evil.example/https://github.com/verndale/ui-design-brain/issues/998", "````",
    "https://github.com/verndale/ui-design-brain/issues/7", "",
  ].join("\n"));
  const graph = build({ repoRoot: root });
  const node = graph.nodes.find((item) => item.id === "wiki/topics/demo.md");
  assert.deepEqual(node.prs, []);
  assert.deepEqual(node.issues, ["7"]);
  assert.deepEqual(node.githubRefs.map((ref) => ref.number), [7]);
  assert.equal(graph.edges.some((edge) => edge.source === node.id && edge.target === "wiki/plans/known.md" && edge.type === "links-to"), false);
});

for (const [label, replacement, message] of [
  ["missing", null, /required catalog manifest is missing/],
  ["malformed", "{ not json\n", /required catalog manifest is malformed/],
  ["non-array", "{\"patterns\":[]}\n", /required catalog manifest must be an array/],
]) {
  test(`${label} required manifest fails before generated data can change`, (t) => {
    const root = fixture(t);
    const manifest = path.join(root, "skills/ui-design-brain/patterns-manifest.json");
    if (replacement === null) fs.rmSync(manifest);
    else fs.writeFileSync(manifest, replacement);
    const generated = path.join(root, "scripts/graph/data/graph.json");
    assert.throws(() => build({ repoRoot: root }), message);
    assert.equal(fs.readFileSync(generated, "utf8"), "sentinel\n");
  });
}

test("unresolved topic, plan, and covers declarations remain visible to the shared gate", (t) => {
  const root = fixture(t);
  write(root, "wiki/topics/demo.md", [
    "---",
    "aliases: [demo]",
    "covers: [skills/ui-design-brain/patterns/missing.md]",
    "---",
    "# Demo",
    "",
  ].join("\n"));
  write(root, "wiki/journal/known.md", [
    "---",
    "topics: [missing-topic]",
    "plan: plans/missing.md",
    "---",
    "# Broken journal entry",
    "",
  ].join("\n"));
  const dangling = danglingEdges(build({ repoRoot: root }));
  assert.deepEqual(new Set(dangling.map((edge) => edge.type)), new Set(["covers", "plan", "topic"]));
});

test("plan sentinels and supported wiki plan paths remain valid", (t) => {
  const root = fixture(t);
  write(root, "wiki/journal/pending.md", "---\ntopics: []\nplan: pending\n---\n# Pending\n");
  write(root, "wiki/journal/none.md", "---\ntopics: []\nplan: none\n---\n# None\n");
  write(root, "wiki/journal/root-relative.md", "---\ntopics: []\nplan: wiki/plans/known.md\n---\n# Root relative\n");
  const graph = build({ repoRoot: root });
  const plans = graph.edges.filter((edge) => edge.type === "plan");
  assert.equal(plans.length, 2);
  assert.ok(plans.every((edge) => edge.target === "wiki/plans/known.md"));
  assert.equal(danglingEdges(graph).length, 0);
});

for (const [label, plan] of [
  ["traversal", "../README.md"],
  ["in-directory traversal", "plans/../plans/known.md"],
  ["absolute", "/tmp/plan.md"],
  ["outside plan directory", "wiki/topics/demo.md"],
  ["normalized outside plan directory", "plans/../INDEX.md"],
]) {
  test(`malformed ${label} plan paths fail the shared dangling-edge gate`, (t) => {
    const root = fixture(t);
    write(root, "wiki/journal/invalid.md", `---\ntopics: []\nplan: ${plan}\n---\n# Invalid plan\n`);
    const dangling = danglingEdges(build({ repoRoot: root }));
    assert.equal(dangling.length, 1);
    assert.equal(dangling[0].type, "plan");
    assert.equal(dangling[0].source, "wiki/journal/invalid.md");
    assert.ok(dangling[0].target.startsWith("wiki/plans/.invalid/"));
  });
}
