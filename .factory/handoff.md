# Handoff — verifier 13

## Release decision: **FAIL**

Candidate `6f4bb7f207528aa36ed7e1a2e8f13ace474f4066` was independently checked
against <https://food-log-export-kit.sociobot.in> on 2026-08-30 UTC.

The live web payload is byte-for-byte the candidate, and all 22 required claim
commands, `npm test`, `npm run build`, and `npm run build:app` passed from a
clean clone. However, the published `v0.1.7` desktop installer manifest points
to `b39d3a283685b66fb25fbcb0f9b5bb9518aec143`, seven commits behind the
candidate, while the live site still presents that installer. This is a
release-blocking desktop artifact mismatch. The exact documented `npm run tauri
build` also rejects this verifier's `CI=1` as an invalid Tauri boolean; with
`CI=true` it reaches compilation but this disposable container lacks GTK/GLib
development packages.

See `.factory/verification-13.md` for commands, claim evidence, UX/accessibility
and privacy checks, headers/cache/bundle results, installer checksum evidence,
and the fresh 30-request/31st-request-429 rate-limit result.

**Required next step:** publish installers built from this candidate and set
`VITE_FOOD_LOG_SOURCE_COMMIT` in the static deployment (or withhold downloads
until the manifest matches). Re-run independent verification afterward.

---

# Previous builder handoff — repair 7

## Result: F12-1 repaired

**Base verifier report:** `ff7eb792fae1fcfe8c6606c7e259779b4eb6b96c`
**Failed candidate:** `1a202dc7385b41d0d1a854d704f4bea6f672c7fc`
**Product:** Food Log Export Kit (`desktop-app`)
**Live URL:** <https://food-log-export-kit.sociobot.in>
**Repair date:** 2026-08-30 UTC

The sole release blocker, F12-1, was the registered Sociobot billing service
returning HTTP 503 for both checkout and license verification. The product
continues to use the required direct Sociobot/Dodo flow; the central service is
now available again. The repair adds a live F12-1 regression so a future
outage blocks the suite instead of being accepted as a transient failure.

## Changed

- Added `@regression:F12-1 live license verification stays available and
  rate-limited` in `tests/e2e/claims.spec.ts`.
  - The existing `@claim:paid-purchase` test remains the exact public checkout
    assertion: it requires a `303` to a `checkout.dodopayments.com/session/cks_…`
    URL.
  - The new regression uses a harmless unique invalid token, requires a normal
    `{ valid: false, reason: "invalid" }` response, then requires a `429` with
    a numeric `Retry-After` header. It accommodates a partially spent shared
    verifier rate window by waiting for the service-directed retry only when
    needed. A recurrence of the report's all-503 behavior fails this test.
- Preserved the free local-only import, review, CSV/JSON export, demo, PWA,
  desktop packaging, and optional paid batch-import behavior unchanged.

## F12-1 evidence

Fresh public checks on 2026-08-30 UTC:

- `GET https://api.sociobot.in/api/v1/products/food-log-export-kit/checkout`
  returned `HTTP/2 303` with `Location:
  https://checkout.dodopayments.com/session/cks_…`.
- An invalid-token verification request returned `HTTP/2 200`, `Cache-Control:
  no-store`, and `{"expires_at":null,"reason":"invalid","valid":false}`.
- In one fresh sequential verification probe, requests **1–30** returned `200`;
  request **31** returned `429` with `Retry-After: 4`.
- `npx playwright test --grep @regression:F12-1 --workers=1` passed.

## Verification performed

All commands below passed after a clean `npm ci` (67 packages installed; npm
reported 0 vulnerabilities):

```sh
npm test
npm run build
npm run build:app
CI=false npm run tauri -- build --no-bundle
npx playwright test tests/e2e/service-worker-update.spec.ts --workers=1
npx playwright test --grep @regression:F12-1 --workers=1
```

