# Releasing

Open the repository's **Actions** tab, select **Release package**, choose `main`, leave the two
internal fields empty, and click **Run workflow**. The workflow:

1. Calculates the next Europe/Berlin calendar version as `YYYY.M.RELEASE_NUMBER`.
2. Generates `CHANGELOG.md` from Conventional Commits with Changelogen.
3. Updates `package.json`, then runs linting, tests, type tests, and the package build.
4. Commits the version and changelog to `main` and creates an annotated tag with the exact same
   version, without a `v` prefix or a zero-padded month.
5. Queues a second run of the same workflow from the immutable release tag.
6. Publishes `nuxt-feature-flags-module` publicly to npm through OIDC trusted publishing. Normal
   releases receive npm's automatic provenance attestation for their exact tagged commit.
7. Creates the matching GitHub Release using that changelog section as its release notes.

The first release in a Berlin-local month ends in `.0`; later releases increment the final number.
Do not edit the package version or automated changelog entries manually. Failed runs are safe to
rerun: an unpublished version with an existing release tag is rebuilt from that exact tagged
commit, while an npm version that already exists is skipped safely. The two workflow runs share a
concurrency lock, so publishing starts only after release preparation has finished.

The npm package trusts the GitHub repository's `.github/workflows/release.yml` workflow and the
`publish-workflow` environment. Only the publish job enters that environment and requests a
short-lived credential through GitHub Actions OIDC, so no `NPM_TOKEN` or other long-lived npm
publish credential is required. The workflow pins an npm CLI version that supports trusted
publishing, disables dependency caching for release builds, and grants `id-token: write` only to
the publish job.

The existing `2026.9.0` tag predates this workflow. Its one-time recovery still authenticates with
OIDC, but deliberately disables provenance because the historical tag does not contain the trusted
publishing workflow. Every release created by this workflow publishes from its tag with automatic
provenance enabled.

After the first successful trusted publish, npm's **Publishing access** should be set to **Require
two-factor authentication and disallow tokens**, and any obsolete npm automation token should be
revoked.
