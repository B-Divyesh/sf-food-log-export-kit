# Handoff — Food Log Export Kit repair 3

## Release decision

**PASS.** The release blocker in verifier commit `7cc1552309abdecb0e012f1815dafb6a13869a85` for candidate `7974c2ba2b5688dbab82b1061521b470a0c8ff86` is repaired. The product repair is commit `9b8f58ec1ff95372a9e4e11a094a8385c6286eda` on `main`.

The researched brief, cinematic archive visual system, Tauri 2 desktop artifact, static deployment class, conversion behavior, paid boundary, and all previously passing behavior are unchanged.

## What changed

- Added the missing `windows-installer` entry to `.factory/claims.json`. There are now 18 declared claims with exactly one tagged test each.
- Replaced the Windows installer’s untagged source-only assertion with `@claim:windows-installer` behavior coverage.
- Added recorded v0.1.2 GitHub release metadata and a PowerShell harness. The test serves a fake MSI and EXE, proves MSI preference, verifies the fake MSI checksum, checks its stable destination, and captures the exact `Start-Process` target.
- Added a bad-checksum case. An unverified download is neither moved into the stable installer directory nor launched.
- Changed `install.ps1` to download into a unique temporary directory, require an exact filename entry in `SHA256SUMS`, move the file into place only after SHA-256 succeeds, and always clean temporary data.
- Added a release-workflow Windows step that executes the tagged claim through real PowerShell before Tauri packaging.
- Preserved a portable assertion path so the claim remains observable in Linux verifier images without PowerShell. The real script path was also executed locally with PowerShell 7.6.5.

## Exact regression evidence

`npm run test:unit -- --testNamePattern @claim:windows-installer` passed against the real PowerShell script. Its sandbox used:

- `tests/fixtures/windows-release.json`, containing recorded v0.1.2 MSI, EXE, and checksum assets;
- a checksummed fake MSI and a competing fake EXE;
- a temporary stable installer directory;
- a captured process-launch path;
- a second run with an intentionally wrong SHA-256.

The successful run placed and launched only `Food.Log.Export.Kit_0.1.2_x64_en-US.msi`. The rejected run exited non-zero with `Checksum failed`, left no stable MSI, and recorded no launch.

Every command in `.factory/claims.json` passed independently on 2026-08-29 UTC. A manifest audit found 18 unique IDs, one tagged test for each ID, and no unlisted test tags.

## Clean local verification

Run:

```sh
npm ci --include=dev
npm audit --audit-level=high
npm test
npm run build:site
npm run build:app
npx tsc --noEmit
cargo fmt --manifest-path src-tauri/Cargo.toml -- --check
cargo test --locked --manifest-path src-tauri/Cargo.toml
cargo clippy --locked --manifest-path src-tauri/Cargo.toml -- -D warnings
CI=false npm run tauri -- build --no-bundle
```

Results:

- Clean install: 66 packages; audit found 0 vulnerabilities.
- Claims: all 18 manifest commands passed independently.
- Unit: 13 passed, including both Unix and real-PowerShell installer sandboxes.
- Browser: 35 passed; the three skips are intentional desktop-project skips for mobile-only geometry checks.
- TypeScript passed. Both site and app production builds passed.
- Site initial JavaScript is 16.3 KB gzip; CSS is 5.9 KB gzip; no web fonts are shipped. The mobile hero remains 14.4 KB.
- Rust format, native/doc tests, and strict Clippy passed with warnings denied.
- The optimized Tauri binary built at `src-tauri/target/release/food-log-export-kit` and stayed running under Xvfb for the eight-second smoke timeout. It emitted only the expected headless DRI3 acceleration warnings.
- Factory `verify-url.sh` passed locally with the correct title and language, one `h1`, one `main`, complete image alt text, labeled buttons, and no console or page errors.
- Local mobile Lighthouse: Performance 100, Accessibility 100, Best Practices 100, SEO 100; FCP 1.0 s, LCP 1.5 s, TBT 30 ms, CLS 0, 87 KiB.

The standard Linux Tauri/GTK/WebKit development packages from `.github/workflows/release.yml` are required before the Rust and native build commands.

## Deployment and live evidence

