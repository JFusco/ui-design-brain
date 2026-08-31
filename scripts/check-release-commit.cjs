#!/usr/bin/env node

'use strict';

const { spawnSync } = require('node:child_process');

const BREAKING_BODY = /^BREAKING[ -]CHANGE:\s*/m;
const BREAKING_HEADER = /^[a-z]+(?:\([^)]+\))?!:/;

function git(args) {
  const result = spawnSync('git', args, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
  if (result.error) throw result.error;
  if (result.status !== 0) throw new Error(result.stderr.trim() || `git ${args.join(' ')} failed`);
  return result.stdout.trim();
}

function validateReleaseCommit({ subject, body }) {
  const failures = [];
  if (BREAKING_BODY.test(body)) {
    failures.push('release commits must declare breaking changes with ! in the conventional subject');
  }
  if (subject.includes('!:') && !BREAKING_HEADER.test(subject)) {
    failures.push('an intentional breaking release must use a conventional type(scope)!: or type!: subject');
  }
  return failures;
}

function releaseCommits() {
  const tag = spawnSync('git', ['describe', '--tags', '--match', 'v[0-9]*.[0-9]*.[0-9]*', '--abbrev=0'], { encoding: 'utf8' });
  const range = tag.status === 0 ? `${tag.stdout.trim()}..HEAD` : 'HEAD';
  return git(['log', '--format=%H%x1f%s%x1f%b%x1e', range])
    .split('\x1e')
    .map((record) => record.trim())
    .filter(Boolean)
    .map((record) => {
      const [hash = '', subject = '', ...body] = record.split('\x1f');
      return { hash: hash.trim(), subject: subject.trim(), body: body.join('\x1f').trim() };
    });
}

if (require.main === module) {
  try {
    const failures = releaseCommits().flatMap((commit) =>
      validateReleaseCommit(commit).map((message) => `${commit.hash.slice(0, 12)} ${JSON.stringify(commit.subject)}: ${message}`),
    );
    if (failures.length > 0) throw new Error(failures.join('\n'));
    process.stdout.write('PASS release commits use the standard breaking-change policy.\n');
  } catch (error) {
    process.stderr.write(`FAIL ${error instanceof Error ? error.message : String(error)}\n`);
    process.exit(1);
  }
}

module.exports = { validateReleaseCommit };
