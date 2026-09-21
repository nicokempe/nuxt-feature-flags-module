# Releasing

Open the repository's **Actions** tab, select **Release package**, choose `main`, and click **Run
workflow**. The workflow:

1. Calculates the next Europe/Berlin calendar version as `YYYY.M.RELEASE_NUMBER`.
2. Generates `CHANGELOG.md` from Conventional Commits with Changelogen.
3. Updates `package.json`, then runs linting, tests, type tests, and the package build.
4. Commits the version and changelog to `main` and creates an annotated tag with the exact same
   version, without a `v` prefix or a zero-padded month.
5. Publishes `nuxt-feature-flags-module` publicly to npm.
6. Creates the matching GitHub Release using that changelog section as its release notes.

The first release in a Berlin-local month ends in `.0`; later releases increment the final number.
Do not edit the package version or automated changelog entries manually. Failed runs are safe to
rerun: an existing release tag or npm version resumes the same release.

The repository must have an Actions secret named `NPM_TOKEN` with publish access to the npm
package. This is a one-time repository setup, not an input required for each release.
