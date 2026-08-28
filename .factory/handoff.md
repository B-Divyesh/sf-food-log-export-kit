# Handoff — Food Log Export Kit v0.1.0

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
- `npm audit`: 0 vulnerabilities.
- Static build: `dist/site/index.html` exists. Initial JS is about 12.1 KB gzip; CSS is 5.9 KB gzip; the mobile hero is 15 KB.
- Lighthouse mobile: Performance 99, Accessibility 100, Best Practices 96, SEO 100. LCP 2.1 s, CLS 0, total blocking time 0 ms, speed index 0.9 s.

Claim definitions and exact commands are in `.factory/claims.json`. The copy audit is in `.factory/copy-audit.md`.

## Known gaps

- Source apps change their export headings. This v1 uses documented aliases rather than app-specific account scraping. Unknown headings get a clear error; unusable rows get a note.
- The GitHub release assets do not exist until the `v0.1.0` tag runs the release workflow. The site shows a calm publishing state until then.
- macOS and Windows packages are unsigned. Users may need the platform’s right-click/open flow until certificates are configured.

## Needs operator action

1. Register `food-log-export-kit` and its $19 one-time price with the Sociobot billing API. No numeric product ID is stored in this repo.
2. Push `main`, then push tag `v0.1.0`. Confirm `.dmg`, `.msi`/`.exe`, `.AppImage`, `.deb`, `SHA256SUMS`, and `latest.json` on the GitHub release.
3. Add signing secrets when certificates are available: `APPLE_CERTIFICATE`, `APPLE_CERTIFICATE_PASSWORD`, `APPLE_SIGNING_IDENTITY`, `APPLE_ID`, `APPLE_PASSWORD`, `APPLE_TEAM_ID`, `WINDOWS_CERT_PFX`, and `WINDOWS_CERT_PASSWORD`. The current workflow intentionally builds unsigned packages and does not consume them.
4. Deploy `dist/site/`. No DNS, infrastructure, billing registration, or payment-provider configuration was changed here.
