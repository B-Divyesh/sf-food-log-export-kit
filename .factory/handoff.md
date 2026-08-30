# Handoff — repair 9

## Result: verification 14 blockers repaired

- **Verifier report:** `69689f3de189ed47a4c7a957f502c2f16599cce4`
- **Rejected candidate:** `d449a5c411d2ad0d139de19d4575d419ec09065c`
- **Release:** <https://github.com/B-Divyesh/sf-food-log-export-kit/releases/tag/v0.1.8>
- **Live site:** <https://food-log-export-kit.sociobot.in>
- **Artifact class:** Tauri 2 desktop app with a static landing site
- **Repair date:** 2026-08-30 UTC

The exact release mismatch was reproduced before changes. Candidate
`d449a5c…` was deployed while the `v0.1.7` release, tag, manifest, checksums,
tests, and installers all named `6f4bb7f…`. The captured output is in
`.factory/evidence/repair-9/reproduced-release-identity.md`.

## What changed

### Candidate-bound desktop release

- Bumped every shipped version surface to `0.1.8` and cache generation to v8.
- Vite now emits `release-identity.json` from the checked-out full Git commit
  and package version on every site build.
- The landing page still requires both the current tag and exact source commit
  before exposing a detected-platform installer.
- Unix and Windows installers now load the deployed release identity. They
  reject a different GitHub tag, source commit, or checksum provenance header.
- Removed the old commit constant from Playwright, installer fixtures, public
  installers, and `.factory/claims.json`.
- `@claim:candidate-installers` derives version and source from the checkout.
  It peels the live tag, verifies the Release API, manifest, every installer
  URL/checksum, and a downloaded installer.
- The release workflow builds Intel and Apple Silicon macOS, Windows, and
  Linux packages from the tag. It publishes `latest.json` and `SHA256SUMS`
  with the same source commit, then verifies every payload.

### Deterministic demo filters and selected state

- Filtering now updates the existing buttons, rows, and count in place. It no
  longer replaces the focused control during its click event.
- Each single-choice filter exposes `aria-pressed=true|false`; the shown count
  is a polite live region.
- `@regression:V14-demo-filter` proves the original Recipes interaction,
  retains the same connected control, alternates filters 12 times, resets the
  demo, exits it, and confirms real storage was untouched.
- The regression passed 20/20 repeated runs with two workers.
- `@regression:V14-filter-state` operates Recipes with Space and checks focus,
  selected state, deselection of All entries, and the zero-result count.

### Purchase terms

- The landing page, `/terms`, and README now name Sociobot/Dodo as merchant of
  record and state that it handles refunds.
- The copy states that a refund revokes the batch-import license.
- The paid-purchase claim checks this copy and the live Sociobot-to-Dodo
  checkout redirect. `@regression:V14-payment-copy` protects the static copy.
- `.factory/copy-audit.md` includes the new sentences and their word counts.

## Verification evidence

Clean install:

```text
npm ci
added 66 packages; audited 67 packages; 0 vulnerabilities
```

Pre-release automated gates:

```text
npx vitest run --exclude tests/unit/published-release.test.ts
28/28 passed (only the intentionally release-dependent claim excluded)

npx playwright test
50/50 executed tests passed; 4 desktop copies of mobile-only tests skipped

npm run test:e2e -- --project=chromium --grep V14-filter-state
1/1 passed

npm run test:e2e -- --project=chromium --grep V14-demo-filter --repeat-each=20 --workers=2
20/20 passed
```

The final `npm test` is run again after `v0.1.8` is published so the live
candidate-installer claim is included. The published workflow independently
downloads every release asset and runs `sha256sum -c SHA256SUMS`.

Build and package gates:

```text
npm run build
npm run build:app
cargo test --manifest-path src-tauri/Cargo.toml
CI=1 npm run tauri -- build
```

- Both TypeScript/Vite builds passed and emitted `release-identity.json`.
- Site and app output exist at `dist/site/` and `dist/app/`.
- Rust tests and doc tests passed; this small shell currently has zero Rust
  unit cases.
- The native build produced the `0.1.8` AppImage, DEB, and RPM.
- Initial JavaScript totals 49.84 kB raw and 17.20 kB gzip. CSS is 23.48 kB
  raw and 6.10 kB gzip. The 720px hero is 14,420 bytes.

Browser and accessibility:

- The full Playwright matrix covers Chromium desktop and 390 × 844 mobile.
- Axe found zero serious or critical issues on `/`, `/demo`, `/app`,
  `/privacy`, `/terms`, and the missing-page route in both projects.
- Keyboard, focus movement, 44px touch targets, 200% page scale, reduced
  motion, no horizontal overflow, and first-viewport sample content passed.
- `/opt/fleet/lib/verify-url.sh` passed `/`, `/demo`, `/app`, `/privacy`, and
  `/terms` locally. Each had no console errors, one H1/main, correct title and
  language, image alternatives, and labeled buttons.
- Local desktop/mobile screenshots and reports are under
  `.factory/evidence/repair-9/local-*`.

Privacy, offline, and response policy:

- Demo import/export stayed same-origin; it wrote no cookies or local storage.
- Leaving demo mode opened an empty real workspace and preserved the real
  storage probe.
- Offline reload and the controlled stale-service-worker update passed.
- License verification sent only its token and no food data.
- The live checkout redirected through the Sociobot product endpoint to Dodo.
- The live verification endpoint returned its normal invalid-token response
  and a headed `429` after the public allowance.
- There is no account or sign-in flow, so live identity-provider validation is
  not applicable.

## Deployment and release

- Tag `v0.1.8` points at the same final candidate used for the site build.
- The release contains arm64/x64 DMGs, MSI, setup EXE, AppImage, DEB, RPM,
  `latest.json`, and `SHA256SUMS`.
- The GitHub Release API, peeled tag, manifest, checksum header, deployed
  `release-identity.json`, and embedded site identity agree on that candidate.
- The live detected-platform button resolves to a direct installer for Linux,
  Windows, Apple Silicon, and Intel Mac.
- The static site was uploaded only to `sf-food-log-export-kit`; no other
  application, database, key vault, or service resource was read or changed.

## Known gaps and operator action

macOS and Windows installers are unsigned. Signing requires owner-managed
certificates. If signing is added, configure the release workflow with
`APPLE_CERTIFICATE` and `WINDOWS_CERT_PFX` without committing either secret.

## Reproduce

```sh
npm ci
npm test
npm run build
npm run build:app
cargo test --manifest-path src-tauri/Cargo.toml
CI=1 npm run tauri -- build
```

Use <https://food-log-export-kit.sociobot.in/demo> for the isolated 12-record
sample workspace.
