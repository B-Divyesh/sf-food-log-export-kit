# Handoff — repair 4

## Result

**PASS — F6-1 is repaired.**

The published desktop product is now release `v0.1.4`, built from commit
`5b770194cb02e41d70efb114f7e11a1a35f6766c`. It contains the candidate's
current importer and desktop UI behavior, including the JSON preservation of
populated unmapped fields. The previous critical mismatch was that the live
site described a newer app while the public installers were `v0.1.2` from an
older commit.

## What changed

- Bumped the desktop, package, landing, static-404, installer-fixture, and
  visible build versions to `0.1.4`.
- Added a regression suite that requires all shipped version markers to agree
  and requires the release workflow to verify its tag, installer assets,
  checksums, and `latest.json` before succeeding.
- Made release dispatch check out the supplied tag, reject a tag that does not
  match the package/Tauri/Rust versions, and resolve both annotated and
  lightweight tags when confirming the release source commit.
- Declared the Linux `file` tool used by `linuxdeploy`; this fixed the local
  AppImage package build.
- Updated the Windows installer recorded release fixture and the matching
  claim sandbox to the released `0.1.4` metadata.

## Release and deployment evidence

- Release workflow: [run 33263731347](https://github.com/B-Divyesh/sf-food-log-export-kit/actions/runs/33263731347) — **success** for Linux, Windows, Intel macOS, Apple Silicon macOS, and the checksum/manifest job.
- Release: <https://github.com/B-Divyesh/sf-food-log-export-kit/releases/tag/v0.1.4>.
- The release API reports `v0.1.4` target `5b770194cb02e41d70efb114f7e11a1a35f6766c`, with RPM, AppImage, DEB, two DMGs, EXE, MSI, two macOS app archives, `SHA256SUMS`, and valid `latest.json`.
- Consumer check: downloaded `Food.Log.Export.Kit_0.1.4_amd64.deb` passed the published `SHA256SUMS` entry and reports package `food-log-export-kit`, version `0.1.4`, architecture `amd64`.
- Static site deployed with `/opt/fleet/lib/deploy-static.sh food-log-export-kit dist/site` to <https://food-log-export-kit.sociobot.in>. Live JavaScript SHA-256: `3fd2a2ed76faeb536fb178ee631f087efac1e7ae543e83cdc9e59daac23eb357`; live CSS SHA-256: `6271b5be477e1a725982fa91b13d9a04b5eaa7b61dc68e14e754394e5789ac9a`.

## Verification

- Clean install: `npm ci` passed with zero vulnerabilities.
- All 20 exact commands in `.factory/claims.json` returned zero during this repair. The final `npm test` at `0.1.4` passed **18 unit tests and 44 browser tests**; four desktop-project mobile cases are intentionally skipped because their matching mobile project runs them.
- `npm run build`, `npm run build:app`, and `cargo test --manifest-path src-tauri/Cargo.toml` passed.
- `CI=true npm exec tauri -- build --bundles deb,rpm,appimage` built all three Linux packages. A local `0.1.4` DEB reports the expected package/version/architecture. The native executable stayed healthy for eight seconds under Xvfb; only expected headless EGL/DRI3 warnings appeared.
- Playwright axe checks found zero serious/critical issues on `/`, `/demo`, `/app`, `/privacy`, `/terms`, and 404 in desktop and 390×844 mobile coverage. Keyboard loading/export, focus, 44 px targets, 200% scale, no horizontal overflow, sample visibility, and reduced-motion behavior passed.
- `/opt/fleet/lib/verify-url.sh` passed against live `/` and `/?demo=1`: no console/page errors, correct titles/language, one heading, a main landmark, and no missing image alt text. The standalone axe CLI could not launch because its downloaded ChromeDriver supports Chrome 152 while the provisioned Chrome is 145; the repository's Playwright axe integration supplied the equivalent route coverage.
- Production headers retain HSTS, `nosniff`, strict-origin referrer policy, restrictive CSP with `frame-ancestors 'none'`, and camera/microphone/geolocation denial.

## How to run

```sh
npm ci
npm test
npm run build
npm run build:app
cargo test --manifest-path src-tauri/Cargo.toml
CI=true npm exec tauri -- build --bundles deb,rpm,appimage
```

The one-click demo is <https://food-log-export-kit.sociobot.in/demo>. It uses
the isolated `demo:` storage namespace described in `.factory/demo.md`.

## Known gaps and operator action

No product defects remain from verification 6. macOS and Windows installers
are intentionally unsigned, as stated in the release notes. To sign them in a
future release, the operator must provision `APPLE_CERTIFICATE` and
`WINDOWS_CERT_PFX` (plus their matching passwords/identity configuration) and
extend the release workflow; no signing material is stored in this repository.
