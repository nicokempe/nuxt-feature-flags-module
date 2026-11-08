# Releasing

Open **[Actions → Release](https://github.com/nicokempe/nuxt-feature-flags-module/actions/workflows/release.yml)**,
select **main**, and click **Run workflow**. There are no version or other input fields.
That one action starts the complete release process:

1. Calculate the next Europe/Berlin calendar version, `YYYY.M.RELEASE_NUMBER`.
2. Generate `CHANGELOG.md` from Conventional Commits and update `package.json`.
3. Run release-tooling checks, lint, tests, type checks, and build the npm tarball.
4. Commit the version and changelog to `main`, create an annotated tag with the exact same
   version, and push both atomically.
5. Automatically start the same workflow from that immutable tag. This second run validates
   and packs the tagged source, publishes that exact `.tgz` publicly to npm with OIDC and
   provenance, creates the matching GitHub Release, and attaches the npm tarball.

The first run's summary links to the automatic publishing run. The publishing run's summary
links to npm and the GitHub Release. No second click, manual version bump, local publish command,
npm token, or manually created GitHub Release is needed.

## Versioning and changelog

The first release in a Berlin-local month ends in `.0`; later releases increment the final number.
Package version, changelog heading, tag, npm version, and GitHub Release use the same version,
without a `v` prefix or a zero-padded month. Do not edit the version or generated changelog entries
manually.

Changelogen 0.6.2 is installed from the lockfile and runs locally after dependency installation;
release preparation does not download another CLI or look up commit authors over the network.
Dependency commits with the `deps` scope are
included under `dependencies`, so dependency-only releases have useful changelog entries.

The dependency preparation for `2026.11.0`, including upgrade requirements and remaining upstream
advisories, is recorded in [the preparation notes](.github/release-notes/2026.11.0.md).

## Retrying a failed release

Use **Re-run failed jobs** on the failed run, or run **Release** from `main` again. If the current
version has a release tag but npm publishing, GitHub Release creation, or tarball attachment is
incomplete, the workflow resumes that exact tagged source without allocating a new version.
An already published npm version is skipped while the remaining GitHub steps are repaired.
Once npm and the GitHub Release (including its tarball) are complete, a main-branch run with
subsequent commits allocates a new version. Running again while `main` still points exactly at
the completed release tag keeps that version. Releases are serialized to prevent overlapping
version allocation.

## npm trusted publishing

The existing npm trusted publisher remains `.github/workflows/release.yml` in
`nicokempe/nuxt-feature-flags-module`, with environment `publish-workflow`. Only the publishing job
enters that environment and receives `id-token: write`; no long-lived `NPM_TOKEN` is required.
Keep the publisher's filename and environment configured on npm. Existing environment protection
rules, if any, still apply.

The second run is necessary because npm derives provenance from the workflow's triggering ref
and commit. Publishing directly after a version commit in the first run would attribute the
package to the previous commit. The publishing run therefore requires the workflow SHA, checkout,
release tag, and package version to agree. Provenance cannot be disabled as a recovery shortcut.

The historical `2026.9.0` package and GitHub Release were already published before this zero-input
workflow. Their old tag lacks this workflow and is treated as a completed legacy release. Older
incomplete tags cannot use the new tag-publishing path; reruns of the historical workflow retain
that workflow's original behavior.
