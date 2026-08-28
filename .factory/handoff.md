# Handoff — Food Log Export Kit v0.1.2 repair

## Release decision

**PASS.** Every release blocker in verifier commit `c23cbaa7b69fb99eb34c38f36541a3d230779900` for candidate `439bb2419fe5f767fe3d9f0a18b272ba03ddf284` is repaired. Product code is commit `c3f918bd1aea5a6bf765a39112ac7698a37c1349` on `main` and tag `v0.1.2`.

## What changed

- Reproduced the exact Unix installer failure first: `sh public/install.sh` exited 1 with “Desktop downloads are still being published” and created no artifact.
- Replaced the whitespace-sensitive GitHub JSON expression with a portable whitespace-tolerant parser.
- The Unix installer now selects the x64 AppImage on Linux, the arm64 app archive on Apple Silicon, and the x64 app archive on Intel Mac.
- Downloads go to a private temporary directory, must match `SHA256SUMS`, and are removed after installation.
- Linux installs the AppImage under the user application directory and creates a `food-log-export-kit` PATH launcher with FUSE-free fallback. macOS installs the verified `.app` and creates the same launcher. The default fallback adds `~/.local/bin` to `.profile` once.
- The PowerShell installer prefers the MSI, verifies it outside the current directory, and starts it.
- Landing-page download selection now distinguishes Linux, Windows MSI, Apple Silicon DMG, and Intel DMG. Unknown Mac architecture falls back to the release page instead of guessing.
- `.factory/claims.json` now has 17 claims with exactly one tagged test each. New claims cover demo reset/discard and storage isolation, no account/analytics/tracking, unlicensed single-file behavior and free exports, meal/recipe/nutrition/weight normalization, revoked licenses, platform/architecture downloads, and verified PATH installation.
- Existing format and validation claims now cover every documented JSON list shape, raw JSON arrays, missing and impossible dates, unreadable numbers, grouped commas, decimal commas, European grouping, ambiguous commas, and negative values.
- Accessibility coverage now includes `/app`, real Tab traversal, 390 px touch targets, 200% page scale, and reduced motion.
- Version is `0.1.2`; the service-worker cache is `food-log-export-kit-v4`. The researched scope, Tauri desktop artifact, static deployment class, visual thesis, and previously passing behavior are unchanged.

## Exact regression coverage

- `tests/unit/installer.test.ts` creates spaced GitHub-style JSON and checksummed fake assets. One tagged test runs Linux x64, Mac arm64, and Mac x64 installs and executes each PATH launcher. It also checks Windows MSI selection, hashing, stable destination, and launch.
- `tests/unit/release.test.ts` checks OS detection and exact asset selection for Linux, Windows, Apple Silicon, and Intel Mac.
- `tests/e2e/claims.spec.ts` contains exactly one test for every browser claim. The platform claim uses four clean browser profiles. The other added tests inspect exported data, storage, requests, cookies, scripts, controls, and license state.
- `tests/e2e/accessibility.spec.ts` runs axe on all product routes at desktop and 390 px, follows the real keyboard path, measures every visible target, checks overflow at 200% scale, and checks reduced motion.

Every command in `.factory/claims.json` passed independently on 2026-08-28 UTC.

## Clean local verification

Run:

```sh
npm ci --include=dev
npm audit --audit-level=high
npm test
npm run build:site
npm run build:app
cargo fmt --manifest-path src-tauri/Cargo.toml -- --check
cargo test --locked --manifest-path src-tauri/Cargo.toml
cargo clippy --locked --manifest-path src-tauri/Cargo.toml -- -D warnings
CI=false npm run tauri -- build --no-bundle
```

Results:

