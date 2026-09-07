'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.resolve(__dirname, '../..');

test('artifact inspection cannot fail on the currently published package version', () => {
  const workflow = fs.readFileSync(path.join(ROOT, '.github/workflows/release.yml'), 'utf8');
  assert.match(workflow, /- name: Inspect packed artifact\s+run: npm pack --dry-run --ignore-scripts/);
  assert.doesNotMatch(workflow, /npm publish --dry-run/);
  assert.match(
    workflow,
    /- name: Publish, tag, changelog, and GitHub release\s+env:\s+GITHUB_TOKEN: \$\{\{ github\.token \}\}\s+HUSKY: 0\s+run: pnpm exec semantic-release/,
  );
});
