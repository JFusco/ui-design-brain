"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { spawnSync } = require("node:child_process");

const { extractClosingIssues, extractGithubRefs, parseGithubQuery } = require("../wiki/lib/github.cjs");
const { normalizeContext, run: reconcileMerge } = require("../wiki/on-merge-sync.cjs");
const { refresh } = require("../wiki/refresh-issue-state.cjs");
const { build } = require("../graph/build-graph.cjs");
const { isGraphInput, normalize } = require("../graph/pre-commit.cjs");
const { formatRoute, route } = require("../graph/routing.cjs");

const ROOT = path.resolve(__dirname, "..", "..");
const read = (relative) => fs.readFileSync(path.join(ROOT, relative), "utf8");

test("GitHub citations are canonical, repo-qualified, deduplicated, and outside code fences", () => {
  const refs = extractGithubRefs([
    "[PR](https://github.com/Verndale/UI-Design-Brain/pull/43)",
    "https://www.github.com/verndale/ui-design-brain/pull/43",
    "[issue](http://github.com/other/repo/issues/12)",
    "https://example.test/github.com/hostile/repo/issues/13",
    "```",
    "https://github.com/ignored/repo/pull/99",
    "```",
    "~~~md",
    "https://github.com/ignored/repo/issues/98",
    "~~~",
  ].join("\n"));
  assert.deepEqual(refs, [
    { kind: "pull-request", repository: "verndale/ui-design-brain", number: 43, url: "https://github.com/verndale/ui-design-brain/pull/43" },
    { kind: "issue", repository: "other/repo", number: 12, url: "https://github.com/other/repo/issues/12" },
  ]);
});

test("evidence queries require a repository and closing clauses retain every issue", () => {
  assert.equal(parseGithubQuery("#43"), null);
  assert.equal(parseGithubQuery("verndale/ui-design-brain PR #43").url, "https://github.com/verndale/ui-design-brain/pull/43");
  assert.deepEqual(parseGithubQuery("verndale/ui-design-brain#43"), {
    kind: null,
    repository: "verndale/ui-design-brain",
    number: 43,
    url: null,
  });
  assert.deepEqual(extractClosingIssues(
    "Closes #9 and #10. Related #99.\n~~~md\nFixes hidden/repo#98.\n~~~\nFixes other/repo#11. Resolved https://github.com/third/repo/issues/12.",
    "verndale/ui-design-brain",
  ).map((ref) => ref.url), [
    "https://github.com/verndale/ui-design-brain/issues/9",
    "https://github.com/verndale/ui-design-brain/issues/10",
    "https://github.com/other/repo/issues/11",
    "https://github.com/third/repo/issues/12",
  ]);
});

test("merged-PR context normalizes portable aliases without a durable snapshot", () => {
  assert.deepEqual(normalizeContext({
    number: "5",
    title: "Change",
    url: "https://github.com/Verndale/UI-Design-Brain/pull/5",
    merged_at: "2026-08-23T10:00:00Z",
    files: ["a.md"],
    commits: [{ sha: "abc", message: "feat: change\nbody" }],
  }), {
    schemaVersion: 1,
    repository: "verndale/ui-design-brain",
    number: 5,
    title: "Change",
    body: "",
    url: "https://github.com/Verndale/UI-Design-Brain/pull/5",
    mergedAt: "2026-08-23T10:00:00Z",
    changedPaths: ["a.md"],
    commits: [{ hash: "abc", subject: "feat: change" }],
  });
});

test("manual replay merges closing issues into a journal that already cites the PR", async (t) => {
  const wiki = fs.mkdtempSync(path.join(os.tmpdir(), "brain-prefilled-pr-"));
  t.after(() => fs.rmSync(wiki, { recursive: true, force: true }));
  fs.mkdirSync(path.join(wiki, "journal"));
  const journal = path.join(wiki, "journal", "change.md");
  fs.writeFileSync(journal, "---\npr: https://github.com/verndale/ui-design-brain/pull/43\nissue: pending\ntopics: []\n---\n# Change\n");
  const context = { schemaVersion: 1, repository: "verndale/ui-design-brain", number: 43, title: "Change", body: "Closes #43 and other/repo#12.", url: "https://github.com/verndale/ui-design-brain/pull/43", changedPaths: ["wiki/journal/change.md"], commits: [] };
  const first = await reconcileMerge(context, wiki);
  const text = fs.readFileSync(journal, "utf8");
  assert.match(text, /^issue: https:\/\/github\.com\/verndale\/ui-design-brain\/issues\/43$/m);
  assert.match(text, /https:\/\/github\.com\/other\/repo\/issues\/12/);
  const second = await reconcileMerge(context, wiki);
  assert.ok(first.changes.length > 0);
  assert.equal(second.changes.length, 0);
});

