# Independent verification 2 — FAIL

Verified 2026-08-28 UTC.

- Candidate: `439bb2419fe5f767fe3d9f0a18b272ba03ddf284`
- Live URL: `https://food-log-export-kit.sociobot.in`
- Contract: the supplied researched brief and work order, `AGENTS.md`, `.factory/brief.json`, `.factory/design.md`, and the attached factory skills
- Result: **FAIL — do not release this candidate**

The repaired conversion, licensing, accessibility, deployment, PWA, and release artifacts passed their checks. The required one-line installer is broken, however, and the claims manifest remains incomplete. Both violate the supplied acceptance contract.

## Release-blocking findings

### High — the shipped Unix installer cannot find any release asset

Fresh execution of the candidate script failed before downloading anything:

```text
$ sh public/install.sh
Desktop downloads are still being published.
exit 1
```

This is also the exact live script: local and `https://food-log-export-kit.sociobot.in/install.sh` both have SHA-256 `14a28d86cd824c1364b2a5fbbffac218711aca39e0a24503f23803a74cee315b`.

The latest release is present and contains the expected AppImage, DEB, DMGs, MSI/EXE, `SHA256SUMS`, and `latest.json`. The failure is in the installer parser. GitHub currently returns lines such as:

```json
"browser_download_url": "https://github.com/..."
```

The `sed` expression in `public/install.sh` only accepts `"browser_download_url":"..."` with no whitespace. It therefore finds zero asset URLs. There are two further contract problems in the same script:

- It downloads into the current directory rather than installing or placing an executable on `PATH`.
- On macOS it selects the first `.dmg` without checking `uname -m`; the current release lists the arm64 DMG before the x64 DMG, so an Intel Mac would receive the wrong build after the JSON parser is repaired.

The landing page's direct Linux release link works, and a downloaded DEB passed its checksum and launch smoke test. That fallback does not make the required one-line installer functional.

### High — public promises are missing from the mandatory claims manifest

`.factory/claims.json` exists and all ten listed commands pass, but it does not list every claim-like statement on the live pages and README as required by the supplied claims contract. Examples include:

- Privacy page: “Demo data uses memory only and is discarded when you leave the demo.” No tagged claim test checks storage namespace isolation or discard-on-exit.
- Privacy page: “The app does not add analytics or tracking.” The `local-only` test checks only for cross-origin requests during one demo flow; it does not list or directly test this separate promise.
- Hero/app: “No account,” “The free app handles one file at a time,” and “CSV and JSON export stay free.” These are not declared as claims with tagged tests of the unlicensed state.
- Landing page: the detected-platform download is presented as available, but there is no claim entry protecting release discovery, asset availability, checksum verification, or installation.
- README: the app “normalizes meal, recipe, nutrition, and weight fields.” No tagged claim asserts all four record classes; the sample contains meals and a weight but no recipe record.

The README also states, “Each product statement and its browser test is listed in `.factory/claims.json`.” That statement is not true for the examples above. Independent checks found several of the behaviors currently work, but the acceptance contract explicitly requires them to be listed and exercised on every build.

## First-read and demo gate

**PASS.** A cold 1440 × 900 load answers the required questions within the first screen:

- What: “Save your food history.”
- For whom: “For calorie tracker users who need years of meals and recipes in files they control.”
- First action: “Try it with sample data,” with “Review 12 entries, then export both files.” beside it.

The three plain facts cover uploads, accounts, and price. One click opens `/demo`, already populated with 12 realistic records. The persistent banner says “Demo — sample data, nothing is saved” and exposes **Reset demo** and **Start for real**. Reset restored 12 records; **Start for real** opened an empty `/app` workspace.

## Claims gate

The candidate was checked out as a detached clean worktree at the exact commit and installed from `package-lock.json`. Every command in `.factory/claims.json` was then run separately through the documented demo entry point.

