#!/usr/bin/env node
"use strict";

// Classifies a set of changed repo paths for the wiki automation: is the change
// "substantive" (worth a journal entry), and which wiki topic slug(s) does it
// touch? Both are deliberately best-effort heuristics — a missed topic is a
// small cost, and the journal warn is non-blocking. Topic slugs match the pages
// under wiki/topics/.

// A path is substantive when it changes what the repo ships or how it is built:
// the pattern catalog (patterns, manifest, index, SKILL.md) or the graph/wiki
// tooling (graph builder, collectors, freshness gate, workflows, hooks).
const SUBSTANTIVE_RE = [
  /^skills\/ui-design-brain\//,
  /^scripts\/(?:graph|wiki|evals)\//,
  /^\.github\/workflows\//,
  /^\.husky\//,
];

// wiki/ edits are never substantive — this is what stops a wiki-sync bot PR from
// triggering another round of capture. Generated graph data is also excluded: every
// lifecycle rebuild stages it, so counting it would make every PR appear substantive.
const NEVER_RE = [/^wiki\//, /^scripts\/graph\/data\//];

// Ordered path → topic-slug guesses. First match wins per path; a path may be
// substantive without matching any topic (topics is best-effort). Catalog-content
// edits deliberately match no topic — a pattern change stands on its own journal
// entry until a dedicated topic exists — while subsystem tooling maps to the one
// seed topic that documents it.
const TOPIC_RE = [
  [/^scripts\/(?:graph|wiki|evals)\//, "graph-wiki-subsystem"],
  [/^\.github\/workflows\/(?:wiki|graph|quality)/, "graph-wiki-subsystem"],
  [/^\.husky\//, "graph-wiki-subsystem"],
];

function classify(paths) {
  const changed = (paths || []).map((p) => String(p).trim()).filter(Boolean);
  const relevant = changed.filter((p) => !NEVER_RE.some((re) => re.test(p)));
  const substantivePaths = relevant.filter((p) => SUBSTANTIVE_RE.some((re) => re.test(p)));
  const topics = [];
  for (const p of substantivePaths) {
    for (const [re, slug] of TOPIC_RE) {
      if (re.test(p)) {
        if (!topics.includes(slug)) topics.push(slug);
        break;
      }
    }
  }
  return { substantive: substantivePaths.length > 0, substantivePaths, topics };
}

module.exports = { classify, SUBSTANTIVE_RE, NEVER_RE, TOPIC_RE };
