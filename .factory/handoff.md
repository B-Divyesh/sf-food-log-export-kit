# Handoff — verification 12

## Result: FAIL — release blocked

**Candidate:** `1a202dc7385b41d0d1a854d704f4bea6f672c7fc`
**Live URL:** <https://food-log-export-kit.sociobot.in>
**Verified:** 2026-08-30 UTC

The local-first food archive itself passes its demo, import/export, privacy,
PWA, accessibility, mobile, bundle, deployment-match, and published-installer
checks. It must not be accepted because the live Sociobot paid endpoints are
unavailable: checkout and 35 synthetic license verification requests returned
HTTP 503. The required `@claim:paid-purchase` test now fails reproducibly
(expected Dodo 303, got 503), and rate-limit enforcement cannot be verified.

## What passed

- `npm ci`; all 22 `.factory/claims.json` commands passed individually after
  install. The clean clone's pre-install attempts all stopped at the expected
  missing `vitest` dependency.
- `npm run build` and `npm run build:app`; initial JS is 16.93 kB gzip and CSS
  is 6.10 kB gzip.
- Direct live demo: 12 sample records, CSV/JSON export, isolated banner/reset,
  no cookies/localStorage, and no cross-origin food-data requests. Offline
  reload and the service-worker update regression passed.
- Live desktop/mobile/keyboard/reduced-motion checks, `verify-url.sh`, and Axe
  found no supported-route console errors or serious/critical violations.
- Five candidate/live hashes (HTML, JS, CSS, service worker, manifest) match.
  Release `v0.1.7` has all platform artifacts; its downloaded DEB matches
  `SHA256SUMS`, and its product-source diff to this candidate is empty.

## Blocking defect

**F12-1 — Critical: Sociobot checkout/license API returns 503.**

`GET /api/v1/products/food-log-export-kit/checkout` must return 303 to a Dodo
checkout but returns 503. `/verify` likewise returned 503 for 35 invalid
synthetic tokens, so no 429 or `Retry-After` could be observed. Restore the
registered billing product, prove checkout's 303 redirect, and prove the
per-client rate limit with a 429 plus `Retry-After`; then rerun every claim and
the full `npm test` suite.

## Verification details

See `.factory/verification-12.md` for exact commands, timestamps, headers,
test results, no-code-change environment limitation for a native Linux build,
and the full acceptance evidence.

## How to run after repair

```sh
npm ci
npm test
npm run build
npm run build:app
CI=false npm run tauri -- build --no-bundle
```

Use <https://food-log-export-kit.sociobot.in/demo> for the isolated sample.
The published installers are unsigned; future signed releases require the
owner-managed `APPLE_CERTIFICATE` and `WINDOWS_CERT_PFX` secrets.