| Claim | Result | Independent evidence |
|---|---|---|
| `csv-export` | PASS | Download contained the declared header and 12 data rows. |
| `json-archive` | PASS | Parsed format version 1 with 12 records and an issues array. |
| `local-only` | PASS | Demo review and export produced only same-origin requests. |
| `format-import` | PASS | Tagged test exercised comma, semicolon, tab, and JSON inputs. |
| `explained-drops` | PASS | Broken file and unusable row were both named in notes and JSON. |
| `validation-notes` | PASS | Impossible date, grouped comma number, and negative number were explained. |
| `batch-import` | PASS | Two valid files combined with a token-bound cached license. |
| `license-restore` | PASS | Fresh-device paste and verification produced licensed state. |
| `paid-purchase` | PASS | Live endpoint returned 303 to `checkout.dodopayments.com/session/cks_…`. |
| `offline-reload` | PASS | A service-worker-controlled demo reloaded offline with all 12 records. |

The claim gate passes for the claims that are present. The missing claim entries above remain release-blocking under the acceptance contract.

## Clean checkout, tests, and builds

| Gate | Result |
|---|---|
| `npm ci --include=dev` | PASS; lockfile install, 0 audit findings |
| `npm test` | PASS; 10 unit tests and 25 browser tests passed, 2 expected project-specific skips |
| `npm run build` | PASS; TypeScript check and exact production site build emitted `dist/site/` |
| `npm run build:app` | PASS; TypeScript check and desktop frontend emitted `dist/app/` |
| JavaScript lint | No lint script is present |
| `cargo fmt --manifest-path src-tauri/Cargo.toml -- --check` | PASS |
| `cargo test --locked --manifest-path src-tauri/Cargo.toml` | PASS; native and doc targets, no Rust test cases defined |
| `cargo clippy --locked --manifest-path src-tauri/Cargo.toml -- -D warnings` | PASS |
| `CI=false npm run tauri -- build --no-bundle` | PASS; optimized native binary produced |
| Native binary smoke test | PASS; local and released DEB binaries stayed running under Xvfb until the 8-second verifier timeout; only headless EGL warnings appeared |

The Linux GTK/WebKit packages declared by the release workflow were installed before rerunning the native gates.

## End-to-end and boundary evidence

- Normal demo: 12 entries across four days rendered. CSV contained 12 data rows; JSON contained 12 records and all normalized fields.
- Demo isolation: localStorage was empty on direct demo entry. Reset restored the sample, and leaving demo opened a zero-record real workspace.
- Valid input/recovery: after an empty CSV produced a specific `role=alert` error, a valid CSV with a leap-day date, quoted comma, Unicode, and notes imported successfully and removed the error.
- Numeric/date boundaries: `2025-99-99`, `1,234`, `-5`, `12,34,56`, and `not-a-number` produced five explicit notes; the original impossible date was retained in the record notes.
- Mixed licensed batch: `broken.csv` plus a valid file produced one valid record and a named file-level issue in both the UI and exported JSON.
- Large history: 5,000 rows imported and rendered in 2.9 seconds with all 5,000 DOM rows present and no console/page error.
- License replacement: a fresh invalid URL token was stripped from the URL, sent once to the Sociobot verify endpoint, stored locally, and did not show licensed state.
- No sign-in is present or required. Library/CLI consumer packaging is not applicable to this desktop/PWA product.

## Live deployment, privacy, and server behavior

The deployed site matches the candidate production build byte-for-byte. `index.html`, `sw.js`, all JavaScript chunks and source maps, and CSS all had identical local/live SHA-256 hashes. Key hashes:

- `index.html`: `ef9a3716e99bf516ede38b9a94dd126c9a96184d0bd680245a99e6cc8982c0a3`
- `sw.js`: `1809ba11704d1e2448076ca9baa82ad73a2aab3b8df9457989b2568f2178b9e7`
- primary JavaScript: `c6620cdbdf2f6a95877d9de398d5a89b7f34f0375c7aea225d114f7959369f47`
- CSS: `8e841b3349562010243611561a94b021f347667aa63a2ead287e5c0ad6f49cf2`

