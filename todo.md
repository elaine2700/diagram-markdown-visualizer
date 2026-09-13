# TODO

- [ ] **Configure Workflows for Automated Publishing (`publish-core.yml`) and `publish-svelte.yml`**
  - [x] Consolidate/update publish workflows to handle automated npm publishing from GitHub Actions on push to `main`.
  - [x] Add GitHub Release step in the workflow to create GitHub Releases with changelogs and git tags upon publishing.
  - [x] Configure and verify repository secrets (`NPM_TOKEN` and `GITHUB_TOKEN` permissions) for publishing to npm and creating releases.
  - [x] Ensure workflow triggers correctly when the changeset versioning PR (`changeset-release/main`) is merged into `main`.
  - [ ] Test the automated release end-to-end (merge release PR, verify npm publish and GitHub Release creation).
