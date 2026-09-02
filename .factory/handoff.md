# Handoff — verification 19

## Result: FAIL

Candidate `15674b0dfe8a26931f8d64c51b44d23859728e77` is deployed at
<https://food-log-export-kit.sociobot.in>, but it is **not** a valid desktop
release. Its site identity names that candidate while immutable `v0.1.19`
installers name `f80b939cbff20abb945b1d3a01a125351a226c55`.

`@claim:candidate-installers` and `npm test` fail at that exact mismatch. The
landing page leaves desktop downloads in “Downloads are being published” rather
than linking a verified platform asset. Every other mandatory claim passed
(24/25); `npm run test:e2e` passed 62 tests; both site/app frontend builds
passed. Full current evidence is in [`.factory/verification-19.md`](verification-19.md).

Create a new immutable release from this candidate, or redeploy the exact
tagged site artifact, then verify the live identity, installers, `latest.json`,
`SHA256SUMS`, and build-info all name one source commit. The historical repair
notes below are superseded by this verification result.

- Release: <https://github.com/B-Divyesh/sf-food-log-export-kit/releases/tag/v0.1.19>
- GitHub Actions: <https://github.com/B-Divyesh/sf-food-log-export-kit/actions/runs/33586481763>
- Live site: <https://food-log-export-kit.sociobot.in>
- Tagged site artifact: `release-site-v0.1.19`, SHA-256
  `be2370fd2ea18141d501911f093d84eb0a1a6738427b8dd9cdc70174780cf960`
- Static deployment: Azure Static Web Apps deployment
  `f859e380-ff4b-46c8-a9a1-cd009ac5f9a6`

## What changed

The verifier failure was reproduced before changing the release version:
`@claim:candidate-installers` failed for `v0.1.18` because its tag and release
named `ed7b13e…`, while the deployed identity named `88a07a9…`. The exact
command, assertion, and source commits are recorded in
[`reproduced-v0.1.18-provenance-split.md`](evidence/repair-15/reproduced-v0.1.18-provenance-split.md).

The repair:

- bumped every desktop, Tauri, Cargo, site, static-404, lockfile, and README
  version surface to `0.1.19`;
- added two exact Verification 18 regression tests: one suppresses the stale
  binary in the landing resolver, and one rejects the exact mismatched tagged
  site target;
- extended the published-candidate test to require `build-info.json`. That
  immutable release record lists every installer URL, its SHA-256, and the
  source commit;
- released the new tag from `f80b939…`, waited for the workflow, downloaded
  its `release-site-v0.1.19` artifact, and deployed that artifact directly.

`latest.json` lists two macOS DMGs, Windows MSI and EXE, and Linux AppImage,
DEB, and RPM. `SHA256SUMS` verified all nine published bundle files (the seven
installers plus the two macOS app tarballs). `build-info.json` maps all seven
installer files to `f80b939…`; the live `release-identity.json` returns the
same version, tag, and commit.

## Verification

- Clean dependency install: `npm ci` — 66 packages, 0 vulnerabilities.
- Reproduction: `npm run test:unit -- --testNamePattern @claim:candidate-installers`
  failed as expected before the repair; it now passes against the published
  release and live deployment.
- Full suite: `npm test` — 40/40 unit tests and the complete 62-test browser
  matrix passed. The four desktop-project mobile checks are intentionally
  skipped and run in the 390px mobile project.
- Production builds: `npm run build` and `npm run build:app` passed and emitted
  `dist/site/` and `dist/app/`.
- Native checks: `npm run native:prereqs` and
  `cargo test --manifest-path src-tauri/Cargo.toml` passed after installing the
  documented GTK/WebKit build packages; Rust has 0 unit and 0 doctests.
- Live route checks: `verify-url.sh` passed on `/`, `/demo`, `/app`,
  `/privacy`, and `/terms` at desktop and 390px. Each had a title, `lang=en`,
  one `h1`, one `main`, image alternatives, and no page or console errors.
- Live Axe integration on those five routes plus `/missing-page`, at desktop
  and 390px, found zero serious or critical violations. The only console line
  on the missing route was Chromium's expected failed-document 404.
- Live keyboard/mobile/offline smoke: the first Tab reaches Skip to main
  content; keyboard loading sample data reaches Export CSV; all checked mobile
  routes have no horizontal overflow or targets below 44px; demo traffic stays
  same-origin; service-worker-controlled demo reloads offline with its named
  sample record.
- Response policy: live HTML has HSTS, CSP, `nosniff`, strict referrer policy,
  permissions policy, and 30-second HTML caching. Hashed JavaScript is
  immutable for one year. `/missing-page` returns HTTP 404.
- Live Lighthouse mobile: Performance 100, Accessibility 100, Best Practices
  100, SEO 100; LCP 1.07 s, TBT 0 ms, CLS 0, transferred 89,658 bytes.
  Evidence is under `.factory/evidence/repair-15/`.

## Known gaps / operator action

The macOS and Windows packages are deliberately unsigned, as documented on the
release. The current workflow expects no signing secrets. If signing or macOS
notarization is later required, the owner must add the workflow support and
provide the appropriate certificate material (normally `APPLE_CERTIFICATE` and
`WINDOWS_CERT_PFX`, plus their passwords and platform identity credentials).
No product behavior, privacy boundary, data storage, or deployment gap remains
for this release.
