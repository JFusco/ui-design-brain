---
status: partial
executed: 2026-11-02
date: 2026-11-02
evidence:
  - "https://github.com/verndale/ui-design-brain/issues/81"
  - "https://github.com/JFusco/ui-design-brain/pull/82"
  - "https://github.com/JFusco/ui-design-brain/issues/83"
source_tool: file
source: "/Users/joe.fusco/Projects/.ui-design-brain-migration-20261102-222222/approved-plan.md"
topics: [packaging-and-distribution]
audit_note: "Public transfer verified on 2026-11-03; local origin and source preparation updated in PR #82. Plan remains partial until first npm publication and personal automation are verified in issue #83."
---
# Transfer UI Design Brain with its history intact

## Summary

Transfer `verndale/ui-design-brain` to **`JFusco/ui-design-brain`**, then make it public after reviewing the material that will become visible.

Move the existing local project to **`/Users/joe.fusco/Projects/ui-design-brain`**. Publish future releases as the unscoped npm package **`ui-design-brain`**.

This replaces the fresh-copy plan: **retain the current files, wiki, commits, branches, tags, releases, issues, PRs, and discussions attached to those records.** GitHub supports preserving repository history and redirecting existing links during transfer. [GitHub transfer documentation](https://docs.github.com/en/repositories/creating-and-managing-repositories/transferring-a-repository)

## Preserve and transfer

- Record the upstream commit, branch/tag references, releases, PRs, issues, and relevant repository settings before transfer. Create a local Git backup.
- Preserve the complete tracked `wiki/`, including journals, plans, topics, and connections. This repository uses that directory; GitHub’s separate Wiki feature is currently disabled.
- Review current files, Git history, and GitHub records for internal information before public exposure. If specific material prevents publication, retain private visibility and resolve those findings without silently deleting history.
- Pause release and bot automation before transferring. Transfer the existing repository while private, verify its records, then change visibility to public.
- Preserve old wiki citations and verify representative PR, issue, release, and commit links through GitHub’s redirects. **Do not recreate a repository at the old Verndale address**, because that would remove those redirects.
- Compare permissions and settings after transfer. Account for GitHub’s organization-to-personal differences, including issue assignments and collaborators.

## Local project and package changes

- Move the complete existing checkout—including `.git` and local files—to `/Users/joe.fusco/Projects/ui-design-brain`. Update `origin` and the local project registration to the new location. Verify commit identity and working-tree state afterward.
- Update current package metadata, installation instructions, runtime package-name validation, schemas, and fixtures from `@verndale/ui-design-brain` to `ui-design-brain`.
- Keep the CLI command, skill name, catalog entries, authority version, and manifest digest unchanged. Preserve historical attribution and MIT copyright notices.
- Continue the existing release sequence rather than resetting to `1.0.0`. Update changed schema URLs to the next release tag in the transferred repository.
- Preserve historical wiki references; update current ownership guidance and add a migration journal entry and archived plan. Regenerate catalog and graph artifacts through their builders.
- Document consumer migration using the new dependency and configuration with a fresh projection target. Keep safeguards against overwriting old-package or edited projections.

## Release and verification

- Run `pnpm verify:ci`, the packed-consumer fixture, and package-content inspection. Test fresh projection, repeat-sync idempotence, and rejection of incompatible or edited targets.
- Verify preserved Git references and GitHub records, wiki navigation, old-link redirects, and anonymous access after publication.
- Configure publishing under your npm account. Use a temporary personal credential for the automated first publication of the new package, then configure trusted publishing for `JFusco/ui-design-brain` and remove the bootstrap credential.
- Enable provenance and verify the published package’s owner, repository URL, schema URLs, and exact-version installation. Restore bot automation only with appropriately configured personal credentials.

## Delivery boundaries

Use a labeled issue, issue-keyed branch, and the required maintenance PR format for source changes. Leave the PR open for review; release follows reviewed merge and successful checks.

The npm name currently returns “not found”; publication must confirm availability, and personal npm authentication needs restoration. Deprecating `@verndale/ui-design-brain` remains a separate follow-up. A transfer leaves no separate Verndale GitHub repository to archive.
