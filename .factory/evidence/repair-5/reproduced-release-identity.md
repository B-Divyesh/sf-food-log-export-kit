# Release identity regression reproduction

Reproduced before the repair on 2026-08-29 from the production GitHub release
API, while the deployed web candidate was
`269774a77c077cd956afc51012cae8e17a59a5f4`:

- `releases/latest` resolved to `v0.1.4`.
- The annotated `v0.1.4` tag resolved to
  `5b770194cb02e41d70efb114f7e11a1a35f6766c`.
- That commit was an ancestor of the candidate, but was not equal to it.
- The resolver therefore linked users to a checksum-valid, but stale, desktop
  package.

Regression coverage was added before the implementation in
`tests/unit/release.test.ts` and `tests/e2e/accessibility.spec.ts` under
`@regression:stale-desktop-release`. It supplies that exact old tag/commit and
requires the site to keep the download action in its publishing state rather
than expose the stale installer URL.

The repaired `v0.1.5` release now resolves to
`2c10f3df607fe7c2c8988d3128aeebcdee5f35a8`. Its published `latest.json`
records the same source commit, and the live resolver selects its Linux
AppImage.
