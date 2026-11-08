'use strict';

const { filterReleaseCommits } = require('./release-commits.cjs');

async function generateNotes(pluginConfig, context) {
  const official = await import('@semantic-release/release-notes-generator');
  return official.generateNotes(pluginConfig, {
    ...context,
    commits: filterReleaseCommits(context.commits),
  });
}

module.exports = { generateNotes };
