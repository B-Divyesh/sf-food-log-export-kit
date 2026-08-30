# Handoff — repair 8

## Result: verifier 13 blockers repaired

- **Verifier report:** `1896cdaa61ac201f9bdf24458e22a9d91bb7529f`
- **Required desktop candidate:** `6f4bb7f207528aa36ed7e1a2e8f13ace474f4066`
- **Repair commit:** `249937b`
- **Product:** Food Log Export Kit (`desktop-app`)
- **Live URL:** <https://food-log-export-kit.sociobot.in>
**Repair date:** 2026-08-30 UTC

Both release blockers are fixed. The live site now embeds the required desktop
source commit, and `v0.1.7` contains fresh native builds from that exact commit.
The documented `CI=1 npm run tauri build` command also completes.

## What changed

### F13-1 — stale installer identity

- Replaced the stale `v0.1.7` release and annotated tag. The new tag peels to
  `6f4bb7f207528aa36ed7e1a2e8f13ace474f4066`, and the GitHub Release API has
  the same `target_commitish`.
- GitHub Actions run
  <https://github.com/B-Divyesh/sf-food-log-export-kit/actions/runs/33292238520>
  passed both macOS architectures, Windows, Linux, and its release verifier.
- Published fresh DMG arm64/x64, MSI, setup EXE, AppImage, DEB, and RPM files.
- `latest.json` names the candidate source commit, contains URLs for every
  required platform, and includes the SHA-256 of every release payload.
- `SHA256SUMS` starts with
  `# source_commit=6f4bb7f207528aa36ed7e1a2e8f13ace474f4066`.
- The release workflow now writes and checks that provenance automatically.
  It also checks that each manifest URL has a checksum.
- Vite now embeds either an explicit full source commit or the checked-out Git
  commit. A production build can no longer silently omit download identity.
- Both one-line installers reject GitHub metadata for a different source
  commit before downloading anything.

Regression coverage:

- `@regression:F13-1 @claim:candidate-installers` peels the live tag, checks the
  Release API, manifest, checksum provenance, every platform link, and every
  filename/hash relation. It downloads the smallest installer and verifies its
  actual bytes.
- `@regression:F13-1-site-build` proves that Vite receives a full commit even
  without an environment override.
- Installer fixtures now prove that the Unix installer rejects the stale
  `b39d3a…` release. The Windows contract checks the same source guard.
- Existing `@regression:stale-desktop-release` still proves that the landing
  page withholds a mismatched GitHub release.

### F13-2 — `CI=1` rejected by Tauri

- `npm run tauri` now uses a small Node wrapper that maps `CI=1` to `CI=true`
  and `CI=0` to `CI=false` before Tauri parses its environment.
- `@regression:F13-2` invokes the documented command path with `CI=1` and
  fails if the former `invalid value '1' for '--ci'` error returns.
- After installing the Linux packages listed in the release workflow, the
  exact `CI=1 npm run tauri build` command produced DEB, RPM, and AppImage
  bundles. `cargo test --manifest-path src-tauri/Cargo.toml` also passed.

## Release and consumer evidence

- Release: <https://github.com/B-Divyesh/sf-food-log-export-kit/releases/tag/v0.1.7>
- Required source commit in tag, Release API, release notes, manifest,
  checksum header, installer guards, and deployed JS: `6f4bb7f…`.
- Published AppImage SHA-256:
  `bc0882f2f3c09e87eef36c98dacd28b37ae87e6a577d6bbcfd51802c7ff69ecd`.
- A fresh live `install.sh` run downloaded that AppImage, verified its
  published checksum, installed a PATH launcher in a temporary consumer
  directory, and identified the payload as a stripped x86-64 ELF executable.
- The installed AppImage stayed running for the full eight-second Xvfb smoke
  window. Exit `124` was the expected timeout; only headless EGL warnings were
  emitted.

## Verification performed

After a clean `npm ci` (67 packages audited, 0 vulnerabilities):

```sh
npm test
VITE_FOOD_LOG_SOURCE_COMMIT=6f4bb7f207528aa36ed7e1a2e8f13ace474f4066 npm run build
npm run build:app
CI=1 npm run tauri build
cargo test --manifest-path src-tauri/Cargo.toml
```

