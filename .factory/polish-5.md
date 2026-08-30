# Polish 5 — cumulative adversarial repair map

Repair scope: released candidate `8f6606c69381aa155fff7bdc207cf84a1514b314`
and every finding in reviews 1–5. The repaired product source is
`b39d3a283685b66fb25fbcb0f9b5bb9518aec143`; the desktop release is `v0.1.7`.

Evidence is under `.factory/evidence/polish-5/`. `live-audit.json` records a
cold audit of the deployed site at desktop and 390 × 844. It covers every
route, metadata, navigation, focus, Axe, demo isolation, downloads, offline
reload, lossy fields, payment redirect, and the published desktop download.

| Finding ID | Change made | Evidence |
|---|---|---|
| F-1-1 | Kept the direct `/demo` and `?demo=1` sandbox, persistent banner, reset/exit actions, and named oatmeal record above the mobile fold. | Test `mobile demo shows a named sample record in the first viewport`; `live-demo/screenshot-mobile.png`; live `/?demo=1` record bottom was 615.55 px in an 844 px viewport. |
| F-1-2 | Kept every public product promise in the 22-item claims manifest, with one exact tagged test per ID; removed unsupported broad wording. | All 22 manifest commands passed from the clean clone; manifest/tag uniqueness audit passed; `live-landing/screenshot-desktop.png`; cold live copy and behavior audit passed. |
| F-1-3 | Kept route-change heading focus for navigation and browser Back. | Test `back navigation restores focus to the landing heading`; `live-privacy/screenshot-desktop.png`; live `/` → `/privacy` → Back focused both route headings. |
| F-1-4 | Kept the designed HTTP 404 with route metadata, standard navigation, full footer, legal links, attribution, and version. | Test `gives the static 404 page the shared metadata, navigation, and footer`; `live-404.png`; live `/not-a-real-route` returned HTTP 404 and passed Axe. |
| F-1-5 | Kept the first action outcome explicit about downloading CSV and JSON. | Test `keeps review 3 copy plain and links readers to release notes`; `live-landing/screenshot-mobile.png`; cold live landing copy check. |
| F-1-6 | Kept `Export food tracker history` and removed decorative exit slogans. | Copy audit; `live-landing/screenshot-desktop.png`; cold live landing copy check. |
| F-1-7 | Kept the direct heading `Download the desktop app`. | Copy audit; `live-landing/screenshot-desktop.png`; live `/` check. |
| F-1-8 | Kept the descriptive label `Review before export`. | Copy audit; `live-landing/screenshot-desktop.png`; live `/` check. |
| F-1-9 | Kept `How to turn an export into an archive`. | Copy audit; `live-landing/screenshot-desktop.png`; live `/#how` check. |
| F-1-10 | Kept `Privacy and limits` and `How the app handles your files`. | Copy audit; `live-landing/screenshot-desktop.png`; live `/` check. |
| F-1-11 | Kept `batch-import license` as the paid-tier name. | Tests `@claim:batch-import` and `@claim:paid-purchase`; `live-landing/screenshot-desktop.png`; live `/` and `/terms` checks. |
| F-1-12 | Kept the README opening as short, concrete sentences. | Test `keeps review 5 wording concrete and consistent`; copy audit; README clean-clone check. |
| F-2-1 / F-1-2 | Kept every populated unrecognized field in JSON `unmapped_fields` and named it by source row in conversion notes. | Test `@claim:lossy-fields names and preserves every populated unrecognized field`; `live-app/screenshot-desktop.png`; live Fiber import produced a note and preserved `Fiber: "12"`. |
| F-2-2 | Kept payment copy accurate: Sociobot opens the Dodo-hosted checkout. | Test `@claim:paid-purchase live checkout redirects to Dodo hosted checkout`; `live-landing/screenshot-desktop.png`; live endpoint returned 303 to `checkout.dodopayments.com`. |
| F-2-3 | Kept the shared semantic navigation/footer on `/app` and `/demo`. | Test `every route uses the same primary navigation destinations and shared footer`; `live-app/screenshot-mobile.png`; cold live app/demo route audit. |
| F-2-4 | Kept the `/app` title, canonical URL, OG URL, heading, and route focus specific to `/app`. | Test `each client route sets its title, canonical URL, and heading focus`; `live-app/screenshot-desktop.png`; live `/app` metadata audit. |
| F-2-5 | Updated every static and rendered build marker together to version 0.1.7. | Tests `keeps the static and rendered footer build identifiers in sync` and `keeps the tagged desktop release version in sync`; `live-404.png`; live 404/app footer check. |
| F-2-6 | Kept `food tracker` as the single public source-product term. | Copy audit and review-5 wording regression; `live-landing/screenshot-desktop.png`; cold live copy scan. |
| F-2-7 | Kept `batch-import license` as the single public paid-tier term. | Tests `@claim:batch-import` and `@claim:paid-purchase`; `live-landing/screenshot-desktop.png`; live `/` and `/terms` checks. |
| F-2-8 | Kept `archive` for exported output and `free app` for the product tier. | Copy audit; `live-landing/screenshot-desktop.png`; cold live copy scan. |
| F-2-9 | Kept `website and desktop app` instead of unexplained webview wording. | Review-5 wording regression and copy audit; `live-app/screenshot-desktop.png`; README clean-clone scan. |
| F-2-10 | Kept the plain privacy boundary `contacts only this website`. | Tests `@claim:local-only` and `@claim:privacy-no-account`; `live-demo/screenshot-mobile.png`; live demo recorded zero cross-origin requests. |
| F-2-11 | Kept the concrete `YYYY-MM-DD` format and conversion-note behavior. | Test `@claim:validation-notes`; `live-app/screenshot-desktop.png`; clean-clone claim run. |
| F-2-12 | Kept concrete reload behavior and explicit known-route rewrites. | Test `@claim:static-hosting`; `live-404.png`; live `/app` returned 200 and the unknown route returned 404. |
| F-3-1 | Kept `Review conversion notes`. | Test `keeps review 3 copy plain and links readers to release notes`; `live-landing/screenshot-desktop.png`; live `/#how` check. |
| F-3-2 | Kept `Save CSV and JSON`. | Same copy test; `live-landing/screenshot-desktop.png`; live walkthrough check. |
| F-3-3 | Kept the plain explanation of consistent JSON fields and conversion notes. | Same copy test; `live-landing/screenshot-desktop.png`; cold live copy scan. |
| F-3-4 | Kept the installer explanation that the downloaded file is checked for changes. | Test `@claim:verified-installer`; README clean-clone scan; live release checksum verification. |
| F-3-5 | Kept the explanation that the installer adds a terminal command. | Test `@claim:verified-installer`; README clean-clone scan; published `install.sh` check. |
| F-3-6 | Kept a visible release-notes destination tied to the selected release. | Tests `landing link crawl includes the selected release notes page` and `@claim:detected-platform-downloads`; `live-landing/screenshot-desktop.png`; live link resolves to `v0.1.7`. |
| F-4-1 | Kept the scoped heading `Review entries and conversion notes`; no universal every-row claim remains. | Test `keeps the review promise within the tested conversion-note scope`; `live-landing/screenshot-desktop.png`; cold live copy scan. |
| F-4-2 | Kept the current export walkthrough showing populated rows and both export buttons with precise alt text. | Test `ships a current export walkthrough frame with precise alternative text`; `live-landing/screenshot-desktop.png`; live image and alt audit. |
| F-5-1 | Replaced the app-only Home destination with the shared `Demo · How it works · Privacy · Terms` navigation generated from one function. The wordmark remains Home. | Test `every route uses the same primary navigation destinations and shared footer` compares `/`, `/demo`, `/app`, `/privacy`, `/terms`, the client 404, and static `404.html`; `live-app/screenshot-mobile.png`; all live routes matched. |
| F-5-2 | Added `release-workflow` to `.factory/claims.json` and tagged the workflow test. It asserts the `v*` trigger, both Mac architectures, Windows, and Linux. | Test `@claim:release-workflow starts both Mac architectures, Windows, and Linux from a v* tag`; release run 33286832663 passed all five jobs; live `v0.1.7` release contains all platforms. |
| F-5-3 | Replaced `Use CSV now` with `Use the CSV in a spreadsheet`. | Test `keeps review 5 wording concrete and consistent`; `live-landing/screenshot-desktop.png`; live old/new phrase scan. |
| F-5-4 | Replaced `No account scraping` with `The app does not sign in to your tracker`. | Same review-5 wording test; `live-landing/screenshot-desktop.png`; live old/new phrase scan. |
| F-5-5 | Replaced `Unmapped fields are reported` with `Unrecognized fields appear in conversion notes`. | Same review-5 wording test and `@claim:lossy-fields`; `live-landing/screenshot-desktop.png`; live phrase and Fiber checks. |
| F-5-6 | Replaced README `cannot map` with `the app does not recognize`. | Test `keeps review 5 wording concrete and consistent`; README clean-clone scan; live product behavior covered by Fiber import. |
| F-5-7 | Replaced README `unmapped field values` with `original field values`. | Same wording test and `@claim:lossy-fields`; README clean-clone scan; live JSON preserved Fiber. |
| F-5-8 | Rewrote the README boundary as `does not track meals, require an account, store food data on a server, or give medical advice`. | Same wording test plus `@claim:privacy-no-account` and `@claim:validation-notes`; `live-privacy/screenshot-desktop.png`; live privacy audit. |
| F-5-9 | Replaced `platform-specific open step` with `steps to open the app on your system`. | Same wording test; README clean-clone scan; live release-notes link resolved to `v0.1.7`. |
| F-5-10 | Replaced `Rust is needed only for the desktop shell` with `Rust is needed only to build the desktop app`; the project map now says `desktop app code`. | Same wording test; README clean-clone scan; clean-clone Tauri build tests passed. |

