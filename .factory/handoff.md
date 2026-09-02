# Handoff — repair 14

## Result: PASS

Verification 17's release-blocking provenance defect is repaired. The prior
`v0.1.17` installers were built from `15156f04a39104211d95ff0e965712d9c4732333`
while the deployed site identified `03b2bc0cf2a6e680ef3d33539a9cc1ef56ac40a9`.
The exact failing command was reproduced before the repair:

```text
npm run test:unit -- --testNamePattern @claim:candidate-installers
Expected deployed identity source_commit: 15156f04a39104211d95ff0e965712d9c4732333
Received: 03b2bc0cf2a6e680ef3d33539a9cc1ef56ac40a9
```

The accepted immutable release candidate is `v0.1.18` at
`ed7b13e93e4ab5c9bbe2c2d17acfec694099fba0`.

## What changed

- Added `npm run release:site`, which refuses to build a deployable site unless
  `HEAD` is the immutable `v<package-version>` tag target. It validates the
  emitted `release-identity.json` before allowing deployment.
- Added exact regression coverage for verification 17's tag-commit/site-commit
  mismatch and for a mismatched emitted identity.
- Added a GitHub Actions `site` job, after checksums, which checks out the
  immutable tag and uploads the verified `release-site-v<version>` artifact.
- Bumped all package, Tauri, Cargo, landing, 404, and release documentation
  versions together to `0.1.18`.
- Published a fresh cross-platform desktop release and deployed only the
  guarded `dist/site` bundle made from that tag.

## Release and deployment evidence

- Source commit / immutable tag: `ed7b13e93e4ab5c9bbe2c2d17acfec694099fba0` / `v0.1.18`
- GitHub release: <https://github.com/B-Divyesh/sf-food-log-export-kit/releases/tag/v0.1.18>
- GitHub Actions: <https://github.com/B-Divyesh/sf-food-log-export-kit/actions/runs/33580499059>
  — macOS x64, macOS arm64, Windows, Linux, checksums, and immutable site jobs all passed.
- Production deployment: `57f12ad0-e4c7-4ce0-8ef7-7ab224f183fb`
- Live identity: `0.1.18`, `v0.1.18`, `ed7b13e93e4ab5c9bbe2c2d17acfec694099fba0`
- Release target, `latest.json`, first line of `SHA256SUMS`, all seven installer
  links, and the site identity resolve to the same version/tag/source commit.
- Downloaded checksum sample:
  `Food.Log.Export.Kit_0.1.18_x64-setup.exe` →
  `c0c86db573cc6e2d5e127c2ba3cf28cb4d5f00158705ad6546b4c7486c9182fc`
  (matches `SHA256SUMS` and `latest.json`).

## Verification

- `npm ci`: PASS — 66 packages, 0 vulnerabilities.
- `npm test`: PASS — 38 unit tests and 62 Playwright tests; the four desktop
  project skips are the mobile-only checks that pass in the mobile project.
- Every one of the 25 exact `.factory/claims.json` commands: PASS, including
  the repaired `candidate-installers` claim.
- `npm run build`, `npm run build:site`, and `npm run build:app`: PASS.
- `npm run native:prereqs`: PASS after installing the repository's documented
  GLib/WebKit packages.
- `cargo test --manifest-path src-tauri/Cargo.toml`: PASS (0 native tests and
  0 doctests; both crates compile).
- `npm run tauri -- build`: PASS; local Linux AppImage, DEB, and RPM packages
  were produced for `0.1.18`.
- Fresh live desktop and 390 × 844 mobile browser checks: no console errors,
  correct title/lang/one h1/main, no horizontal overflow, and no serious or
  critical Axe findings. The live Linux download resolves to the published
  `v0.1.18` AppImage.
- Lighthouse mobile-style local production run: performance 100,
  accessibility 100, best practices 100, SEO 100; LCP 1.6 s, CLS 0.
- Production headers include CSP, HSTS, nosniff, strict referrer policy, and
  denied camera/microphone/geolocation. The app remains local-first with no
  analytics; live demo conversion has no food-data upload.
- Largest initial JavaScript is 39.70 kB raw / 14.10 kB gzip. CSS is 23.48 kB
  raw / 6.10 kB gzip.

## Run and release

```bash
npm ci
npm test
npm run build
npm run build:app
npm run native:prereqs
cargo test --manifest-path src-tauri/Cargo.toml
npm run release:preflight
git tag -a v0.1.18 -m "Food Log Export Kit v0.1.18"
git push origin main v0.1.18
# after Actions publishes installers and manifests:
npm run release:site
```

Deploy only the resulting `dist/site/`; its guard requires the checkout to be
the version tag's source commit. Then run every listed claims command.

## Known gaps and operator action

Windows and macOS packages are intentionally unsigned. To sign later, set the
operator-owned `APPLE_CERTIFICATE` and `WINDOWS_CERT_PFX` workflow secrets.
This does not affect the published checksums, installer provenance, or the
unsigned-release flow.

The pre-existing `graphify-out/` working-tree changes were preserved and were
not included in the repair commits.
