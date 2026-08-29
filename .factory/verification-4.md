# Independent verification 4 — PASS

Verified 2026-08-29 UTC.

- Candidate: `d37c582574f2e9984cd1b487dda125ca7131e727`
- Live URL: <https://food-log-export-kit.sociobot.in>
- Contract: the supplied researched brief and work order, `AGENTS.md`, `.factory/brief.json`, `.factory/design.md`, and the attached factory skills
- Result: **PASS — this candidate meets the release contract.**

No release-blocking, high, medium, or low product defect was found in this verification.

## Mandatory first-read and demo gate

**PASS.** A cold 1440 × 1000 browser load answers all three questions on the first screen:

- What: “Save your food history.”
- For whom: “For calorie tracker users who need years of meals and recipes in files they control.”
- First action: “Try it with sample data,” immediately followed by “Review 12 entries, then export both files.”

The same content and action are above the fold at 390 × 844. One click opens `/demo` with 12 realistic records already visible. The persistent banner says “Demo — sample data, nothing is saved” and provides **Reset demo** and **Start for real**. Starting for real opens an empty `/app` workspace.

## Claims gate

The clean clone initially contained no installed packages. After the lockfile install, every exact command in `.factory/claims.json` was run independently. All 18 passed. The manifest contains 18 unique IDs, each ID has exactly one `@claim:<id>` test, and no test tag is absent from the manifest.

| Claim | Result | Fresh observable evidence |
| --- | --- | --- |
| `csv-export` | PASS | Download contained the declared header plus 12 data rows. |
| `json-archive` | PASS | Download parsed as the versioned archive with 12 records and conversion-note fields. |
| `local-only` | PASS | Direct `/demo` through both exports requested only the product origin. |
| `format-import` | PASS | Comma, semicolon, tab, and JSON fixtures all normalized. |
| `explained-drops` | PASS | An invalid file and unusable row were both named in conversion notes. |
| `validation-notes` | PASS | Missing/impossible dates and unreadable, grouped, decimal-comma, ambiguous, and negative values were explained without advice. |
| `batch-import` | PASS | Two files combined under a token-bound cached valid verdict. |
| `license-restore` | PASS | A pasted token and recorded valid response restored batch state. |
| `paid-purchase` | PASS | The public endpoint returned HTTP 303 to `checkout.dodopayments.com/session/...`. |
| `offline-reload` | PASS | A service-worker-controlled demo reloaded offline with all 12 records. |
| `demo-discard` | PASS | Reset restored the sample; leaving demo exposed an empty real workspace and untouched storage. |
| `privacy-no-account` | PASS | No account UI, cookies, storage writes, remote scripts, analytics, trackers, or cross-origin app requests. |
| `free-behavior` | PASS | Unlicensed selection was single-file and both CSV and JSON exports remained available. |
| `normalized-types` | PASS | Meal, recipe, nutrition, and body-weight fields were present in the normalized archive. |
| `revoked-license` | PASS | A replacement token did not reuse another token’s cached verdict and revoked state stayed locked. |
| `detected-platform-downloads` | PASS | Recorded Linux, Windows, Apple Silicon, and Intel Mac profiles selected their matching published assets. |
| `verified-installer` | PASS | Recorded Linux and both Mac architectures selected, checksummed, installed, and launched their matching artifacts. |
| `windows-installer` | PASS | The real PowerShell script ran under PowerShell 7.6.5 with a fake checksummed MSI, stable destination, launch capture, and bad-checksum rejection. |

## Clean build and automated gates

| Gate | Result |
| --- | --- |
| `npm ci` | PASS — 66 packages installed; audit reported 0 vulnerabilities |
| `npm audit --audit-level=high` | PASS — 0 vulnerabilities |
| `npm test` | PASS — 13 unit tests and 35 browser tests; three intentional desktop-project skips for mobile-only checks |
| `npm run build` | PASS — TypeScript check and exact production site build emitted `dist/site/` |
| `npm run build:app` | PASS — TypeScript check and desktop frontend emitted `dist/app/` |
| `npx tsc --noEmit` | PASS |
| JavaScript lint | No lint command is configured |
| `cargo fmt --manifest-path src-tauri/Cargo.toml -- --check` | PASS |
| `cargo test --locked --manifest-path src-tauri/Cargo.toml` | PASS — native and doc targets; no Rust test cases are defined |
| `cargo clippy --locked --manifest-path src-tauri/Cargo.toml -- -D warnings` | PASS |
| `CI=false npm run tauri -- build --no-bundle` | PASS — optimized native binary produced |
| Native binary smoke | PASS — stayed running under Xvfb for the eight-second timeout; only headless EGL acceleration warnings appeared |
| Factory `verify-url.sh` | PASS — HTTP 200, title/lang/main, one `h1`, alt text, button labels, and zero console/page errors |

The Rust commands required the same GTK/WebKit development packages declared by `.github/workflows/release.yml`; after installing those verifier-host prerequisites, all native gates passed.

## Independent product exercise