Request logs showed:

- `/demo` through both exports: same-origin requests only.
- `/app` import, validation, and mixed-batch flows: same-origin requests only.
- Landing page: same-origin static assets plus the disclosed GitHub release API request; no analytics, third-party scripts, or remote fonts.
- License verification: only the token was sent to `api.sociobot.in`; no food data accompanied it.

Known routes had no console or uncaught page errors. The designed unknown route returned HTTP 404 and rendered correctly; Chromium emitted its expected failed-document console line for that intentional 404 response.

Live responses include CSP with `frame-ancestors 'none'`, HSTS, `nosniff`, strict-origin referrer policy, and camera/microphone/geolocation denial. HTML and `sw.js` revalidate after 30 seconds. Hashed assets and artwork use one-year immutable caching. The verify API returned `cache-control: no-store` and CORS for the product origin.

Rate limiting is enforced on the server-side license endpoint: one client received 30 HTTP 200 responses; request 31 returned HTTP 429 with `Retry-After: 1` and `X-RateLimit-After: 1`. The checkout endpoint independently returned HTTP 303 to hosted Dodo checkout.

## Accessibility, mobile, PWA, and performance

- The factory `verify-url.sh` passed: HTTP 200, title, `lang=en`, one `h1`, one `main`, all images with alt text, no unlabeled buttons, and no console/page errors.
- Fresh axe scans on `/`, `/demo`, `/app`, `/privacy`, `/terms`, and the designed 404 found zero serious or critical violations at 390 × 844. The repository suite also checked desktop.
- Every visible mobile link and button measured at least 44 × 44 CSS pixels. All tested routes had no horizontal overflow.
- Keyboard activation of **Load sample data** exposed both export actions. Focus used a visible 3 px amber outline with 3 px offset. No trap was observed.
- At 200% page scale, the 390 px demo retained its main content and heading without document-width overflow.
- With reduced motion requested, animation and transition durations were reduced to 0.01 ms; no looping motion was present.
- Service worker `/sw.js` controlled scope `/`, `registration.update()` completed, cache `food-log-export-kit-v3` was active, and offline reload retained all 12 sample records with an offline status and no errors.
- Chromium reported no web-app installability errors for the manifest.
- Production initial JavaScript is 15.9 KB gzip total; CSS is 5.9 KB gzip; there are no web fonts; the mobile hero is 14.4 KB.
- Fresh mobile Lighthouse: Performance 97, Accessibility 100, Best Practices 100, SEO 100; FCP 1.0 s, LCP 1.1 s, TBT 190 ms, CLS 0, Speed Index 1.1 s, total transfer 86 KiB.

## Desktop release evidence

GitHub release `v0.1.1` contains macOS arm64/x64 DMGs, Windows MSI/EXE, Linux AppImage/DEB/RPM, app tarballs, `SHA256SUMS`, and `latest.json`. The manifest has non-empty URLs for macOS, Windows, and Linux.

A fresh AMD64 DEB matched the published checksum:

`f56254d7f7c5f8a00ef67b40727d3ac225aa9d7abe938f234697e310c327c8cc`

The tag targets `e9b69cfc7ec70158c347a4a32065d8a2a3cd5452`. Its product source is identical to candidate `439bb24`; candidate-only differences are factory handoff/graph metadata. The live web build also matches the candidate byte-for-byte as shown above.

## Required before re-verification

1. Replace the shell-script JSON scraping with a real JSON parser or a whitespace-tolerant implementation; select macOS assets by architecture; install to an appropriate location or document a safe one-command result; test the live script end to end.
2. Inventory every public claim in the landing page, app, privacy/terms pages, README, and demo documentation. Add each to `.factory/claims.json` with exactly one tagged observable test, or remove/merge the unsupported wording.
3. In particular, add claim tests for demo storage isolation/discard, no analytics, unlicensed single-file behavior/free exports, the supported normalized record types, and detected-platform release/install availability.
