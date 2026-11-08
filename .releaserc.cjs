/**
 * semantic-release configuration
 *
 * - Version bumping driven by Conventional Commits
 * - Matches the standard package release policy used by accessibility-standards.
 * - Conventional changes other than `feat` are patches; `!` is major.
 * - Generates/updates CHANGELOG.md
 * - Writes version to package.json and publishes the constrained public package
 * - Creates Git tags + GitHub Releases
 */
module.exports = {
  branches: ['main'],
  tagFormat: 'v${version}',
  plugins: [
    [
      './scripts/semantic-release-analyzer.cjs',
      {
        preset: 'conventionalcommits',
        releaseRules: [
          { breaking: true, release: 'major' },
          { type: 'feat', release: 'minor' },
          ...['build', 'chore', 'ci', 'docs', 'fix', 'perf', 'refactor', 'revert', 'style', 'test']
            .map((type) => ({ type, release: 'patch' })),
        ],
      },
    ],

    ['./scripts/semantic-release-notes.cjs', { preset: 'conventionalcommits', presetConfig: {} }],

    [
      '@semantic-release/npm',
      {
        npmPublish: true,
      },
    ],

    [
      '@semantic-release/changelog',
      {
        changelogFile: 'CHANGELOG.md',
      },
    ],

    [
      '@semantic-release/git',
      {
        assets: ['CHANGELOG.md', 'package.json', 'pnpm-lock.yaml'],
        message: 'chore(release): ${nextRelease.version}\n\n${nextRelease.notes}',
      },
    ],

    [
      '@semantic-release/github',
      {
        successCommentCondition: false,
        failCommentCondition: false,
        releasedLabels: false,
      },
    ],
  ],
};
