# Handoff — verification 17

## Result: FAIL

Candidate `03b2bc0cf2a6e680ef3d33539a9cc1ef56ac40a9` at
<https://food-log-export-kit.sociobot.in> is **not releasable**. Its required
`candidate-installers` claim fails: the live site reports this candidate, but
the immutable `v0.1.17` installer release and checksum manifest report
`15156f04a39104211d95ff0e965712d9c4732333`. The desktop installers therefore
do not have candidate provenance. See `.factory/verification-17.md` for exact
commands and evidence.

**Next step:** publish a new immutable release built from `03b2bc0…` (or deploy
the tagged commit) and align the live identity, installer artifacts,
`SHA256SUMS`, `latest.json`, release target, and site links. Re-run all claims,
especially `candidate-installers`, before accepting.

---

# Builder handoff — polish round 7 (superseded by verification 17)

## Result: PASS

Every finding in `.factory/review-1.md` through `.factory/review-7.md` is resolved and mapped in `.factory/polish-7.md`. The released candidate is `v0.1.17` at commit `15156f04a39104211d95ff0e965712d9c4732333`.

The release and deployed site now share one immutable identity. The annotated tag, GitHub release target, `latest.json`, checksum header, installer URLs, downloaded installer, and live `/release-identity.json` all resolve to that candidate.

## What changed

- Changed release verification to derive source identity from the immutable version tag instead of mutable repository `HEAD`.
- Added a regression test that requires each of the 25 claims to have one focused command and exactly one tagged test.
- Changed browser claim commands to run their named Playwright test directly, so an unrelated unit phase cannot stop claim execution.
- Published fresh macOS, Windows, and Linux desktop installers as `v0.1.17`.
- Deployed the static site built from the exact `v0.1.17` checkout.
- Updated all application, Tauri, footer, 404, README, copy-audit, claim, and release version references together.
- Updated the catalog line to: “Convert food tracker exports into CSV and JSON archives with conversion notes.”
- Rechecked the first screen, demo isolation, reset and exit, exports, privacy boundary, offline reload, routing, focus, 404, legal pages, mobile layout, touch targets, 200% zoom, reduced motion, and product-specific visual treatment on production.

## Release and deployment evidence

- GitHub release: <https://github.com/B-Divyesh/sf-food-log-export-kit/releases/tag/v0.1.17>
- GitHub Actions run: <https://github.com/B-Divyesh/sf-food-log-export-kit/actions/runs/33575608828> — all five jobs passed.
- Production: <https://food-log-export-kit.sociobot.in>
- Deployment ID: `41b56e51-d93d-4c7e-abbf-b0062ce88d0a`
- Live identity: `0.1.17`, `v0.1.17`, `15156f04a39104211d95ff0e965712d9c4732333`
- Independently downloaded asset: `Food.Log.Export.Kit_0.1.17_x64-setup.exe`
- Verified SHA-256: `1e4a84759c04ef01887bb25716f91510e1722ec60d8a041c3d3f6aaa0ea9ac15`
- Detailed release record: `.factory/evidence/polish-7/release-verification.md`

Published installers include two DMGs, MSI and EXE Windows builds, AppImage, DEB, and RPM Linux builds. `SHA256SUMS` and `latest.json` are attached to the same release.

## Verification

Fresh clone at the candidate commit:

- `npm ci`: PASS, zero vulnerabilities.
- `npm test`: PASS, 36 unit tests and 58 browser tests. Four desktop-project skips are mobile-only checks that pass in the mobile project.
- All 25 exact `.factory/claims.json` commands: PASS independently.
- `npm run build:site`: PASS.
- `npm run build:app`: PASS.
- `npm run native:prereqs`: PASS.
- `cargo test --manifest-path src-tauri/Cargo.toml`: PASS; all Tauri targets compiled.
- Initial JS: 39.70 kB largest raw chunk / 14.10 kB gzip. CSS: 23.48 kB raw / 6.10 kB gzip.
- Full command record: `.factory/evidence/polish-7/clean-clone-verification.md`.

Cold production verification:

- Worker verifier passed `/`, `/?demo=1`, `/app`, `/privacy`, and `/terms` with no console errors.
- Axe found no serious or critical findings on those routes or the real HTTP 404.
- Every checked route has `lang="en"`, one `h1`, one `main`, route metadata, labeled controls, and image alternatives.
- Demo entry is one click. Its in-memory data writes no browser storage, makes only same-origin requests, resets to 12 records, and is discarded on exit.
- The named oatmeal record fits above the 390 × 844 fold. All visible controls meet 44 px touch targets. The demo has no overflow at 200% zoom.
- CSV and JSON downloads work. The CSV has one header plus 12 sample rows. The demo reloads offline.
- The unknown route returns HTTP 404 and a designed page with navigation and legal links.
- The detected Linux button links to the real `v0.1.17` AppImage and returns HTTP 200.
- Lighthouse mobile scores: performance 100, accessibility 100, best practices 100, SEO 100. LCP 1.2 s; CLS 0; transfer 87 KiB.
- Screenshots and raw reports: `.factory/evidence/polish-7/`.

## Run and verify

```bash
npm ci
npm test
npm run build:site
npm run build:app
npm run native:prereqs
cargo test --manifest-path src-tauri/Cargo.toml
```

Run every claim exactly as a verifier does:

```bash
node --input-type=module -e '
import { readFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
for (const claim of JSON.parse(readFileSync(".factory/claims.json", "utf8"))) {
  const result = spawnSync(claim.test, { shell: true, stdio: "inherit" });
  if (result.status !== 0) process.exit(result.status ?? 1);
}
'
```

## Known gaps and operator action

The Windows and macOS packages are intentionally unsigned because signing credentials are not available to this work order. To sign later, configure the release workflow with the operator-owned `APPLE_CERTIFICATE` and `WINDOWS_CERT_PFX` secrets. This does not affect checksums, provenance, or the published unsigned installers.

No product or review gaps remain within the work-order scope.
