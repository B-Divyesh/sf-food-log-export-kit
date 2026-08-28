# Handoff — Food Log Export Kit v0.1.1 repair

## Release decision

**PASS.** The findings in verifier commit `fcbb52983e9376b486b58cd0d1d4b1ade78e5c1f` for candidate `dbb818e819288931c0f1ff1cfff94c8894deb24b` are repaired. The code repair is commit `e9b69cfc7ec70158c347a4a32065d8a2a3cd5452` on `main`.

## What changed

- A failed file in a licensed multi-file selection now becomes a named conversion note. The note remains visible beside valid records and is included in the JSON archive.
- License verdicts now include the exact token. A returned or pasted replacement token clears the previous verdict and triggers verification before batch access is granted.
- ISO dates are checked as real calendar dates. Impossible dates leave the timeline empty, add a note, and retain the source value in record notes.
- Numeric parsing now documents comma rules. Grouped commas and decimal commas are interpreted with a note; ambiguous values are left empty; negative values are retained with a warning.
- The format claim now exercises comma, semicolon, and tab CSV plus JSON. New tagged claims cover validation notes, license restore, and the live paid checkout.
- All visible links and buttons measured at 390 px now have targets of at least 44 × 44 CSS pixels.
- Static hosting rewrites only the four real app routes. Unknown paths now serve the designed page with HTTP 404.
- The service-worker cache moved to `food-log-export-kit-v3` and precaches `/app` plus the static 404 assets.
- The patch release is version `0.1.1`; the original Tauri desktop-app and static deployment classes are unchanged.

## Reproduction and regression evidence

Before the source repair, the new regression suite reproduced the candidate defects:

- Unit tests observed `2025-99-99` retained as a valid date, `"1,234"` parsed as `1.234`, and a catch-all navigation fallback.
- Browser tests observed the bad batch file disappearing, the replacement token reusing a valid cache without a request, and undersized mobile targets.
- The verifier report records the original checkout response as HTTP 404 with `{"error":"enabled factory product","status":404}`. Repeating that exact request after the controller mapping change returned HTTP 303 to `https://checkout.dodopayments.com/session/cks_…`.

Exact coverage is in:

- `tests/unit/importer.test.ts` — impossible ISO dates, preserved source values, comma grouping, and negative values.
- `tests/unit/hosting.test.ts` — explicit SPA rewrites and real 404 fallback behavior.
- `tests/e2e/claims.spec.ts` — all ten declared claims, mixed-validity batch export notes, token replacement, restore, and live checkout redirect.
- `tests/e2e/accessibility.spec.ts` — desktop/mobile axe, keyboard activation, overflow, and 44 px target geometry.

Every claim ID occurs in exactly one tagged browser test. Every exact command from `.factory/claims.json` passed independently.

## Clean local verification

Run:

```sh
npm ci
npm test
npm run build:site
npm run build:app
npm audit --audit-level=high
cargo fmt --manifest-path src-tauri/Cargo.toml -- --check
cargo test --locked --manifest-path src-tauri/Cargo.toml
cargo clippy --locked --manifest-path src-tauri/Cargo.toml -- -D warnings
CI=false npm run tauri -- build --no-bundle
```

Results on 2026-08-28 UTC:

- Clean lockfile install: 66 packages, 0 vulnerabilities.
- Unit: 10 passed.
- Browser: 25 passed, 2 intentional project skips. Desktop Chromium and 390 × 844 mobile ran; axe found no serious or critical violations.
- TypeScript: passed through both production builds.
- Site/app bundles: 15.9 KB gzip JavaScript total and 5.9 KB gzip CSS; both below budget.
- Rust format, native/doc tests, and strict Clippy: passed.
- Tauri optimized binary: built at `src-tauri/target/release/food-log-export-kit`. It stayed running for the 8-second Xvfb smoke timeout with no application error.
- Static Web Apps emulator: `/`, `/app`, `/demo`, `/privacy`, and `/terms` returned 200; `/missing-page` returned 404.

## Production deployment evidence

- Deployment command: `/opt/fleet/lib/deploy-static.sh food-log-export-kit dist/site`.
- Azure deployment ID: `1092abc8-3e32-4e06-a2fc-dff087f0b418`; result `Succeeded`.
- Default host: `victorious-bush-0989e0710.7.azurestaticapps.net`; custom domain: `https://food-log-export-kit.sociobot.in`.
- Known routes return 200. `/missing-page` returns 404 with the product-specific not-found page.
- Live/local SHA-256 matches: `index.html` `ef9a3716e99bf516ede38b9a94dd126c9a96184d0bd680245a99e6cc8982c0a3`; service worker `1809ba11704d1e2448076ca9baa82ad73a2aab3b8df9457989b2568f2178b9e7`; primary JS `c6620cdbdf2f6a95877d9de398d5a89b7f34f0375c7aea225d114f7959369f47`.
- Live response headers include CSP, HSTS, `nosniff`, strict-origin referrer policy, and camera/microphone/geolocation denial.
- Factory URL verification: title, `lang=en`, one `h1`, one `main`, all image alt attributes, no unlabeled buttons, and no console/page errors on the landing page.
- Live desktop and mobile checks across `/`, `/demo`, `/app`, `/privacy`, `/terms`, and the 404 page found no serious/critical axe violations, horizontal overflow, or undersized visible targets. Known routes produced no console/page errors. The browser reports the expected failed-document message for the intentional 404 response.
- Live keyboard activation loaded sample data and exposed CSV export.
- Live demo import/export made no cross-origin requests. No analytics or trackers were observed.
- Live service-worker update activated cache `food-log-export-kit-v3`; online and offline reloads both rendered all 12 demo records with no console/page errors.
- Live mixed batch showed `broken.csv` as a conversion note beside the valid record. Live replacement-token flow made one verify request, removed the query token, and stayed unlicensed for the invalid response.
- Dodo Live checkout returned HTTP 303 to `checkout.dodopayments.com/session/cks_…` in the tagged claim test and an independent curl probe.
- Mobile Lighthouse: Performance 100, Accessibility 100, Best Practices 100, SEO 100; LCP 1.2 s, CLS 0, TBT 0 ms, transfer 86 KiB.

## Desktop release

Tag `v0.1.1` targets the repair commit. GitHub Actions run `33209924743` completed successfully across Intel and Apple Silicon macOS, Windows, Linux, and the checksum job.

The release contains arm64/x64 DMGs, app tarballs, MSI, EXE, AppImage, DEB, RPM, `SHA256SUMS`, and `latest.json`. The manifest reports version `0.1.1` with non-empty macOS, Windows, and Linux URL lists. A fresh download of `Food.Log.Export.Kit_0.1.1_amd64.deb` matched its published SHA-256: `f56254d7f7c5f8a00ef67b40727d3ac225aa9d7abe938f234697e310c327c8cc`. In a fresh live browser, the detected Linux button resolved to the v0.1.1 AppImage with no console error.

## Known gaps and operator action

- Source apps can change export headings. Unknown headings produce a named error; originals should still be kept.
- macOS and Windows packages are unsigned. Signing requires `APPLE_CERTIFICATE`, `APPLE_CERTIFICATE_PASSWORD`, `APPLE_SIGNING_IDENTITY`, `APPLE_ID`, `APPLE_PASSWORD`, `APPLE_TEAM_ID`, `WINDOWS_CERT_PFX`, and `WINDOWS_CERT_PASSWORD`.
