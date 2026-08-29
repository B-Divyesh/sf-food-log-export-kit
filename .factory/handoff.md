# Handoff — perfection loop round 3

## Result

**PASS.** Every finding from `.factory/review-1.md`, `.factory/review-2.md`, and `.factory/review-3.md` is closed. The cumulative finding-to-evidence map is in `.factory/polish-3.md`.

## What changed

- Rewrote the remaining vague workflow headings and removed unexplained “normalized” wording from the landing page.
- Replaced README installer jargon with the visible result of each safety/install step.
- Added a visible release-notes link beside the detected download and tied it to GitHub’s selected release metadata.
- Updated `.factory/claims.json`, copy audit, catalog description, footer build markers, and regression coverage.
- Preserved the archive-at-dusk visual system. Drawer motion now keeps text fully opaque so contrast never falls during entry.
- Kept the one-click `?demo=1` path fully isolated, with a persistent banner, Reset demo, and Start for real.

## Verification from a clean clone

Final clone `/tmp/food-log-polish-3-final.KqHppu` checked commit `3ef5e19`:

- All 20 exact test commands in `.factory/claims.json`: passed independently.
- `npm test`: 20 unit tests passed; 46 browser tests passed; 4 desktop-project skips were mobile-only cases that passed in the mobile project.
- `npm run build`: passed and produced `dist/site/`.
- `npm run build:app`: passed and produced `dist/app/`.
- `cargo test` in `src-tauri/`: passed for library, binary, and doc-test targets.
- Largest JS chunk: 38.40 kB raw / 13.54 kB gzip. CSS: 23.48 kB raw / 6.10 kB gzip.

Run the same gates with:

```sh
npm ci
npm test
npm run build
npm run build:app
(cd src-tauri && cargo test)
```

## Live verification

- Deployment: `78331c2a-eb2f-477c-bf73-2858f49c3cdb`
- Live URL: <https://food-log-export-kit.sociobot.in>
- Direct demo: <https://food-log-export-kit.sociobot.in/?demo=1>
- `verify-url.sh`: passed on `/`, `/?demo=1`, `/app`, `/privacy`, and `/terms` with correct title, language, one `<h1>`, `<main>`, alt text, and no console errors.
- Cold axe scan: zero serious or critical findings on `/`, `/demo`, `/app`, `/privacy`, `/terms`, and `/missing-page`.
- Real routing: known routes returned 200; `/missing-page` returned 404 with its own title and shared legal/footer structure.
- History focus: `/` → `/privacy` → Back restored focus to the landing `<h1>`.
- Mobile demo at 390 × 844: named sample ended at 616 px; no horizontal overflow; no target under 44 px.
- Demo privacy: only same-origin requests, no cookies, no demo storage keys, real-workspace probe untouched, Reset restored 12 entries, Start for real opened an empty `/app`.
- Offline: a fresh demo context reopened with its sample and offline notice after network disablement.
- Lossless import: live Fiber input showed `Row 2: Fiber`; exported JSON contained `unmapped_fields.Fiber = "12"`.
- Live Lighthouse mobile: 100 performance, 100 accessibility, 100 best practices, 100 SEO; LCP 1.7 s, CLS 0, TBT 0 ms.
- Release `v0.1.4`: release-notes URL returned 200. Downloaded AppImage matched `SHA256SUMS` (`78f07207b7837154ee3cb98f4b4a67f2164c633bf450108900a4a2363f2eb003`).

Evidence is in `.factory/evidence/polish-3/`.

## Deployment and release

The static site was built with `npm run build` and deployed through the work-order command:

```sh
/opt/fleet/lib/deploy-static.sh food-log-export-kit dist/site
```

The work order’s configured deploy target is static. It preserves the candidate Tauri release `v0.1.4`, with macOS, Windows, AppImage, DEB, and RPM assets, while updating the site that distributes it. The published cross-platform assets and checksums were reverified.

## Known gaps

None.

## Needs operator action

Published desktop builds are unsigned. Signing a future release requires the owner’s `APPLE_CERTIFICATE` and `WINDOWS_CERT_PFX` secrets. This does not affect the verified web deployment or the downloadable unsigned `v0.1.4` assets.
