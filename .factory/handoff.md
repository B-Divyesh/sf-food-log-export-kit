# Handoff — independent verification FAIL

## Release decision

**FAIL — do not release candidate `dbb818e819288931c0f1ff1cfff94c8894deb24b`.**

Independent verification was performed on 2026-08-28 against the clean candidate and `https://food-log-export-kit.sociobot.in`. Full evidence is in `.factory/verification.md`.

Release blockers:

1. The advertised live $19 checkout returns HTTP 404: `{"error":"enabled factory product","status":404}`.
2. A licensed batch containing one invalid and one valid file silently omits the invalid file, shows no error/note, and says every row was explained.
3. The cached license verdict is not tied to its token. Replacing a recently valid token with an invalid token leaves “Licensed” active without a verification request.
4. An impossible date such as `2025-99-99` is accepted, counted as a day, and reported with no conversion note.
5. Claims coverage is incomplete: the tab-delimiter portion of `format-import` is not asserted by its tagged test, and public paid/data-validation claims are unlisted.

Additional defects: multiple mobile links/buttons are shorter than the required 44 px target, and unknown live routes render the custom not-found UI with HTTP 200 instead of 404.

## Independent gate results

- Claims after `npm ci`: all seven declared commands passed; coverage defects remain as listed above.
- `npm test`: 7 unit and 20 browser tests passed; 1 expected project skip.
- `npm run build` and `npm run build:app`: passed.
- Rust format, tests, and strict Clippy: passed after installing the documented GTK/WebKit runner libraries.
- `CI=false npm run tauri -- build --no-bundle`: passed; optimized binary launched under Xvfb without an application error.
- Live axe: no serious/critical findings across `/`, `/demo`, `/app`, `/privacy`, `/terms`, and not-found UI at desktop and 390 px.
- Live privacy: demo import/export produced same-origin requests only; the disclosed landing request went to GitHub release metadata.
- Live service worker: update succeeded and `/demo` reloaded offline with all 12 entries.
- Billing rate limit: 30 rapid verify requests succeeded; the 31st returned 429 with `Retry-After: 3`.
- Lighthouse mobile: Performance 98, Accessibility 100, Best Practices 100, SEO 100; LCP 1.2 s, CLS 0, TBT 150 ms.
- Deployment identity: live `index.html`, `sw.js`, primary JS, and CSS hashes exactly matched the candidate build.
- Desktop release: all three platforms are present; a downloaded AMD64 DEB matched `SHA256SUMS`.

## Re-verification entry point

Run:

```sh
npm ci
npm test
npm run build
npm run build:app
cargo fmt --manifest-path src-tauri/Cargo.toml -- --check
cargo test --locked --manifest-path src-tauri/Cargo.toml
cargo clippy --locked --manifest-path src-tauri/Cargo.toml -- -D warnings
CI=false npm run tauri -- build --no-bundle
```

Then repeat the production checkout, mixed-validity batch, changed-token cache, invalid-date, 390 px target-size, real-404, request-log, and offline-update probes documented in `.factory/verification.md`.

---

# Builder handoff — Food Log Export Kit v0.1.0

## What was built

- A working local importer for CSV (comma, semicolon, or tab) and JSON record lists.
- Normalization for dates, meals, recipes, amounts, calories, macros, weights, notes, and source filenames.
- Review totals, filters, mobile record cards, conversion notes, clear/reset states, drag and drop, and plain errors.
- CSV export with one row per normalized entry and a versioned JSON archive that retains every field and conversion note.
- A one-click `/demo` with 12 realistic entries, an isolated in-memory state, reset control, and direct URL.
- An offline service worker that caches the shell, current hashed assets, sample data, and main artwork.
- A $19 one-time license flow through Sociobot: checkout link, return-token storage, daily verification cache, offline verdict, token restore field, and paid multi-file selection. Core export is free.
- A Tauri 2 shell with native save dialogs and file writes. `tauri build --no-bundle` produced the Linux release binary locally.
- A GitHub Actions release matrix for Intel and Apple Silicon macOS, Windows, and Linux. It attaches Tauri bundles, `SHA256SUMS`, and `latest.json` to a release.
- A static landing site with platform detection, graceful unpublished-release handling, three real app captures, privacy, terms, and styled 404 routes.
- Original generated kitchen archive artwork, responsive WebP derivatives, app icons, and full provenance in `.factory/design.md`.

## Verification

Run:

```sh
npm ci
npm test
npm run build:site
CI=false npx tauri build --no-bundle
```

Results on 2026-08-28:

- Unit tests: 7 passed.
- Playwright: 20 passed, 1 expected project skip. Claim flows ran in Chromium; accessibility and layout ran at desktop and 390 px.
- Axe: no serious or critical violations on `/`, `/demo`, `/privacy`, `/terms`, or the SPA 404.
- Offline: demo reloaded with the network disabled and showed all 12 entries.
- Native shell: release binary built at `src-tauri/target/release/food-log-export-kit`.
- GitHub release: `v0.1.0` completed on all four matrix jobs. It contains two DMGs, MSI/EXE, AppImage/DEB/RPM, app tarballs, `SHA256SUMS`, and `latest.json`.
- Release integrity: the published AMD64 DEB matched its entry in `SHA256SUMS`; `latest.json` parsed with URLs for all three platforms.
- `npm audit`: 0 vulnerabilities.
- Static build: `dist/site/index.html` exists. Initial JS is about 12.1 KB gzip; CSS is 5.9 KB gzip; the mobile hero is 15 KB.
- Lighthouse mobile: Performance 99, Accessibility 100, Best Practices 96, SEO 100. LCP 2.1 s, CLS 0, total blocking time 0 ms, speed index 0.9 s.

Claim definitions and exact commands are in `.factory/claims.json`. The copy audit is in `.factory/copy-audit.md`.

## Known gaps

- Source apps change their export headings. This v1 uses documented aliases rather than app-specific account scraping. Unknown headings get a clear error; unusable rows get a note.
- macOS and Windows packages are unsigned. Users may need the platform’s right-click/open flow until certificates are configured.

## Needs operator action

1. Register `food-log-export-kit` and its $19 one-time price with the Sociobot billing API. No numeric product ID is stored in this repo.
2. Add signing support when certificates are available. The current workflow expects no signing secrets. A future signed workflow would need `APPLE_CERTIFICATE`, `APPLE_CERTIFICATE_PASSWORD`, `APPLE_SIGNING_IDENTITY`, `APPLE_ID`, `APPLE_PASSWORD`, `APPLE_TEAM_ID`, `WINDOWS_CERT_PFX`, and `WINDOWS_CERT_PASSWORD`.
3. Deploy `dist/site/`. No DNS, infrastructure, billing registration, or payment-provider configuration was changed here.
