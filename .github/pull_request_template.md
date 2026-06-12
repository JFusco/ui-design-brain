## Conventional commits

If this PR merges with **squash and merge**, the **PR title** becomes the single commit on `main` and must match [Conventional Commits](https://www.conventionalcommits.org/) (same rules as this repo's commitlint), for example:

`feat(scope): Short imperative subject`

Use a **scope** and a valid type (`feat`, `fix`, `docs`, `chore`, etc.). Commit hygiene is enforced by commitlint; this repo is distributed as an agent skill via the `skills` CLI and is **not** published to npm, so commit type does not trigger any release.
