# Independent verification — FAIL

Verified 2026-08-28 UTC.

- Candidate: `dbb818e819288931c0f1ff1cfff94c8894deb24b`
- Live URL: `https://food-log-export-kit.sociobot.in`
- Contract: `.factory/brief.json`, the supplied researched brief, `AGENTS.md`, and the attached factory skills
- Result: **FAIL — do not release this candidate**

The site and downloads are deployed, the core single-file demo works, and the automated suite passes. Purchase is unavailable in production, however, and independent tests found silent batch loss, a token-cache flaw, and invalid timeline data reported as clean. Those failures conflict with the paid-unlock and preservation job.

## First-read gate

**PASS.** A cold 1440 × 900 browser load answered all three required questions in the first screen:

- What: “Save your food history.”
- For whom: “For calorie tracker users who need years of meals and recipes in files they control.”
- First action: “Try it with sample data,” next to “Review 12 entries, then export both files.”

One click opened `/demo`. The first demo screen already contained 12 realistic entries and showed the persistent “Demo — sample data, nothing is saved” banner with **Reset demo** and **Start for real**.

## Release-blocking findings

### Critical — the advertised paid purchase is unavailable

`GET https://api.sociobot.in/api/v1/products/food-log-export-kit/checkout` returned HTTP 404 with:

```json
{"error":"enabled factory product","status":404}
```

Both the landing page and app advertise a $19 license and link to this endpoint. A new customer cannot buy the batch feature. This is fresh production evidence, not an inference from the earlier handoff.

### High — one bad file in a licensed batch is silently omitted

In a fresh local `/app` context with the cached licensed state used by the shipped claim test, I selected two files together: an invalid `broken.csv` followed by a valid one-row `good.csv`. The result said:

- “1 entries are ready”
- “1 source file · No conversion notes”
- “Every imported row was explained.”

Neither the invalid filename nor its “No food or weight column” error appeared. The export contained only the good file. `readFiles()` stores the exception in `state.error`, but the populated review panel does not render that error (`src/app.ts:115–130`). This is silent loss in the paid migration path.

### High — the cached license verdict is not bound to the license token

Starting with token `known-valid` and a fresh cached valid verdict, I opened `/app?license=obviously-invalid-replacement`. The app stored the replacement token, made **zero** `/verify` requests, and still showed “Licensed.” The verdict cache stores only `{valid, checked}` and is reused for any token (`src/license.ts:16–45`). This can incorrectly grant batch access and can also reject a newly pasted valid token while a recent invalid verdict is cached.

### High — impossible ISO dates are accepted as clean timeline data

Importing this representative boundary row:

```csv
Date,Food,Calories,Protein
2025-99-99,Impossible date,"1,234",-5
```

produced “No conversion notes” and “Every imported row was explained,” displayed `2025-99-99`, counted it as one day, displayed calories as `1.234`, and displayed protein as `-5 g`. The ISO-shaped date is returned without calendar validation (`src/importer.ts:40–52`). At minimum, impossible dates must be flagged before users rely on timeline order. Locale-formatted numbers also need an explicit interpretation or note.

### High — claims coverage does not satisfy the claims contract

All seven declared commands pass after `npm ci`, and each ID occurs in exactly one tagged browser test. The declared `format-import` claim includes tab delimiters, but its tagged test exercises only semicolon CSV and JSON (`tests/e2e/claims.spec.ts:45–53`); no test asserts tab import. I independently confirmed tab import currently works, but the claim is still not protected by its required test.

The page also makes claim-like statements absent from `.factory/claims.json`, including “Missing dates and unreadable numbers appear as notes,” “License works on your devices,” and the operability of the $19 purchase. The first of these is contradicted by the impossible-date result above, and the purchase is contradicted by the live 404.

## Other findings

### Medium — mobile touch targets fall below the 44 px contract