- Normal demo: 12 records rendered. CSV had 13 lines including its header; JSON had 12 records.
- Invalid input and recovery: an unknown two-column CSV produced a specific `role=alert` error. A valid replacement then imported without reloading the page.
- Boundaries: `2025-02-29`, decimal comma `1,5`, negative protein, ambiguous `12,34,56`, and `oops` each produced a precise conversion note. The impossible original date was retained in record notes.
- Large archive: 5,000 rows imported and rendered in 1.353 seconds in this run, with 5,000 DOM rows and no page error.
- Keyboard: Tab reached **Load sample data**; its focus style was a visible 3 px amber outline. Enter loaded the sample and exposed both export buttons. No trap appeared.
- History routing: the Privacy link updated URL/title and focused its `h1`; browser Back restored the landing route and title.
- Demo privacy: direct `/demo` through CSV and JSON export made only three same-origin requests (document, JS, CSS), set no cookies, and left `localStorage` empty.
- No sign-in exists or is required, so Entra tenant validation is not applicable. Library/CLI consumer packaging is not applicable to this Tauri desktop/PWA product.
- AI is not useful to the deterministic local conversion job and would conflict with the privacy goal; no missed AI leverage was found.

## Live deployment, privacy, headers, and rate limit

All 27 deployable files in `dist/site/` match the live deployment byte-for-byte. `staticwebapp.config.json` is deployment configuration and is intentionally not publicly served. The live site therefore matches the candidate production build.

Browser-read response headers on `/`, `/demo`, `/privacy`, `/terms`, `/sw.js`, and hashed assets include the declared CSP, HSTS, `X-Content-Type-Options: nosniff`, strict-origin referrer policy, and camera/microphone/geolocation denial. CSP allows only self plus the documented GitHub release API and Sociobot billing API. HTML and `sw.js` revalidate after 30 seconds; hashed assets and artwork use one-year immutable caching. An unknown route returns the designed page with HTTP 404. Chromium reports the expected failed-document 404 message for that intentional URL; no product script or subresource error occurred.

The only cold landing-page cross-origin request was the documented public GitHub release lookup. Direct app/demo conversion made no cross-origin request. There are no third-party scripts, remote fonts, analytics, or trackers.

The license endpoint returned 200 for requests 1–30 from one client. Request 31 returned HTTP 429 with `Retry-After: 2` and `X-RateLimit-After: 2`. The observed allowance is **30 requests per client window**. A recovered 200 response had `Cache-Control: no-store` and CORS restricted to the product origin. Checkout returned HTTP 303 to the hosted Dodo session.

## Accessibility, mobile, PWA, and performance

- Fresh axe scans of `/`, `/demo`, `/app`, `/privacy`, `/terms`, and the not-found page found zero serious or critical violations at desktop and 390 px.
- Every route had `lang="en"`, one `h1`, one `main`, a route-specific title, and no horizontal overflow.
- Visible mobile links and buttons met the 44 px target requirement. The one 1 × 1 file input is intentionally visually hidden and activated by its labeled 44 px button.
- The browser suite passed 200% page scale. Reduced-motion mode reduced animation and transition durations to 0.01 ms, with no looping motion.
- Service worker scope is `/`; `registration.update()` completed, cache `food-log-export-kit-v4` was active, and `/demo` reloaded offline with 12 rows plus “You are offline.”
- Chrome reported no web-app installability errors for the manifest.
- Initial JavaScript is 16,329 bytes gzip total; CSS is 5,908 bytes gzip; no web fonts ship; the mobile hero is 14,420 bytes.
- Fresh mobile Lighthouse: Performance 97, Accessibility 100, Best Practices 100, SEO 100; FCP 1.1 s, LCP 1.9 s, TBT 160 ms, CLS 0, Speed Index 1.3 s, total transfer 86 KiB.
- Social artwork is a real 1200 × 630 WebP. The repository includes the documented original prompt/provenance and optimized derivatives.

## Desktop release and installers

GitHub release `v0.1.2` contains 11 assets: Linux AppImage/DEB/RPM, Windows MSI/EXE, Apple Silicon and Intel DMGs/app archives, `SHA256SUMS`, and valid `latest.json` platform URLs.

A fresh run of the deployed `install.sh`, constrained to temporary install directories, selected `Food.Log.Export.Kit_0.1.2_amd64.AppImage`, installed a launcher, and verified SHA-256:

`5de0492cd920c52ef73121e564dbcb5ccea7318baa872000d306cb9a5122ce21`

The installed launcher stayed running under Xvfb for the expected eight-second smoke timeout. The live and candidate `install.sh` hashes are both `c31b713998747f2cf039333b699f9ab2b600351a79e90c39acf551d780928518`.

The release tag targets `c3f918bd1aea5a6bf765a39112ac7698a37c1349`. Its packaged-app source is unchanged in this candidate. Later differences are verification/docs/graph metadata, the separately deployed Windows installer script, its regression fixture/test, and the workflow step that runs that test.

## Remaining operator notes

- macOS and Windows artifacts are unsigned. The README and release page state this clearly.
- Source trackers can change export headings. Unknown formats fail with a named, recoverable error; users should retain their source export.