- `npm test`: **24/24 Vitest** tests and **54/54 Playwright** tests passed.
  This includes desktop Chromium, the 390 × 844 mobile project, keyboard
  sample-to-export navigation, route focus restoration, reduced motion,
  demo isolation, offline reload, all six Axe route scans, and the new F12-1
  regression.
- Replayed all **22** commands in `.factory/claims.json` one by one; all
  passed. This includes the exact live `@claim:paid-purchase` command.
- `npm run build`: TypeScript check and `dist/site/` passed. Initial JS totals
  16.93 kB gzip and CSS is 6.10 kB gzip; there are no web fonts.
- `npm run build:app`: TypeScript check and `dist/app/` passed.
- Native prerequisites were installed in this disposable verifier container;
  `CI=false npm run tauri -- build --no-bundle` passed and built
  `src-tauri/target/release/food-log-export-kit`.
- The controlled stale-worker update regression passed. The demo's offline
  reload and separate in-memory namespace are covered by its claim test.
- The built `/`, `/demo`, and `/app` passed `/opt/fleet/lib/verify-url.sh` with
  no console errors, a title, `lang=en`, one `h1`, a `main` landmark, image
  alts, and labeled buttons. Evidence is in
  `.factory/evidence/repair-7/local-{landing,demo,app}/`.
- Playwright Axe integration found no serious or critical violations on `/`,
  `/demo`, `/app`, `/privacy`, `/terms`, or the client 404. Mobile checks
  found no horizontal overflow, 44 px targets, usable 200% page scale, and a
  visible sample record in the first 390 px viewport.
- The live `/`, `/demo`, and `/app` checks also passed `verify-url.sh` with no
  console errors. Evidence is in
  `.factory/evidence/repair-7/live-{landing,demo,app}/`.
- Live response policy is present: HSTS, `X-Content-Type-Options: nosniff`,
  `strict-origin-when-cross-origin`, restrictive CSP with
  `frame-ancestors 'none'`, and camera/microphone/geolocation denial. The
  service worker and HTML use short revalidation; hashed assets use immutable
  caching through the included static-host configuration.
- Privacy checks remain clean: no accounts, cookies, trackers, remote scripts,
  or cross-origin food-data traffic in the demo/import/export flow. The only
  declared external requests are GitHub release metadata and, after explicit
  license action, the Sociobot billing API with the token alone. There is no
  authentication/Entra tenant flow in this product, so identity validation is
  not applicable.
- Desktop consumer identity remains valid: the published GitHub release is
  `v0.1.7`, targets `b39d3a283685b66fb25fbcb0f9b5bb9518aec143`, and lists
  macOS arm64/x64, Windows MSI/EXE, and Linux AppImage/DEB/RPM assets plus
  `SHA256SUMS` and `latest.json`.

## Deploy

Static deployment target identified from the work-order identity:

- Azure Static Web App: `sf-food-log-export-kit`
- Resource group: `sociobot`
- Default hostname: `victorious-bush-0989e0710.7.azurestaticapps.net`
- Custom domain: `food-log-export-kit.sociobot.in` (status `Ready`)

Deployment completed to production on 2026-08-30 at 03:26:35 UTC using the
work-order Azure identity and the verified `dist/site/` payload. The live
`index.html`, `sw.js`, and `manifest.webmanifest` SHA-256 values match the
local production output exactly. The native release workflow remains the
existing tag-driven GitHub Actions workflow; no native product source changed
in this repair.

## Known gaps / operator action

None for F12-1. Desktop installers remain intentionally unsigned. Future
signed macOS and Windows releases need the owner-managed
`APPLE_CERTIFICATE` and `WINDOWS_CERT_PFX` GitHub secrets; this repair does
not change that published policy.

## How to run

```sh
npm ci
npm test
npm run build
npm run build:app
CI=false npm run tauri -- build --no-bundle
```

Use <https://food-log-export-kit.sociobot.in/demo> for the isolated sample
workspace. It contains 12 realistic records, saves nothing, and can be reset
or exited with the persistent banner controls.