At 390 px, the page had no horizontal overflow and axe found no serious/critical violations. Several visible targets were still under 44 px high: header navigation was 40 px, the app Privacy link was 18 px, the paid button was 40 px, and footer links were 18 px. This fails the supplied accessibility and design baseline even though automated axe does not flag it.

### Medium — unknown routes return HTTP 200

`/missing-page` renders the designed not-found screen, but the live document response is HTTP 200. The SPA fallback handles the request before the configured 404 response override, so this is not a real HTTP 404 route.

## Claims gate

The clean checkout had no installed dependencies, so `npm ci` was required. After that lockfile install, every exact command from `.factory/claims.json` passed:

| Claim | Result | Observable evidence |
|---|---|---|
| `csv-export` | PASS | Download had the expected header plus 12 data rows. |
| `json-archive` | PASS | JSON parsed as the versioned format with 12 records and issue fields. |
| `local-only` | PASS | Demo import/export request log contained no cross-origin request. |
| `format-import` | PASS, coverage gap | Tagged test passed semicolon CSV and JSON; independent probe passed tab CSV. The tagged test omits tab. |
| `explained-drops` | PASS for one mixed file | One unusable row appeared in conversion notes. Licensed multi-file failure remains silent. |
| `batch-import` | PASS for two valid fixtures | Two cached-license fixtures produced two sources. |
| `offline-reload` | PASS | Service-worker-controlled demo reloaded with 12 entries while offline. |

Commands run individually:

```sh
npm test -- --grep @claim:csv-export
npm test -- --grep @claim:json-archive
npm test -- --grep @claim:local-only
npm test -- --grep @claim:format-import
npm test -- --grep @claim:explained-drops
npm test -- --grep @claim:batch-import
npm test -- --grep @claim:offline-reload
```

## Build and automated gates

| Gate | Result |
|---|---|
| `npm ci` | PASS; 66 packages installed, 0 vulnerabilities |
| `npm audit --audit-level=high` | PASS; 0 vulnerabilities |
| `npm test` | PASS; 7 unit tests, 20 browser tests, 1 intentional desktop-project skip of the mobile-only case |
| `npm run build` | PASS; emitted `dist/site/` |
| `npm run build:app` | PASS; emitted `dist/app/` |
| TypeScript | PASS through both builds (`tsc --noEmit`) |
| `cargo fmt --manifest-path src-tauri/Cargo.toml -- --check` | PASS |
| `cargo test --locked --manifest-path src-tauri/Cargo.toml` | PASS; native targets and doc tests, no Rust test cases defined |
| `cargo clippy --locked --manifest-path src-tauri/Cargo.toml -- -D warnings` | PASS |
| `CI=false npm run tauri -- build --no-bundle` | PASS; optimized binary at `src-tauri/target/release/food-log-export-kit` |
| Native launch smoke test | PASS; remained running for 8 seconds under Xvfb until the verifier timeout, with no app error |

The first Rust attempt correctly identified missing verifier-host GTK/WebKit packages. After installing the same Linux dependencies declared in the release workflow, all native gates passed.

## End-to-end and boundary evidence

- Normal demo: 12 entries across four days rendered; CSV and JSON downloaded and parsed.
- Supported formats: comma CSV, semicolon CSV, tab CSV, and JSON worked.
- Invalid input: an unknown two-column CSV produced a plain alert and a subsequent valid import recovered successfully.
- Dropped row: a valid plus unusable row in one file produced one record and one explanatory note.
- Batch mixed validity: failed as described above.
- Large history: 5,000 CSV rows imported and rendered in about 1.6 seconds with all 5,000 table rows present.
- Demo isolation: fresh `/demo` used no localStorage data for records and made only same-origin requests.
- Authentication: not applicable; the product requires no sign-in.
- Library/CLI consumer installation: not applicable; this is a desktop/PWA product.

## Live deployment, privacy, and security

The live deployment matches the candidate web build byte-for-byte:

