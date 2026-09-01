# Handoff — repair 13

## Result

Food Log Export Kit remains a Tauri 2 desktop app with a static landing site.
Repair 13 publishes `v0.1.12` only from the clean final `main` commit, then
deploys `dist/site/` built from that same commit to the allowed
`sf-food-log-export-kit` static resource.

## Reproduced failure and cause

The failed candidate was `269ff71a28d5ee9dd08bc91499a138a7aa5da2f5`. On
2026-09-01, the GitHub Releases API returned `v0.1.11` with
`target_commitish` `21758acb519c129ff8d4eba66167940b3ad93562`; the annotated
`v0.1.11` tag peeled to the same older commit. That release had two DMGs,
MSI, setup EXE, AppImage, DEB, RPM, `SHA256SUMS`, and `latest.json`, but none
was built from the candidate. The exact reproduction is recorded in
`.factory/evidence/repair-13/reproduced-stale-release.md`.

The prior release was tagged before all candidate bookkeeping commits were
final. The release resolver correctly withheld those stale installers, but the
desktop candidate had no current download. In addition, a supplied
`VITE_FOOD_LOG_SOURCE_COMMIT` could describe a different checkout.

## Repair

- Version `0.1.12` is synchronized across npm, Cargo, Tauri, site identity,
  static 404, installer fixtures, and version coverage.
- Site builds now reject a supplied source identity unless it exactly matches
  `git rev-parse HEAD`; this prevents a stale site build from claiming another
  desktop candidate.
- `npm run release:preflight` refuses dirty worktrees, non-`main` checkouts,
  an `origin/main` different from `HEAD`, an existing local or remote version
  tag, and divergent npm/Tauri/Cargo/site versions. The workflow independently
  keeps its existing tagged-default-branch guard.
- `@regression:R13-release-preflight` covers dirty, stale, and already-tagged
  candidates. `@regression:F13-1-site-build` covers a valid-looking but stale
  source-commit override.

No food-data behavior, storage, privacy boundary, pricing, artwork, or
telemetry changed.

## Verification before release

All commands below ran after `npm ci` (66 packages; 0 reported
vulnerabilities), except the intentionally pre-publication live release
identity gate:

```sh
npx vitest run --exclude tests/unit/published-release.test.ts
# 34 passed

npx playwright test
# 58 passed; 4 expected desktop-project skips

npm run build:site
npm run build:app
cargo test --manifest-path src-tauri/Cargo.toml
CI=1 npm run tauri -- build
```

The exact native build produced:

- `Food Log Export Kit_0.1.12_amd64.deb`
- `Food Log Export Kit-0.1.12-1.x86_64.rpm`
- `Food Log Export Kit_0.1.12_amd64.AppImage`

The browser matrix covers desktop and 390 px mobile, keyboard export,
screen-reader filter state, Axe serious/critical findings, 200% zoom, touch
targets, reduced motion, demo isolation, CSV/JSON export, local-only requests,
offline reload, and controlled service-worker update. The site build contains
50,093 bytes of uncompressed JavaScript across four chunks (17.36 kB gzip),
23,482 bytes CSS (6.10 kB gzip), and a 14,420-byte mobile hero image.

Before publication, `npm run test:unit` deliberately failed only
`@claim:candidate-installers`: live latest was `v0.1.11` instead of the new
candidate. The focused stale override command also failed as designed:

```sh
VITE_FOOD_LOG_SOURCE_COMMIT=21758acb519c129ff8d4eba66167940b3ad93562 npm run build:site
# Error: VITE_FOOD_LOG_SOURCE_COMMIT must match the checked-out Git commit.
```

## Release, deploy, and final identity gate

All source, test, handoff, and evidence changes are committed and pushed
before tagging. From the clean final `main` tip, the exact release sequence is:

```sh
npm run release:preflight
git tag -a v0.1.12 -m "Food Log Export Kit v0.1.12"
git push origin main v0.1.12
# wait for GitHub Actions Desktop release to finish
npm test
npm run build:site
/opt/fleet/lib/deploy-static.sh food-log-export-kit dist/site
```

The post-publication `@claim:candidate-installers` test resolves the release,
peels its tag, checks `latest.json` and `SHA256SUMS`, resolves every installer
URL, and downloads the smallest installer for a SHA-256 comparison. The final
site `release-identity.json`, release manifest, checksum provenance line,
peeled tag, deployed site, and local final `HEAD` must be identical. Run
`/opt/fleet/lib/verify-url.sh` for `/`, `/demo`, `/app`, `/privacy`, and
`/terms`, then Axe against the live landing and app routes.

## Known gap and operator action

macOS and Windows installers are unsigned. Signing requires the owner-managed
`APPLE_CERTIFICATE` and `WINDOWS_CERT_PFX` GitHub Actions secrets. The product
does not store food data on a server and has no account or analytics service.
