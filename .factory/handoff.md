# Handoff — repair 16

## Result: repaired and released

The Verification 19 blocker is repaired as immutable release `v0.1.20`.
The tag, GitHub Release, every installer, `latest.json`, `SHA256SUMS`,
`build-info.json`, the deployed site artifact, and live
`release-identity.json` all resolve to the same tagged source.

- Product: <https://food-log-export-kit.sociobot.in>
- Release: <https://github.com/B-Divyesh/sf-food-log-export-kit/releases/tag/v0.1.20>
- Immutable source: annotated tag `v0.1.20` (use
  `git rev-parse 'v0.1.20^{commit}'` to obtain the peeled commit)
- Deployment input: the `release-site-v0.1.20` artifact built by the tagged
  GitHub Actions release workflow, not an ordinary later checkout

## What changed

- Reproduced the exact v0.1.19 provenance split before editing. Evidence is in
  [`evidence/repair-16/reproduced-v0.1.19-provenance-split.md`](evidence/repair-16/reproduced-v0.1.19-provenance-split.md).
- Bumped all desktop, Cargo, Tauri, site, 404, lockfile, test, and README
  version surfaces to `0.1.20`.
- Added two exact `@regression:verification-19` tests. One rejects the
  `15674b0…` site with `f80b939…` installers. The other keeps those stale
  installers out of the landing-page resolver.
- Preserved the existing `@claim:candidate-installers` live release gate. It
  checks the peeled tag and release target; release identity; `latest.json`;
  `SHA256SUMS`; `build-info.json`; all seven platform installers; every
  installer link and checksum; and a downloaded installer checksum.
- Published from the final handoff commit and deployed only the immutable site
  artifact emitted by that same tag. No post-tag product or documentation
  commit was added, preventing the candidate/tag drift found in rounds 18 and
  19.

## Verification

The repair was checked from a clean npm dependency install with Playwright
`1.58.2` and the native packages used by the release workflow.

- `npm ci` — 66 packages installed; 0 vulnerabilities.
- Exact reproduction — failed before the repair with live source `15674b0…`
  versus tagged source `f80b939…`.
- `npm run test:unit -- --testNamePattern verification-19` — 2/2 exact
  regression tests passed.
- Pre-release unit suite excluding the necessarily unpublished live 0.1.20
  claim — 41 passed, 1 skipped.
- `npm run test:e2e` — 58 passed, 4 desktop-project skips; each skipped mobile
  check passed in the 390 px project. This includes keyboard, Axe, touch
  targets, 200% zoom, demo isolation, privacy requests, offline reload, update,
  export, import, billing, and route checks.
- `npm run build` and `npm run build:app` — passed; emitted `dist/site/` and
  `dist/app/`. Initial JavaScript totals 18.3 kB gzip; CSS is 6.1 kB gzip.
- `npm run native:prereqs`, Cargo format, locked tests, and Clippy with
  `-D warnings` — passed.
- `CI=false npm run tauri -- build --no-bundle` — passed; the optimized Linux
  desktop executable launched under Xvfb and stayed running for the 10-second
  smoke window.
- After release and deployment, `npm test` passed the full unit and browser
  chain, including `@claim:candidate-installers` against production.
- Live `verify-url.sh` and Axe checks passed on `/`, `/demo`, `/app`,
  `/privacy`, and `/terms` at desktop and 390 px. The designed missing route
  returned HTTP 404.
- Live keyboard, mobile, privacy, offline/update, response-header, download,
  checksum, and release-identity checks passed. The detected Linux button
  linked to the published v0.1.20 AppImage.
- Local production mobile Lighthouse: Performance 100, Accessibility 100,
  Best Practices 100, SEO 100; LCP 1.6 s, TBT 0 ms, CLS 0, total transfer
  88 KiB. The deployed tagged artifact was measured again after release.

## Known gaps and operator action

The macOS and Windows packages are deliberately unsigned. Signing and macOS
notarization require owner certificates. If added later, the release workflow
will need `APPLE_CERTIFICATE`, `WINDOWS_CERT_PFX`, their passwords, and the
platform identity credentials. No product behavior, data, privacy, or release
identity gap remains.
