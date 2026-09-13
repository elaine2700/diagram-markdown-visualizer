# Release & Versioning Workflow

This project uses [`@changesets/cli`](https://github.com/changesets/changesets) to manage Semantic Versioning (SemVer), generate changelogs, and automate package releases across all workspace packages (`@markdown-to-diagram/core` and `@markdown-to-diagram/svelte`).

---

## 1. Semantic Versioning (SemVer) Guide

When making changes, choose the bump level according to SemVer:

| Bump Level | When to Use | Example |
| :--- | :--- | :--- |
| **`patch`** | Backwards-compatible bug fixes or minor internal improvements. | `1.0.0` → `1.0.1` |
| **`minor`** | New features or functionality that are backwards-compatible. | `1.0.0` → `1.1.0` |
| **`major`** | Breaking changes or incompatible API modifications. | `1.0.0` → `2.0.0` |

---

## 2. How to Create a Changeset (Standard Workflow)

Whenever you make changes inside `packages/core` or `packages/svelte`, add a changeset before opening or merging a PR:

### Step 1: Run the Changeset CLI
In the repository root, run:
```bash
npx changeset
```

### Step 2: Answer the Prompts
1. **Select packages**: Use the arrow keys and <kbd>Space</kbd> to select which packages are affected (`@markdown-to-diagram/core`, `@markdown-to-diagram/svelte`, or both). Press <kbd>Enter</kbd> to confirm.
2. **Choose bump type**: Specify whether the packages should have a `major`, `minor`, or `patch` release.
3. **Summary message**: Enter a clear description of what changed. This description will be automatically written to each package's `CHANGELOG.md`.

### Step 3: Commit and Push
The CLI creates a new markdown file in the `.changeset/` directory (e.g., `.changeset/warm-foxes-jump.md`).
```bash
git add .changeset/
git commit -m "chore: add changeset"
git push
```

---

## 3. How Publishing Works (Automated CI/CD)

The repository uses independent GitHub Actions workflows for each package:
- **CI Workflows**:
  - [`.github/workflows/ci-core.yml`](.github/workflows/ci-core.yml) (runs on PRs touching `packages/core/**`)
  - [`.github/workflows/ci-svelte.yml`](.github/workflows/ci-svelte.yml) (runs on PRs touching `packages/svelte/**`)
- **Publish Workflows**:
  - [`.github/workflows/publish-core.yml`](.github/workflows/publish-core.yml) (triggers **only** on push to `main` with changes in `packages/core/**`)
  - [`.github/workflows/publish-svelte.yml`](.github/workflows/publish-svelte.yml) (triggers **only** on push to `main` with changes in `packages/svelte/**`)

1. **Open & Merge Feature PR**:
   - Push your branch with the changeset file.
   - The respective CI workflow (`ci-core.yml` or `ci-svelte.yml`) verifies that a valid changeset exists and the package builds successfully.
   - Merge your PR into `main`.

2. **Automated "Version Packages" PR**:
   - On push to `main`, only the workflow corresponding to the package with changes will trigger.
   - The Changesets action consumes pending changesets, bumps versions in `package.json`, updates `CHANGELOG.md`, and opens a **"Version Packages"** PR (or updates an existing one).

3. **Release to npm & Create GitHub Release**:
   - Review and merge the **"Version Packages"** PR into `main`.
   - The respective workflow runs `npm run release` (`changeset publish`).
   - The package is published to the npm registry with provenance.
   - The workflow pushes the git tag (e.g. `@markdown-to-diagram/svelte@1.0.1`) and automatically creates a **GitHub Release** populated with the release notes from `CHANGELOG.md`.
   - Workflows also support manual execution via `workflow_dispatch` in the Actions tab if a re-publish or retry is ever needed.

---

## 4. Repository Secrets & Permissions

For automated publishing and GitHub release creation to work, configure the following in the GitHub repository:

1. **`NPM_TOKEN` Secret**:
   - Navigate to **Settings > Secrets and variables > Actions > Repository secrets**.
   - Add secret `NPM_TOKEN` with an npm access token:
     - **Classic Token (Automation)**: Recommended because it bypasses two-factor authentication prompts for CI/CD publication.
     - OR **Granular Access Token**: Set with "Read and write" permissions for `@markdown-to-diagram` packages and scopes.

2. **Workflow Permissions**:
   - Navigate to **Settings > Actions > General > Workflow permissions**.
   - Select **"Read and write permissions"** (allows the workflow to commit version bumps, push tags, and create GitHub Releases).
   - Check **"Allow GitHub Actions to create and approve pull requests"** (allows Changesets to create and update the `changeset-release/main` pull request).

---

## 5. Manual / Local Versioning & Publishing (Optional)

If you need to bump versions and publish manually without using GitHub Actions:

```bash
# 1. Consume changesets and bump package versions + update CHANGELOG.md
npx changeset version

# 2. Re-build all packages with updated metadata
npm run build

# 3. Publish unpublished versions to npm
npm run release
```

---

## 6. Helpful Commands

- **Check pending changesets**:
  ```bash
  npx changeset status
  ```
- **Check changeset status against main (same check as CI)**:
  ```bash
  npx changeset status --since=origin/main
  ```
- **Add an empty changeset** (if a PR modifies packages but does not require a version bump):
  ```bash
  npx changeset --empty
  ```