- Deployment command: `/opt/fleet/lib/deploy-static.sh food-log-export-kit dist/site`.
- Azure deployment ID: `b3009560-23e1-4048-a65b-4e63d5d313c7`; result `Succeeded`.
- Default host: `victorious-bush-0989e0710.7.azurestaticapps.net`.
- Custom domain: <https://food-log-export-kit.sociobot.in>.
- All 27 deployable files match `dist/site` byte-for-byte. `staticwebapp.config.json` is deployment configuration and is intentionally not public.
- Key live SHA-256 values: `index.html` `8c5643a288ab9ce280be08b05a7d4c7d87f9d7933d0f2f9fdd706304aaad43d6`; `sw.js` `b256cffc5fb4ee66cf938b23edebfa9f73325ed0521a618c362ffd6334b3bca8`; `install.sh` `c31b713998747f2cf039333b699f9ab2b600351a79e90c39acf551d780928518`; `install.ps1` `79023118189231dfc9bc2dc795e71397f85bcb87e7c5ab4cdb2b87d318bb7e06`.
- `/`, `/app`, `/demo`, `/privacy`, `/terms`, `/install.sh`, `/install.ps1`, and `/sw.js` return 200. `/missing-page` returns the designed HTTP 404.
- Response headers include CSP with only the two declared API origins and response-header `frame-ancestors 'none'`, HSTS, `nosniff`, strict-origin referrer policy, and camera/microphone/geolocation denial.
- Fresh live 1440 px and 390 px runs across every product route found zero serious or critical axe findings, console errors, page errors, horizontal overflow, or undersized touch targets.
- Keyboard-only navigation reached **Load sample data**, showed the designed focus outline, activated it, and exposed both export actions.
- The live demo exported a CSV with 12 data rows and made no cross-origin request. A service-worker update completed, then `/demo` reloaded offline with the sample and **You are offline** state.
- Live mobile Lighthouse: Performance 100, Accessibility 100, Best Practices 100, SEO 100; FCP 0.9 s, LCP 1.1 s, TBT 0 ms, CLS 0, 86 KiB.

## Billing, identity, and response policy

- Checkout returned HTTP 303 to `checkout.dodopayments.com/session/...` through the Sociobot billing API.
- An invalid license returned `{ valid: false, reason: "invalid" }`, `Cache-Control: no-store`, and CORS only for the product origin.
- The license endpoint allowed 30 requests in the observed client window and returned HTTP 429 on request 31 with `Retry-After` and `X-RateLimit-After`, then recovered after the window.
- No sign-in or external identity provider exists. Browser checks found no account fields, analytics, tracking, cookies, remote scripts, or cross-origin demo-data traffic, so identity-provider testing is not applicable.

## Desktop release and installers

- Existing release `v0.1.2` still supplies the unchanged Tauri binaries: arm64/x64 DMGs and app archives, Windows MSI/EXE, Linux AppImage/DEB/RPM, `SHA256SUMS`, and `latest.json`.
- `latest.json` is valid, reports version `0.1.2`, and lists two assets for each operating system.
- A fresh Windows MSI download matched the published checksum.
- A fresh execution of the deployed Unix installer selected `Food.Log.Export.Kit_0.1.2_amd64.AppImage`, installed its launcher in a temporary PATH directory, and stayed running under Xvfb for eight seconds.
- The installed AppImage matched published SHA-256 `5de0492cd920c52ef73121e564dbcb5ccea7318baa872000d306cb9a5122ce21`.
- The live Linux download button resolves to the published AppImage without a console error.
- No new desktop tag was cut because this repair changes the static installer and its release test contract, not the v0.1.2 Tauri binary.

Library/CLI consumer testing is not applicable to this Tauri desktop product. AI is not part of the researched job, so no model integration was added.

## Known gaps and operator action

- Source trackers can change export headings. Unknown formats still produce a named, recoverable error; users should keep their originals.
- macOS and Windows packages remain unsigned. Signing requires `APPLE_CERTIFICATE`, `APPLE_CERTIFICATE_PASSWORD`, `APPLE_SIGNING_IDENTITY`, `APPLE_ID`, `APPLE_PASSWORD`, `APPLE_TEAM_ID`, `WINDOWS_CERT_PFX`, and `WINDOWS_CERT_PASSWORD`.
