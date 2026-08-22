## Conventional commits

If this PR merges with **squash and merge**, the **PR title** becomes the single commit on `main` and must match [Conventional Commits](https://www.conventionalcommits.org/) (same rules as this repo's commitlint), for example:

`feat(scope): Short imperative subject`

Use a **lowercase scope** and a valid type (`feat`, `fix`, `docs`, `chore`, etc.). Commit hygiene is enforced by commitlint. The repo is not published to npm, but commit type still drives semantic versioning, tags, the changelog, and GitHub release artifacts.
