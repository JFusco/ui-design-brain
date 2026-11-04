'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.resolve(__dirname, '../..');

test('artifact inspection cannot fail on the currently published package version', () => {
  const workflow = fs.readFileSync(path.join(ROOT, '.github/workflows/release.yml'), 'utf8');
  assert.match(workflow, /- name: Inspect packed artifact\s+(?:if:[^\n]+\s+)?run: npm pack --dry-run --ignore-scripts/);
  assert.doesNotMatch(workflow, /npm publish --dry-run/);
  assert.match(
    workflow,
    /- name: Publish, tag, changelog, and GitHub release\s+(?:if:[^\n]+\s+)?env:\s+GITHUB_TOKEN: \$\{\{ github\.token \}\}\s+NPM_TOKEN: \$\{\{ secrets\.NPM_BOOTSTRAP_TOKEN \}\}\s+HUSKY: ['"]?0['"]?\s+run: pnpm exec semantic-release/,
  );
});

test('new-package publication requires personal ownership, public visibility, and activation', () => {
  const workflow = fs.readFileSync(path.join(ROOT, '.github/workflows/release.yml'), 'utf8');
  assert.match(workflow, /release:\s+if: >-\s+github\.repository == 'JFusco\/ui-design-brain' &&\s+github\.event\.repository\.private == false &&\s+vars\.NPM_RELEASE_ENABLED == 'true' &&/);
  const metadata = JSON.parse(fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8'));
  assert.equal(metadata.name, 'ui-design-brain');
  assert.equal(metadata.repository.url, 'git+https://github.com/JFusco/ui-design-brain.git');
  assert.equal(metadata.publishConfig.provenance, true);
});