## Final verification

- Clean clone: `/tmp/food-log-polish5.bXFqCQ/repo`, commit `b39d3a2`.
- All 22 exact commands from `.factory/claims.json` passed independently.
- `npm test`: 24 unit tests and 49 browser tests passed; four desktop-project
  skips are the mobile-only checks that passed in the mobile project.
- `npm run build`, `npm run build:app`, and
  `cargo test --manifest-path src-tauri/Cargo.toml` passed. The largest final
  production script is 38.67 kB raw / 13.71 kB gzip.
- The worker URL verifier passed `/`, `/?demo=1`, `/app`, `/privacy`, and
  `/terms` without console, structure, image-alt, or button-name errors.
- The final cold live audit passed 14 route/viewport combinations with zero
  serious or critical Axe findings. It also passed demo reset, exit, storage,
  request-boundary, export, offline, lossy-field, focus, copy, payment, 404,
  and published-download checks.
- Final mobile Lighthouse: 100 Performance, 100 Accessibility, 100 Best
  Practices, and 100 SEO; LCP 1.79 s, CLS 0, TBT 0 ms.
- Final static deployment: `74ae6625-8d6d-41bb-9e07-026a086bdada`.
- GitHub Actions release run `33286832663` passed both macOS builds, Windows,
  Linux, and checksums. Release `v0.1.7` has 11 assets. The downloaded
  AppImage passed its published SHA-256 check.

No review finding remains open.
