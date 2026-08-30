# Independent verification 12 — FAIL

**Candidate:** `1a202dc7385b41d0d1a854d704f4bea6f672c7fc` (`main`)
**Live URL:** <https://food-log-export-kit.sociobot.in>
**Verified:** 2026-08-30 UTC

## Verdict

**FAIL — release blocked.** The local-first archive workflow, static deployment,
desktop release, PWA, and accessibility checks are in good shape. However, the
live Sociobot billing service returned HTTP **503** for the required checkout
claim and for every synthetic license-verification request. This makes the
advertised $19 batch-import purchase unavailable and prevents verification of
the documented per-client 429/`Retry-After` limit. A transient earlier pass is
not sufficient; a fresh repeat of the exact claim failed reproducibly.

## First read and demo

Cold at 1440 × 900, the landing page says **“Save your food history”**, says it
is **“For food tracker users who need years of meals and recipes in files they
control,”** and offers **“Try it with sample data.”** The adjacent instruction
says the click will review 12 entries and download CSV and JSON. It therefore
passes the plain-words/one-click demo gate.

The click opened the populated workspace. It contained 12 realistic records,
CSV and JSON export controls, and the persistent **“Demo — sample data, nothing
is saved”** banner with **Reset demo** and **Start for real**. Direct `/demo`
export made three same-origin requests, wrote no cookies or localStorage keys,
and produced a 13-line CSV (header plus 12 records).

## Claims and local gates

The clean checkout initially had no installed dependencies, as expected. All
22 declared commands were first attempted verbatim and failed at the common
setup point (`vitest: not found`). After the required `npm ci` (zero reported
vulnerabilities), all 22 exact manifest commands passed individually:

`csv-export`, `json-archive`, `local-only`, `format-import`,
`explained-drops`, `lossy-fields`, `validation-notes`, `batch-import`,
`license-restore`, `paid-purchase`, `offline-reload`, `demo-discard`,
`privacy-no-account`, `free-behavior`, `normalized-types`, `revoked-license`,
`detected-platform-downloads`, `verified-installer`, `windows-installer`,
`license-request-data-boundary`, `static-hosting`, and `release-workflow`.

The later full `npm test` did **not** pass: its 24 Vitest tests passed, but the
Playwright run failed. The mandatory `@claim:paid-purchase` was then rerun
serially and failed again at `tests/e2e/claims.spec.ts:280`: expected checkout
HTTP 303, received **503**. The separately retried mobile touch-target test
passed; the checkout failure is the confirmed persistent failure.

Other local commands:

| Command | Result |
| --- | --- |
| `npm run build` | PASS — TypeScript check and `dist/site/` |
| `npm run build:app` | PASS — TypeScript check and `dist/app/` |
| `npx playwright test tests/e2e/service-worker-update.spec.ts --workers=1` | PASS — controlled stale-worker update regression |
| `CI=false npm run tauri -- build --no-bundle` | Not evaluable in this container — missing system `glib-2.0.pc`; site build completed first. This is an environment dependency failure, not used as a product finding because the published native release was separately checked. |

The initial production JavaScript is 16.93 kB gzip total (largest chunk 13.67
kB); CSS is 6.10 kB gzip; no web fonts load. Both are within the stated static
budgets.

## Independent live checks

- `verify-url.sh` passed `/`, `/demo`, `/app`, `/privacy`, and `/terms`: HTTP
  200, no console errors, title, `lang=en`, one h1, main landmark, image alts,
  and labeled buttons all present.
- Fresh Axe scans on `/`, `/demo`, `/app`, `/privacy`, `/terms`, and the HTTP
  404 returned **zero serious/critical** violations. The 404 itself returned
  404 and has one h1/main; its browser console's expected resource-404 message
  is not present on supported routes.
- At 390 × 844, `/demo` had no horizontal overflow (390 px document width), a
  populated sample record, and visible targets were at least 44 px high. Tab
  navigation reached the skip link, navigation, demo controls, file chooser,
  filters, and exports; each had a 3 px amber focus ring. Reduced-motion mode
  reduced visible movement to 0.01 ms. Offline reload after service-worker
  activation kept the populated demo and showed “You are offline.”
- Direct demo export and import stayed same-origin. There are no remote scripts,
  cookies, or analytics/tracker requests. The cold landing separately requests
  the disclosed GitHub release API to choose a platform download; food data was
  not sent there. There is no sign-in, so Entra tenant validation is not
  applicable.
- Supported live routes send CSP with `frame-ancestors 'none'`, HSTS,
  `X-Content-Type-Options: nosniff`, strict-origin referrer policy, and denied
  camera/microphone/geolocation. HTML/service worker use 30-second
  revalidation; hashed JS/CSS use `public, max-age=31536000, immutable`.
- Fresh candidate/live SHA-256 values matched for `index.html`, `sw.js`,
  `manifest.webmanifest`, `assets/index-C-1B-j1h.js`, and
  `assets/index-CZpZ9wnO.css`. The deployed web application therefore matches
  this candidate.

## Desktop release

GitHub release `v0.1.7` contains macOS arm64/x64 DMGs and app archives,
Windows MSI/EXE, Linux AppImage/DEB/RPM, `SHA256SUMS`, and `latest.json`.
Downloaded `Food.Log.Export.Kit_0.1.7_amd64.deb` SHA-256
`caf6b3d6b3fe5b258cfcc7719a97cd8da774934be482f4d6e20a2f9552319187`
matches `SHA256SUMS`.

The tag resolves to `b39d3a283685b66fb25fbcb0f9b5bb9518aec143`. Its diff to
this candidate is factory evidence/handoff/graph metadata only; no product or
desktop source changed. Combined with the matching static deployment, the
published desktop artifact is attributable to the candidate product source.

## Defects by severity

### Critical — F12-1: live purchase and license service unavailable

**Evidence:** At 2026-08-30 UTC,
`GET https://api.sociobot.in/api/v1/products/food-log-export-kit/checkout`
returned `HTTP/2 503`, HTML `503 Service Unavailable`, instead of the claimed
303 redirect to Dodo. The exact serial `@claim:paid-purchase` test reproduced
the same 503. Thirty-five sequential calls from one cookie-backed client to
`/verify?license=qa-invalid-rate-probe-20260830` also each returned 503.

**Impact:** Visitors cannot purchase the advertised batch-import license or
restore/verify a license. The required server allowance cannot be confirmed:
no request reached a 429 and no response contained `Retry-After`. The observed
allowance for this verification is therefore **not observable**, rather than
the previously reported 30 requests/client window.

**Required repair:** Restore the registered Sociobot product/billing service
and re-run the exact `paid-purchase` claim until it receives a 303 redirect to
`checkout.dodopayments.com`. From one fresh client, then verify the license
endpoint responds normally through its allowance and returns 429 with a
`Retry-After` header once exceeded. Re-run the complete claim manifest and
`npm test` afterward.

## Handoff

Do not ship or mark this candidate accepted until F12-1 is resolved. The free
single-file on-device archive flow remains functional, but the candidate's
claimed paid workflow and required test suite are currently unavailable.
