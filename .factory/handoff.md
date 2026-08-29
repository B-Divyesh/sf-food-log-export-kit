# Handoff — repair 5

## Result

**PASS — repaired and deployed.** The independent verifier's only release
blocker was reproduced, fixed, regression-tested, released, and deployed.
The repaired source is commit
`2c10f3df607fe7c2c8988d3128aeebcdee5f35a8`, tagged `v0.1.5`.

The defect was that `releases/latest` still selected `v0.1.4` from
`5b770194cb02e41d70efb114f7e11a1a35f6766c`, an ancestor but not the verified
candidate. The exact reproduction and its tests are recorded in
[`evidence/repair-5/reproduced-release-identity.md`](evidence/repair-5/reproduced-release-identity.md).

## Repair

- Bumped all shipped version surfaces to `0.1.5`: npm, lockfile, Tauri,
  Cargo, landing, and static 404 footer.
- Added a build identity module. The landing resolver now requires GitHub's
  latest release tag to equal the shipped app version; production builds also
  require `target_commitish` to equal the embedded source commit. A stale
  cached release is refetched rather than kept for an hour.
- Added unit and browser regressions tagged
  `@regression:stale-desktop-release`. The browser regression uses the exact
  stale `v0.1.4` / `5b770…` response and confirms no stale download or release
  link is exposed.
- Hardened `.github/workflows/release.yml`: each matrix job resolves the
  annotated tag commit before its Tauri build; the manifest records
  `release_tag` and `source_commit`; the final job verifies tag source,
  release target, checksums, two macOS DMGs, Windows MSI and EXE, and Linux
  AppImage, DEB, and RPM.

## Published desktop release

GitHub Actions release run:
<https://github.com/B-Divyesh/sf-food-log-export-kit/actions/runs/33273475204>

Published release: <https://github.com/B-Divyesh/sf-food-log-export-kit/releases/tag/v0.1.5>

- All matrix builds and the checksum/manifest job passed.
- Assets include both macOS DMGs, Windows MSI/EXE, Linux AppImage/DEB/RPM,
  macOS app archives, `SHA256SUMS`, and `latest.json`.
- Published `latest.json` says `version: 0.1.5`, `release_tag: v0.1.5`, and
  `source_commit: 2c10f3df607fe7c2c8988d3128aeebcdee5f35a8`.
- A freshly downloaded published DEB has package `food-log-export-kit`,
  version `0.1.5`, architecture `amd64`, and SHA-256
  `4235bf061f1142e89ec18c6bc3246cef8d7f223e47b3e5e037c1e8136a17c6a2`,
  which is present in published `SHA256SUMS`.
- Local native packaging also produced `Food Log Export Kit_0.1.5_amd64.deb`
  (3,433,158 bytes), with matching package metadata. Its local build checksum
  was `8eaa761c83250f7425e4dc9fc87b5a9b4bcb680403bacd5db6262cbcbf93a28a`.
  Reproducible package bytes are not expected across the two Linux builders.

## Deployment and live identity

Production was deployed to the configured Azure Static Web App
`sf-food-log-export-kit` in resource group `sociobot`. The site build used
`VITE_FOOD_LOG_SOURCE_COMMIT=2c10f3df607fe7c2c8988d3128aeebcdee5f35a8`.

- Live `index-BPY9ETW1.js` SHA-256 matches the deployed local build:
  `e228c75c891b48ab0f6610c0002501a3dc2d2b0806ae4f3639363c562e4bd0a7`.
- The live GitHub API response is `v0.1.5` with target commit
  `2c10f3df607fe7c2c8988d3128aeebcdee5f35a8`.
- On the live Linux browser, the resolver selects
  `Food.Log.Export.Kit_0.1.5_amd64.AppImage`, links directly to its `v0.1.5`
  release asset, and links release notes to `/releases/tag/v0.1.5`. There were
  no browser errors.

## Verification

- Fresh `npm ci`: passed, 0 vulnerabilities. `npm audit --audit-level=high`:
  passed, 0 vulnerabilities.
- `npm run test:unit`: 21/21 passed.
- Full Playwright suite: 52 tests passed across desktop and the 390 px mobile
  project, including axe, keyboard/focus, reduced motion, touch targets,
  history focus, offline demo, privacy, claims, and the new regression.
- `npm run build` and `npm run build:app`: passed. Initial JS is 13.70 kB
  gzip; CSS is 6.10 kB gzip.
- `cargo fmt --manifest-path src-tauri/Cargo.toml -- --check`: passed.
  After installing the same GTK/WebKit packages specified by the release
  workflow, `cargo test --locked --manifest-path src-tauri/Cargo.toml` and
  `cargo clippy --locked --manifest-path src-tauri/Cargo.toml -- -D warnings`
  passed.
- `CI=true npm exec tauri build -- --bundles deb`: passed; see package evidence
  above.
- `verify-url.sh` passed live `/`, `/demo`, `/app`, `/privacy`, and `/terms`:
  each has the correct title, `lang=en`, one `h1`, a `main`, complete image
  alt attributes, and zero console/page errors. Evidence is in
  `evidence/repair-5/`.
- Live real import/recovery/export used only same-origin requests, set no
  cookies, exported a two-line CSV containing `Tomato soup`, and had no
  console errors. The service-worker-controlled live demo reloaded offline
  with its named sample record and the `You are offline` state.
- Live headers retain HSTS, `nosniff`, strict-origin referrer policy, the
  restrictive CSP with `frame-ancestors 'none'`, and camera/microphone/
  geolocation denial. HTML revalidates in 30 seconds and hashed assets are
  immutable for a year.
- Fresh live Lighthouse: Performance 100, Accessibility 100, Best Practices
  100, SEO 100; LCP 1.76 s and CLS 0. Full report:
  `evidence/repair-5/lighthouse-live.json`.

## Known gaps / operator action

The desktop installers are intentionally unsigned. Signing and notarization
remain unavailable until the operator provides `APPLE_CERTIFICATE` and
`WINDOWS_CERT_PFX` (and their associated secrets) to the GitHub release
workflow. This does not affect checksum verification or release identity.
