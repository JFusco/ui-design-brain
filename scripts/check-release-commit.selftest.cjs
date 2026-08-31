#!/usr/bin/env node

'use strict';

const assert = require('node:assert/strict');
const { validateReleaseCommit } = require('./check-release-commit.cjs');

assert.deepEqual(validateReleaseCommit({ subject: 'feat(catalog): add a pattern', body: '' }), []);
assert.deepEqual(validateReleaseCommit({ subject: 'feat(catalog)!: revise authority', body: '' }), []);
assert.match(
  validateReleaseCommit({ subject: 'docs: describe a breaking implementation', body: 'BREAKING CHANGE: stale footer' })[0],
  /must declare breaking changes/,
);
assert.match(
  validateReleaseCommit({ subject: 'feat(catalog) !: malformed', body: '' })[0],
  /conventional type/,
);

process.stdout.write('PASS release commit preflight self-tests.\n');