test("catalog graph adds githubRefs without changing its curated node model", () => {
  const graph = build();
  const node = graph.nodes.find((item) => item.id === "wiki/journal/2026-08-22-standardize-quality-and-graph-lifecycle.md");
  assert.ok(node);
  assert.ok(node.issues.includes("40"));
  assert.ok(node.githubRefs.some((ref) => ref.kind === "issue" && ref.repository === "verndale/ui-design-brain" && ref.number === 40));
  assert.equal(graph.nodes.some((item) => item.type === "github-pr" || item.type === "github-issue"), false);
  assert.ok(graph.nodes.some((item) => item.type === "manifest"));
  assert.ok(graph.edges.some((edge) => edge.type === "catalogs"));
});

function graphNode(id, type, options = {}) {
  return { id, label: id, type, degree: 1, topics: [], aliases: [], bytes: options.bytes || 100, githubRefs: options.githubRefs || [] };
}

const policy = {
  edgeCosts: { topic: 1 },
  hubPenalty: 0.5,
  excludedIntermediateTypes: ["wiki-index"],
  intents: {
    why: { preferredTargetTypes: ["wiki-topic"], preferredSourceTypes: ["wiki-journal", "wiki-topic"], allowSourceAsTarget: true },
    wiring: { preferredTargetTypes: ["wiki-topic"], preferredSourceTypes: ["wiki-topic"] },
    impact: { preferredTargetTypes: ["wiki-topic"], preferredSourceTypes: ["wiki-topic"] },
  },
};

