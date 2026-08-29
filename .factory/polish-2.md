# Polish 2 — cumulative review repair map

Candidate repaired from `ad419455d79abbeb8f00befb0d82114ee2400bf7`; cumulative review source: `66461dbdfdaec0caad8e17eeecb3005e225ff47f`. Verified and deployed 2026-08-29 UTC.

| Finding | Change made | Evidence |
|---|---|---|
| F-1-1 | Kept the compact named meal above the stage rail. Added the full app navigation without pushing it below the 390 × 844 first viewport. | `mobile demo shows a named sample record in the first viewport`; [live mobile demo](evidence/polish-2/live-demo/screenshot-mobile.png); cold live measurement: sample bottom `616px` in an `844px` viewport. |
| F-1-2 | Completed the claims inventory, retained the token-only license request test, removed untestable signing/refund copy, and added the missing lossy-field claim. Every manifest id has exactly one tagged test. | All 20 exact `.factory/claims.json` commands passed independently from `/tmp/food-log-polish-2.BDw9rs`; `@claim:license-request-data-boundary`; `@claim:lossy-fields`. |
| F-1-3 | Preserved heading focus for every History API transition and Back/Forward return. | `back navigation restores focus to the landing heading`; cold live `/` → `/privacy` → Back check passed. |
| F-1-4 | Kept the designed HTTP 404 and completed route metadata, Terms navigation, Param Factory attribution, and the shared build marker. | `static hosting routes › gives the static 404 page the shared metadata, navigation, and footer`; live `/not-a-real-route` returned `404` with canonical, OG/Twitter, Apple touch, Terms, factory, and build markers. |
| F-1-5 | The first action still names both outputs: “download a CSV and JSON archive.” | [live landing screenshot](evidence/polish-2/live-landing/screenshot-desktop.png); `.factory/copy-audit.md`. |
| F-1-6 | Kept the concrete “Export food tracker history” eyebrow and no decorative exit slogan. | `.factory/copy-audit.md`; live `/`. |
| F-1-7 | Kept “Download the desktop app”. | `.factory/copy-audit.md`; live `/`. |
| F-1-8 | Kept “Review before export”. | `.factory/copy-audit.md`; live `/`. |
| F-1-9 | Kept “How to turn an export into an archive”. | `.factory/copy-audit.md`; live `/`. |
| F-1-10 | Kept “Privacy and limits” and “How the app handles your files”. | `.factory/copy-audit.md`; live `/`. |
| F-1-11 | Standardized the section and product name as “batch-import license”. | `.factory/copy-audit.md`; live `/` and `/terms`. |
| F-1-12 | Kept the README opening as short, concrete sentences and updated it for food-tracker and lossy-field behavior. | `README.md`; `.factory/copy-audit.md`; no sentence exceeds 22 words. |
| F-2-1 / F-1-2 | The importer now detects every populated unknown column or JSON key, adds a note naming row, field, and source, and preserves the original value under each record’s `unmapped_fields`. Removed “complete” output claims and refunded-license wording. | `@claim:lossy-fields names and preserves every populated unrecognized field`; `preserves populated unmapped fields and names their source row`; [live Fiber note](evidence/polish-2/live-lossy-fields-mobile.png); cold live JSON had `unmapped_fields.Fiber = "12"` and one matching issue. |
| F-2-2 | Replaced the payment sentence with “Sociobot opens a checkout page hosted by Dodo.” | `@claim:paid-purchase live checkout redirects to Dodo hosted checkout`; live checkout returned `303`; live landing copy check passed. |
| F-2-3 | Added a semantic app navigation with Home, Demo, Privacy, and Terms, plus the shared footer, to `/app` and `/demo`. | `app and demo use the shared navigation and footer`; [live app mobile](evidence/polish-2/live-app/screenshot-mobile.png); [live demo mobile](evidence/polish-2/live-demo/screenshot-mobile.png). |
| F-2-4 | `/app` now publishes `https://food-log-export-kit.sociobot.in/app` as its canonical and OG URL. | `each client route sets its title, canonical URL, and heading focus`; cold live `/app` canonical check passed. |
| F-2-5 | Unified static and rendered footers on `Version 0.1.2 · polish 2 · Generated artwork`. | `keeps the static and rendered footer build identifiers in sync`; cold live app and 404 checks passed. |
| F-2-6 | Replaced “calorie tracker” with “food tracker” across the first screen, README, and terminology audit. | `.factory/copy-audit.md`; cold live first-screen wording check passed. |
| F-2-7 | Standardized paid-tier copy to “batch-import license” in landing, ticket, action, app, Terms, README, and claims. | `.factory/copy-audit.md`; `@claim:paid-purchase`; `@claim:batch-import`. |
| F-2-8 | Replaced “A free archive” with “The free app”. Archive now refers only to output. | `.factory/copy-audit.md`; live `/`. |
| F-2-9 | Replaced “desktop webview” with “website and desktop app”. | `README.md`; copy scan returned no match. |
| F-2-10 | Replaced “cross-origin requests” with “contacts only this website”. | `README.md`; `@claim:local-only` and `@claim:privacy-no-account`. |
| F-2-11 | Removed “ISO” and explains `YYYY-MM-DD` and conversion notes directly. | `README.md`; `@claim:validation-notes`. |
| F-2-12 | Replaced “SPA routing” with the concrete reload behavior of app routes. | `README.md`; `static hosting routes › rewrites only known app routes and lets unknown paths return HTTP 404`. |

## Full evidence

- Fresh clone: `git clone --no-local /work/repo /tmp/food-log-polish-2.BDw9rs`, then `npm ci`.
- Every one of the 20 exact claim commands passed independently.
- Clean-clone `npm test`: 16 unit tests and 44 browser tests passed; 4 intentional cross-project skips.
- Clean-clone `npm run build` and `npm run build:app`: passed. Initial JS totals 48.52 kB raw; largest chunk 38.13 kB raw / 13.51 kB gzip. CSS is 23.39 kB raw / 6.08 kB gzip.
- Clean-clone `cargo test --manifest-path src-tauri/Cargo.toml`: passed after installing the workflow’s Linux Tauri system libraries.
- Live Lighthouse: performance 100, accessibility 100, best practices 100, SEO 100; LCP 1.1 s, CLS 0, TBT 0 ms. Report: [lighthouse-live.json](evidence/polish-2/lighthouse-live.json).
- Live verifier reports for `/`, `/?demo=1`, `/app`, `/privacy`, and `/terms` contain no console errors, missing alt text, unlabeled buttons, or structural failures.
- Cold live axe checks found zero serious or critical violations on `/`, `/demo`, `/app`, `/privacy`, and `/terms`.
- Cold live demo made zero cross-origin requests, wrote zero storage keys, reset to 12 entries, and reloaded offline with its sample intact.
- Live link crawl returned 200 for every same-origin destination. Checkout returned its expected 303 and the published AppImage link returned its expected GitHub 302 download redirect.
- Release `v0.1.2` contains macOS Intel/Apple Silicon, Windows MSI/EXE, Linux AppImage/DEB/RPM, `latest.json`, and `SHA256SUMS`. A downloaded AppImage passed `sha256sum --check`.
- Deployment: `/opt/fleet/lib/deploy-static.sh food-log-export-kit dist/site`; Azure deployment `c85a4034-ae2f-46a4-b4ba-06e67bc597e6`; live URL <https://food-log-export-kit.sociobot.in>.

No finding from review 1 or review 2 remains open.
