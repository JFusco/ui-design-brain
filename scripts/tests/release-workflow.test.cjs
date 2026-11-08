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
  assert.doesNotMatch(workflow, /NPM_TOKEN|NPM_BOOTSTRAP_TOKEN/);
  assert.match(
    workflow,
    /- name: Publish, tag, changelog, and GitHub release\s+(?:if:[^\n]+\s+)?env:\s+GITHUB_TOKEN: \$\{\{ github\.token \}\}\s+HUSKY: ['"]?0['"]?\s+run: pnpm exec semantic-release/,
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

test('a published release waits for npm, then notifies the Pin Courier runner', () => {
  const workflow = fs.readFileSync(path.join(ROOT, '.github/workflows/release.yml'), 'utf8');
  const order = [
    '- name: Record pre-release revision',
    '- name: Publish, tag, changelog, and GitHub release',
    '- name: Detect a published release',
    '- name: Wait for the release on the npm registry',
    '- name: Mint Pin Courier token',
    '- name: Notify the Renovate runner',
  ].map((step) => workflow.indexOf(step));
  assert.ok(order.every((index, i) => index > 0 && (i === 0 || index > order[i - 1])));
  assert.match(workflow, /- name: Mint Pin Courier token\s+id: courier\s+if: \$\{\{ always\(\) && steps\.released\.outputs\.published == 'true' \}\}/);
  assert.match(workflow, /repositories: renovate-config\s+permission-contents: write/);
  assert.match(workflow, /run: node scripts\/registry-readiness\.cjs/);
  assert.match(workflow, /run: node scripts\/notify-pin-courier\.cjs/);
});