test("repo-qualified evidence prefers journal authority and reports byte cost", () => {
  const ref = { kind: "pull-request", repository: "verndale/ui-design-brain", number: 43, url: "https://github.com/verndale/ui-design-brain/pull/43" };
  const journal = graphNode("wiki/journal/change.md", "wiki-journal", { bytes: 180, githubRefs: [ref] });
  const topic = graphNode("wiki/topics/graph-wiki-subsystem.md", "wiki-topic", { bytes: 320, githubRefs: [ref] });
  const result = route({ nodes: [journal, topic], edges: [{ source: journal.id, target: topic.id, type: "topic" }] }, {
    intent: "why",
    query: "verndale/ui-design-brain PR #43",
    policy,
  });
  assert.equal(result.status, "ok");
  assert.equal(result.source.id, journal.id);
  assert.equal(result.itinerary[0].relation, "evidence citation");
  assert.equal(result.totalBytes, 500);
  assert.match(formatRoute(result), /500 B to read/);
  assert.match(formatRoute(result), /Authority: wiki\/journal\/change\.md → wiki\/topics\/graph-wiki-subsystem\.md/);
  assert.match(formatRoute(result), /included because it cites verndale\/ui-design-brain PR #43/);
});

test("bare and kind-colliding compact evidence never guess", () => {
  const pr = graphNode("wiki/journal/pr.md", "wiki-journal", { githubRefs: [{ kind: "pull-request", repository: "verndale/repo", number: 7, url: "https://github.com/verndale/repo/pull/7" }] });
  const issue = graphNode("wiki/journal/issue.md", "wiki-journal", { githubRefs: [{ kind: "issue", repository: "verndale/repo", number: 7, url: "https://github.com/verndale/repo/issues/7" }] });
  assert.equal(route({ nodes: [pr, issue], edges: [] }, { intent: "why", query: "#7", policy }).status, "missing-source");
  const result = route({ nodes: [pr, issue], edges: [] }, { intent: "why", query: "verndale/repo#7", policy });
  assert.equal(result.status, "ambiguous-source");
});

test("viewer keeps alias search and renders evidence with safe DOM links", () => {
  const source = read("scripts/graph/viewer/viewer.js");
  assert.match(source, /node\.githubRefs \|\| \[\]/);
  assert.match(source, /\.\.\.\(node\.aliases \|\| \[\]\)/);
  assert.match(source, /link\.textContent = refLabel\(ref\)/);
  assert.match(source, /link\.rel = "noopener noreferrer"/);
  assert.doesNotMatch(source, /insertAdjacentHTML/);
});

test("the five workflow identities and focused commands remain stable", () => {
  const quality = read(".github/workflows/quality.yml");
  const commitlint = read(".github/workflows/commitlint.yml");
  const check = read(".github/workflows/wiki-check.yml");
  const merge = read(".github/workflows/wiki-sync.yml");
  const issue = read(".github/workflows/wiki-issue-sync.yml");
  for (const [source, name, job] of [
    [quality, "Quality", "quality"],
    [commitlint, "Commit message lint", "commitlint"],
    [check, "Wiki integrity", "check"],
    [merge, "Sync context wiki", "sync"],
    [issue, "Sync wiki issue state", "sync"],
  ]) {
    assert.match(source, new RegExp(`^name: ${name}$`, "m"));
    assert.match(source, new RegExp(`^ {2}${job}:$`, "m"));
  }
  assert.match(quality, /pnpm run verify:ci/);
  assert.doesNotMatch(quality, /ci-journal-warn/);
  assert.equal((check.match(/pnpm run wiki:check/g) || []).length, 1);
  assert.match(check, /pull_request:\n {4}branches: \[main\]/);
  assert.match(check, /push:\n {4}branches: \[main\]/);
  assert.match(check, /workflow_dispatch: \{\}/);
});

test("writers enforce replay, pagination, bot auth, race guards, and review branches", () => {
  const merge = read(".github/workflows/wiki-sync.yml");
  const issue = read(".github/workflows/wiki-issue-sync.yml");
  const pr = read(".github/workflows/pr.yml");
  assert.equal((merge.match(/--paginate --slurp/g) || []).length, 2);
  assert.doesNotMatch(merge, /--slurp --jq/);
  assert.match(merge, /workflow_dispatch:[\s\S]*pr_number:/);
  assert.match(merge, /\.merged == true and \.merged_at != null/);
  assert.match(merge, /schemaVersion: 1/);
  assert.match(merge, /\$RUNNER_TEMP\/wiki-files\.json/);
  assert.match(merge, /persist-credentials: false/);
  assert.match(merge, /gh auth setup-git/);
  assert.match(merge, /--force-with-lease/);
  assert.match(merge, /bot\/wiki-sync\/\$\{PR_NUMBER\}/);
  assert.doesNotMatch(merge, /bot\/wiki-sync\/pr-/);
  assert.match(issue, /cron: "30 11 \* \* \*" # Daily at 11:30 UTC/);
  assert.match(issue, /workflow_dispatch: \{\}/);
  for (const source of [merge, issue]) {
    assert.match(source, /GRAPHIFY_SKIP_HOOK: "1"/);
    assert.doesNotMatch(source, /contents: write|pull-requests: write/);
    assert.match(source, /GH_TOKEN: \$\{\{ secrets\.PR_BOT_TOKEN \}\}/);
  }
  assert.match(pr, /"bot\/wiki-\*\*"/);
  assert.match(pr, /!startsWith\(github\.ref_name, 'bot\/wiki-'\)/);
});

test("runtime and Commitlint provider are pinned to the shared contract", () => {
  const names = ["quality", "commitlint", "wiki-check", "wiki-sync", "wiki-issue-sync", "pr"];
  for (const name of names) {
    const source = read(`.github/workflows/${name}.yml`);
    assert.match(source, /node-version: "24\.14\.0"/);
    assert.match(source, /corepack prepare pnpm@10\.33\.0 --activate/);
  }
  const commitlint = read(".github/workflows/commitlint.yml");
  assert.equal((commitlint.match(/pnpm exec commitlint --config commitlint\.config\.cjs/g) || []).length, 2);
  const pkg = JSON.parse(read("package.json"));
  assert.equal(pkg.devDependencies["@verndale/ai-commit"], "2.7.0");
  assert.equal(pkg.devDependencies["@commitlint/cli"], undefined);
  assert.equal(read("commitlint.config.cjs"), 'module.exports = require("@verndale/ai-commit");\n');
  assert.equal(read("pnpm-workspace.yaml"), 'publicHoistPattern:\n  - "@commitlint/cli"\n');
  assert.equal(read(".husky/commit-msg"), '#!/usr/bin/env sh\npnpm exec ai-commit lint --edit "$1"\n');
});

test("large paginated fixtures flatten to one valid file and commit array", () => {
  const pages = Array.from({ length: 3 }, (_, page) => Array.from({ length: 125 }, (_, index) => ({ filename: `p${page}-${index}.md` })));
  const files = spawnSync("jq", ["-c", "map(.[] | .filename)"], { input: JSON.stringify(pages), encoding: "utf8" });
  assert.equal(files.status, 0, files.stderr);
  assert.equal(JSON.parse(files.stdout).length, 375);
  const commits = spawnSync("jq", ["-c", 'map(.[] | {hash: .sha, subject: (.commit.message | split("\\n")[0])})'], {
    input: '[[{"sha":"a1","commit":{"message":"first\\nbody"}}],[{"sha":"b2","commit":{"message":"second"}}]]',
    encoding: "utf8",
  });
  assert.equal(commits.status, 0, commits.stderr);
  assert.equal(commits.stdout.trim(), '[{"hash":"a1","subject":"first"},{"hash":"b2","subject":"second"}]');
});

test("issue refresh caches repeated repository-and-number lookups", () => {
  const topics = fs.mkdtempSync(path.join(os.tmpdir(), "brain-wiki-issue-cache-"));
  const url = "https://github.com/other/repo/issues/12";
  fs.writeFileSync(path.join(topics, "a.md"), `# A\n\n## Open threads\n\n- [other/repo issue #12](${url})\n`);
  fs.writeFileSync(path.join(topics, "b.md"), `# B\n\n## Open threads\n\n- [same evidence](${url})\n`);
  const calls = [];
  const changes = refresh(topics, (number, repository) => {
    calls.push(`${repository}#${number}`);
    return "closed";
  });
  assert.deepEqual(calls, ["other/repo#12"]);
  assert.equal(changes.length, 2);
});

test("issue refresh closes a line only after every cited issue is confirmed closed", () => {
  const topics = fs.mkdtempSync(path.join(os.tmpdir(), "brain-wiki-multi-issue-"));
  const first = "https://github.com/verndale/ui-design-brain/issues/43";
  const second = "https://github.com/other/repo/issues/12";
  fs.writeFileSync(path.join(topics, "multi.md"), `# Multi\n\n## Open threads\n\n- [first](${first}) and [second](${second})\n`);
  const calls = [];
  const partial = refresh(topics, (number, repository) => {
    calls.push(`${repository}#${number}`);
    return number === "43" ? "closed" : null;
  });
  assert.deepEqual(calls, ["verndale/ui-design-brain#43", "other/repo#12"]);
  assert.equal(partial.length, 0);
  assert.doesNotMatch(fs.readFileSync(path.join(topics, "multi.md"), "utf8"), /— closed/);
  assert.equal(refresh(topics, () => "closed").length, 1);
  assert.match(fs.readFileSync(path.join(topics, "multi.md"), "utf8"), /— closed/);
  const beforeUncertain = fs.readFileSync(path.join(topics, "multi.md"), "utf8");
  assert.equal(refresh(topics, (number) => number === "43" ? "open" : null).length, 0);
  assert.equal(fs.readFileSync(path.join(topics, "multi.md"), "utf8"), beforeUncertain);
});

test("issue refresh ignores fenced citations and headings", (t) => {
  const topics = fs.mkdtempSync(path.join(os.tmpdir(), "brain-wiki-fences-"));
  t.after(() => fs.rmSync(topics, { recursive: true, force: true }));
  const file = path.join(topics, "fences.md");
  fs.writeFileSync(file, "# T\n\n## Open threads\n\n```md\n## Decisions\n- [fenced](https://github.com/other/repo/issues/90)\n```\n~~~txt\n- [fenced too](https://github.com/other/repo/issues/91)\n~~~\n- [live](https://github.com/other/repo/issues/92)\n## Decisions\n- [outside](https://github.com/other/repo/issues/93)\n");
  const calls = [];
  assert.equal(refresh(topics, (number) => { calls.push(number); return "closed"; }).length, 1);
  assert.deepEqual(calls, ["92"]);
  assert.doesNotMatch(fs.readFileSync(file, "utf8"), /issues\/(?:90|91|93)\) — closed/);
});

test("pre-commit lifecycle is contamination-safe, skippable, and fail-open", () => {
  const helper = read("scripts/graph/pre-commit.cjs");
  const hook = read(".husky/pre-commit");
  assert.match(helper, /\["ls-files", "--others", "--exclude-standard"\]/);
  assert.match(helper, /GRAPHIFY_SKIP_HOOK === "1"/);
  assert.match(helper, /catch \{/);
  assert.match(hook, /node scripts\/graph\/pre-commit\.cjs \|\|/);
  assert.equal(isGraphInput("skills/ui-design-brain/patterns/accordion.md"), true);
  assert.equal(isGraphInput("skills/ui-design-brain/patterns-manifest.json"), true);
  assert.equal(isGraphInput("scripts/wiki/lib/github.cjs"), true);
  assert.equal(isGraphInput("scripts/graph/data/graph.json"), false);
  assert.equal(normalize(".\\wiki\\topics\\demo.md"), "wiki/topics/demo.md");
});

test("AGENTS routes single-topic history through the index and only cross-page questions through the navigator", () => {
  const guide = read("AGENTS.md");
  assert.match(guide, /Single-topic rationale or history:[\s\S]*wiki\/INDEX\.md/);
  assert.match(guide, /Cross-page questions only:[\s\S]*scripts\/wiki\/navigate\.cjs/);
  assert.match(guide, /Read only the returned byte-costed itinerary/);
  assert.match(guide, /Never bulk-load `wiki\/` or `scripts\/graph\/data\/graph\.json`/);
  assert.match(guide, /ask one focused question/);
});