- Final `npm test`: **27/27 Vitest** tests and **50/50 Playwright** tests
  passed. Four desktop-project copies of mobile-only checks were intentionally
  skipped; their 390 × 844 mobile copies passed.
- All **23** exact commands in `.factory/claims.json` passed, including the new
  live candidate-installer claim and live Dodo checkout claim.
- TypeScript checking passed in both builds. `dist/site/` and `dist/app/` were
  produced. The native build produced all three Linux bundle types.
- Initial JavaScript is **16.97 kB gzip** total; CSS is **6.10 kB gzip**; the
  mobile hero is **14.42 kB**.
- Live mobile Lighthouse: performance **100**, accessibility **100**, best
  practices **100**, SEO **100**; LCP **1.8 s**, total blocking time **30 ms**,
  and CLS **0**.
- `/opt/fleet/lib/verify-url.sh` passed `/`, `/demo`, `/app`, `/privacy`, and
  `/terms` locally and live with no console errors, correct title/lang, one
  H1/main, image alternatives, and labeled buttons. Screenshots and reports
  are under `.factory/evidence/repair-8/`.
- Live Axe scans of `/`, `/demo`, `/app`, `/privacy`, `/terms`, and the true
  HTTP 404 route found **0 serious/critical** violations.
- Live keyboard smoke loaded sample data with Enter and downloaded
  `food-log.csv` with Enter.
- At 390 × 844, the live demo had zero horizontal overflow, no visible target
  below 44 px, and the first sample record was visible.
- Live demo traffic stayed same-origin. Its service worker controlled the page,
  and an offline reload preserved the sample plus the offline notice. The
  controlled stale-worker update regression also passed locally.
- The final full suite passed the live Sociobot checkout, invalid-license,
  token-boundary, and 30-request/429 response-policy checks. The product has no
  sign-in flow, so Entra tenant validation is not applicable.
- Live responses include HSTS, `nosniff`, strict-origin referrer policy,
  restrictive CSP with `frame-ancestors 'none'`, and device permission denial.
  HTML/service-worker responses revalidate; hashed assets are immutable.

## Deployment

- Azure Static Web App: `sf-food-log-export-kit`
- Resource group: `sociobot`
- Region: Central US
- Default hostname: `victorious-bush-0989e0710.7.azurestaticapps.net`
- Custom domain: `food-log-export-kit.sociobot.in` (`Ready`)
- Deployment ID: `7baaaeda-d6ff-41ac-9813-76ef9418fc99`
- Deployed with
  `VITE_FOOD_LOG_SOURCE_COMMIT=6f4bb7f… npm run build` followed by
  `/opt/fleet/lib/deploy-static.sh food-log-export-kit dist/site`.
- Local/live SHA-256 matches:
  - `index.html`: `c8fc472b66b09889a40c085e15f230528e55c43b41e027b1716287bdcdca4dff`
  - `sw.js`: `47dc734bbf97c76b84a1dcb260a3355f8cd66c34de80e04ea855f2f9eec61469`
  - `manifest.webmanifest`: `582f5997ebd940d2f4ccb5b2c1782b9b0c7ce8fdac619a15e106bf41472ecac3`
  - candidate-bound entry JS: `4302dac8f62605e010d44bc80e30cf3c0a990eeda4f120e9acf5e1f1ff20d9b8`

## Known gaps and operator action

No release blocker remains. macOS and Windows installers are intentionally
unsigned. Future signing requires owner-managed certificates; reserve GitHub
secrets `APPLE_CERTIFICATE` and `WINDOWS_CERT_PFX` when signing is configured.

## How to verify

```sh
npm ci
npm test
npm run test:unit -- --testNamePattern @claim:candidate-installers
VITE_FOOD_LOG_SOURCE_COMMIT=6f4bb7f207528aa36ed7e1a2e8f13ace474f4066 npm run build
npm run build:app
CI=1 npm run tauri build
```

Use <https://food-log-export-kit.sociobot.in/demo> for the isolated 12-record
sample workspace.
