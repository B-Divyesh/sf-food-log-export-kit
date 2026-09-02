# Handoff — repair 18

## Outcome

Prepared immutable desktop release `v0.1.22` to repair independent verification 21. The release tag is created only after this handoff, source, tests, and version metadata are committed. The tag workflow builds every installer and deploys the site from that same commit.

## Findings repaired

- Release identity: bumped every shipped version surface from `0.1.21` to `0.1.22`. Added a regression requiring the immutable version tag to resolve to the candidate checkout itself. The existing `candidate-installers` claim still compares that tag with GitHub release metadata, `latest.json`, `build-info.json`, `SHA256SUMS`, all installer links, one downloaded installer checksum, and the deployed `release-identity.json`.
- Copy audit: replaced the stale release sentence with the README's two current sentences about `npm run release:site` and deploy-then-claim order. Added `@regression:V21-copy-audit` so both sentences must remain present in the README and audit.
- Release version: synchronized `0.1.22` in npm, Cargo, Tauri, site build metadata, the 404 footer, README release commands, and tests.

The importer, demo, exports, privacy behavior, license behavior, accessibility, design, and existing claim coverage were preserved.

## Verification evidence

Run on Ubuntu 24.04 with Node 22, npm 10, Playwright 1.58.2, and the repository's locked Rust dependencies:

- `npm ci` — passed; 66 packages installed; zero vulnerabilities reported.
- Reproduction before repair: `npm run test:unit -- --testNamePattern @claim:candidate-installers` — failed because the deployed `adb500d…` identity differed from release source `c68cbed…`.
- `npx vitest run --exclude tests/unit/published-release.test.ts` — passed, 43/43 tests. The live publication claim runs after the immutable release exists.
- `CI=1 npm run test:e2e` — passed, 58 tests with four desktop-project mobile-only skips. Those four checks passed in the 390 px mobile project.
- Axe coverage passed on `/`, `/demo`, `/app`, `/privacy`, `/terms`, and the missing route at desktop and 390 px. Keyboard flow, focus restoration, 44 px targets, 200% scale, reduced motion, no horizontal overflow, and route metadata passed.
- Claim coverage passed for CSV and JSON export, local-only processing, all import formats and validation notes, demo isolation, free and paid behavior, license request boundaries, platform selection, and offline reload.
- The controlled service-worker update from v5 to v9 passed.
- `npm run build:site` — passed and produced `dist/site/`.
- `npm run build:app` — passed and produced `dist/app/`.
- Initial JavaScript: 50.09 kB raw / 17.36 kB gzip. CSS: 23.48 kB raw / 6.10 kB gzip.
- `npm audit --audit-level=high` — passed with zero vulnerabilities.
- `npm run native:prereqs` — passed after installing the README-listed GTK/WebKit packages.
- `cargo fmt --check --manifest-path src-tauri/Cargo.toml` — passed.
- `cargo test --locked --manifest-path src-tauri/Cargo.toml` — passed.
- `cargo clippy --locked --manifest-path src-tauri/Cargo.toml --all-targets -- -D warnings` — passed.
- `CI=false npm run tauri -- build --no-bundle` — passed and produced `src-tauri/target/release/food-log-export-kit`.

## Release and verification commands

```sh
npm run release:preflight
git tag -a v0.1.22 -m "Food Log Export Kit v0.1.22"
git push origin main v0.1.22
gh run watch --repo B-Divyesh/sf-food-log-export-kit
npm test
```

The GitHub workflow publishes macOS Intel and Apple Silicon DMGs, Windows MSI and setup EXE files, and Linux AppImage, DEB, and RPM files. It also publishes `SHA256SUMS`, `latest.json`, and `build-info.json`, verifies them, builds the site from the tag, and deploys that exact output.

Do not add a post-tag handoff or evidence commit without starting a new version. That would make the candidate newer than its installers and repeat verification 21.

## Known gaps and operator action

- Desktop packages are unsigned. macOS notarization and Windows Authenticode require owner certificates. The current workflow does not request `APPLE_CERTIFICATE` or `WINDOWS_CERT_PFX`; add signing only when those credentials and a reviewed signing flow are available.
- No product behavior or release-blocking gap remains in the source candidate. Publication and live identity are verified after the tag workflow finishes.
