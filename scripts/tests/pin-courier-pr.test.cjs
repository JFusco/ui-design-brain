'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const { isPinCourierPR } = require('../is-pin-courier-pr.cjs');

const ROOT = path.resolve(__dirname, '../..');
const repository = 'JFusco/ui-design-brain';
const pull = () => ({
  user: { login: 'pin-courier[bot]', id: 351979519, type: 'Bot' },
  head: { ref: 'renovate/npm-minor-and-patch', repo: { full_name: repository } },
  base: { ref: 'main', repo: { full_name: repository } },
});

test('only the installed Pin Courier App on its own Renovate branch gets a metadata exception', () => {
  assert.equal(isPinCourierPR(pull(), repository), true);
  for (const mutate of [
    (p) => { p.user.login = 'other[bot]'; },
    (p) => { p.user.id = 1; },
    (p) => { p.user.type = 'User'; },
    (p) => { p.head.repo.full_name = 'someone/fork'; },
    (p) => { p.head.ref = 'codex/95-migration'; },
    (p) => { p.base.ref = 'other'; },
    (p) => { p.base.repo.full_name = 'someone/fork'; },
  ]) {
    const p = pull();
    mutate(p);
    assert.equal(isPinCourierPR(p, repository), false);
  }
  assert.equal(isPinCourierPR(undefined, repository), false);
  assert.equal(isPinCourierPR(pull(), ''), false);
});

test('all metadata lint steps use the App guard while Quality stays enforced', () => {
  const lint = fs.readFileSync(path.join(ROOT, '.github/workflows/commitlint.yml'), 'utf8');
  assert.match(lint, /run: node scripts\/is-pin-courier-pr\.cjs/);
  assert.equal(lint.match(/steps\.pin_courier\.outputs\.trusted != 'true'/g).length, 3);
  const quality = fs.readFileSync(path.join(ROOT, '.github/workflows/quality.yml'), 'utf8');
  assert.match(quality, /run: pnpm run verify:ci/);
  assert.doesNotMatch(quality, /pin_courier|is-pin-courier/);
});