| File | SHA-256 |
|---|---|
| local and live `index.html` | `588441f721734f114a7e5a9929227f30ef58f13d7e3e5e565ef776b2300e456b` |
| local and live `sw.js` | `3d9458405bf43d3c47a85832de795f6cae43962ba69b7559488d74ef84ad0c5f` |
| local and live primary JS | `9e02b819c4cc840f2ceed48e685610d09773019dc13ab68b850630abc7915891` |
| local and live CSS | `c136a0ebb46389d387071fa89576cbfacf1be15bf77fbf70cbe4818f264b06d7` |

Fresh Playwright request logs showed:

- `/demo` through CSV export: only `https://food-log-export-kit.sociobot.in`.
- `/app`, `/privacy`, `/terms`, and the not-found UI: same-origin only.
- Landing page: one disclosed request to `https://api.github.com` for current release metadata; no analytics or trackers.
- No console errors or uncaught page errors on tested live routes.

Live HTML responses include CSP, HSTS, `X-Content-Type-Options: nosniff`, `Referrer-Policy`, and `Permissions-Policy`. HTML and `sw.js` revalidate after 30 seconds. Hashed JS/CSS and artwork use `public, max-age=31536000, immutable`.

Billing API allowance was enforced. In a rapid single-client sequence, 30 verification requests returned 200 and the 31st returned 429 with `Retry-After: 3` and `X-RateLimit-After: 3`. A later request from the product origin returned `Access-Control-Allow-Origin: https://food-log-export-kit.sociobot.in`. The verify endpoint returns `cache-control: no-store`.

## Accessibility, keyboard, mobile, and motion

- Live axe scans at desktop and 390 px found no serious or critical violations on `/`, `/demo`, `/app`, `/privacy`, `/terms`, and the not-found UI.
- Every tested route had `lang="en"`, one `<main>`, one `<h1>`, and a route-specific title.
- Keyboard activation of **Load sample data** exposed both export buttons.
- Tab focus used a visible 3 px amber outline; no keyboard trap was observed.
- The 390 px landing and app had zero horizontal overflow.
- Reduced-motion mode reduced all animation and transition durations to 0.01 ms and nothing looped.
- Remaining touch-target failures are listed above.

## PWA and performance

- Live service worker scope: `/`; active and controlling after online reload.
- `registration.update()` completed; cache `food-log-export-kit-v2` was active.
- Offline reload preserved the 12 demo entries and showed “You are offline,” with no console/page error.
- Production bundle: about 15.4 KB gzip JS total, 5.85 KB gzip CSS, no web fonts, 14.4 KB mobile hero.
- Fresh Lighthouse mobile: Performance 98, Accessibility 100, Best Practices 100, SEO 100; LCP 1.2 s, CLS 0, TBT 150 ms, Speed Index 1.4 s, total transfer 81 KiB.

## Desktop release evidence

GitHub release `v0.1.0` contains macOS arm64/x64 DMGs, Windows MSI/EXE, Linux AppImage/DEB/RPM, app tarballs, `SHA256SUMS`, and valid `latest.json` URLs for all three platforms. A fresh AMD64 DEB download matched its published checksum:

`97295437f107d32f1eac1e9699ea1b94a92e135006af253d5ecc91681c0e6821`

The release API reports target commit `e6f4d2c33265ae546175bb2283aff1dcc105c5d1`; candidate `dbb818e` differs from that commit only in `.factory/handoff.md`. Product source is unchanged, and the current live web files match the candidate build exactly.

## Required before re-verification

1. Register/enable the live billing product and prove checkout reaches hosted Sociobot/Dodo checkout.
2. Preserve and display an error/note for every failed file in a batch; never claim every row was explained when a file was skipped.
3. Bind cached license verdicts to the exact token (or token hash) and reverify whenever the token changes.
4. Validate ISO calendar dates and define supported numeric locale rules; add recovery tests.
5. Complete `.factory/claims.json` and tagged tests for every public claim, including tab input and paid-purchase behavior.
6. Raise all mobile interactive targets to at least 44 × 44 CSS px and return a true 404 status for unknown routes.