- Clean npm install: 66 packages; audit found 0 vulnerabilities.
- Unit: 13 passed.
- Browser: 35 passed; 3 expected desktop-project skips for mobile-only geometry checks.
- TypeScript passed through both builds. There is no separate JavaScript lint configuration; strict Rust Clippy passed with warnings denied.
- Site and app builds passed. Initial JavaScript totals 16.3 KB gzip; CSS is 5.9 KB gzip; the mobile hero remains 14.4 KB.
- Rust format, native/doc tests, strict Clippy, and optimized native build passed.
- The native binary stayed running under Xvfb for the eight-second smoke timeout with no application error.
- Factory `verify-url.sh` passed locally and live: correct title and language, one `h1`, one `main`, image alt text, labeled controls, and no console/page errors.
- Local mobile Lighthouse: Performance 99, Accessibility 100, Best Practices 100, SEO 100; LCP 1.9 s, TBT 70 ms, CLS 0, 87 KiB.

## Live deployment and browser evidence

- Deployment command: `/opt/fleet/lib/deploy-static.sh food-log-export-kit dist/site`.
- Azure deployment ID: `f3a6c3ae-a2d4-459f-8006-5f11041119be`; result `Succeeded`.
- Default host: `victorious-bush-0989e0710.7.azurestaticapps.net`; custom domain: `https://food-log-export-kit.sociobot.in`.
- `/`, `/app`, `/demo`, `/privacy`, `/terms`, `/install.sh`, and `/install.ps1` return 200. `/missing-page` returns 404.
- Live/local SHA-256 matches: `index.html` `8c5643a288ab9ce280be08b05a7d4c7d87f9d7933d0f2f9fdd706304aaad43d6`; `sw.js` `b256cffc5fb4ee66cf938b23edebfa9f73325ed0521a618c362ffd6334b3bca8`; `install.sh` `c31b713998747f2cf039333b699f9ab2b600351a79e90c39acf551d780928518`.
- Live desktop and 390 px browser checks on every known route found zero serious/critical axe findings, console errors, horizontal overflow, or undersized targets.
- Keyboard-only navigation reached **Load sample data**, activated it, and exposed **Export CSV**.
- Live demo export made no cross-origin requests. After the network was disabled, `/demo` reloaded with 12 rows and the offline status.
- Live headers include CSP with the two declared API origins and `frame-ancestors 'none'`, HSTS, `nosniff`, strict-origin referrer policy, and camera/microphone/geolocation denial.
- Live mobile Lighthouse: Performance 100, Accessibility 100, Best Practices 100, SEO 100; FCP 0.9 s, LCP 1.1 s, TBT 0 ms, CLS 0, 86 KiB.
- Checkout returned HTTP 303 to a `checkout.dodopayments.com/session/cks_…` URL.
- License response policy allowed 30 requests, returned 429 on request 31 with `Retry-After: 3`, then recovered to 200. The response used `Cache-Control: no-store` and allowed only the product origin.

## Desktop release and installer evidence

- GitHub Actions run `33216566769` completed successfully on Apple Silicon macOS, Intel macOS, Windows, Linux, and the checksum job.
- Release `v0.1.2` targets `c3f918bd1aea5a6bf765a39112ac7698a37c1349`.
- The release contains arm64/x64 DMGs and app archives, MSI, EXE, AppImage, DEB, RPM, `SHA256SUMS`, and `latest.json`.
- `latest.json` reports version `0.1.2` and two download URLs for each operating system.
- A fresh execution of the deployed `install.sh` selected `Food.Log.Export.Kit_0.1.2_amd64.AppImage`, installed its PATH launcher, and stayed running under Xvfb for the 12-second smoke timeout.
- The installed AppImage matched its published SHA-256: `5de0492cd920c52ef73121e564dbcb5ccea7318baa872000d306cb9a5122ce21`.
- In a fresh live Linux browser, the detected button linked directly to the v0.1.2 AppImage and produced no console error.

Library/CLI consumer packaging is not applicable to this Tauri desktop app. AI is not part of the researched job, so no model or gateway integration was added.

## Known gaps and operator action

- Source trackers can change their export headings. Unknown formats still produce a named, recoverable error; users should keep originals.
- macOS and Windows packages remain unsigned. Signing requires `APPLE_CERTIFICATE`, `APPLE_CERTIFICATE_PASSWORD`, `APPLE_SIGNING_IDENTITY`, `APPLE_ID`, `APPLE_PASSWORD`, `APPLE_TEAM_ID`, `WINDOWS_CERT_PFX`, and `WINDOWS_CERT_PASSWORD`.
