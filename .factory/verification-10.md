# Independent verification 10 — FAIL

**Candidate:** `2ecd8f5f15f4b8fd15d3138c32bd5e9e6df06801` (`main`)
**Live URL:** <https://food-log-export-kit.sociobot.in>
**Verified:** 2026-08-29 UTC

## Verdict

**FAIL.** The core importer/exporter, one-click demo, privacy boundary,
accessibility, release artifacts, and every declared claim passed. The release
is blocked because an existing installed PWA does not update from v0.1.5 to
v0.1.6. It continues serving the old cached HTML and JavaScript even after an
explicit service-worker update and online reload.

A second contract failure remains in the claims inventory: the README makes a
testable hosting assurance that is not listed in `.factory/claims.json`.

## Required first read

I opened the live landing page cold at 1440 × 900 before interacting with it.
The first viewport answers all three required questions in plain words:

- **What:** “Save your food history.” The adjacent action promises a CSV and
  JSON archive.
- **For whom:** “For food tracker users who need years of meals and recipes in
  files they control.”
- **First action:** **Try it with sample data**.

One click opened `/?demo=1`. The resulting first viewport was already populated
with “Oatmeal with blueberries,” “12 entries are ready,” review filters, and
export controls below. The persistent banner says “Demo — sample data, nothing
is saved” and includes **Reset demo** and **Start for real**. This gate passed.

## Findings

### F-10-1 — HIGH / release-blocking — installed PWA clients remain pinned to the previous release

`public/sw.js` is byte-identical in v0.1.5 and v0.1.6:

```text
9de3339dd092619f6c224d2c816a45433b9222699ec5784effdef12af4bfda79
```

Both versions use `const CACHE = 'food-log-export-kit-v5'`. The fetch handler is
cache-first for same-origin requests, including `/`, `/app`, and `/demo`. It
never revalidates a cached response. Because the worker bytes did not change,
the browser does not install a new worker for v0.1.6 and therefore does not
replace the v5 cache.

Fresh reproduction used one persistent Chromium context and one origin:

1. Serve the built v0.1.5 site, register its worker, and reload under worker
   control.
2. Switch the same origin to the candidate v0.1.6 build.
3. Call `registration.update()` and reload while online.
4. Compare with a clean context that bypasses service workers.

Observed result:

```text
before:    Version 0.1.5; /assets/index-Dza6e8mx.js; cache food-log-export-kit-v5
update:    active=activated; waiting=false; installing=false
after:     Version 0.1.5; /assets/index-Dza6e8mx.js; cache food-log-export-kit-v5
serverNow: Version 0.1.6; /assets/index-0jQjMsY5.js
```

The normal current-version offline reload does work, but that does not repair
the update path. Existing users can miss product and security fixes
indefinitely. Change the worker bytes/cache version on every release, or use a
network-first/revalidation strategy for navigation HTML, then add a regression
that installs an old worker and proves the next release becomes active.

### F-10-2 — MEDIUM / release-blocking contract issue — README claim is absent from the claim manifest

README says: “The included hosting config keeps app routes working after reload
and sets security headers, caching, and the 404 response.” This is a concrete,
testable statement. `.factory/claims.json` has no entry for it and therefore no
single `@claim:<id>` test named by the manifest. Related untagged tests exist,
but the attached claims contract explicitly says any unlisted claim on the
landing page or README fails review.

Add a manifest entry and one tagged observable test, or narrow/remove the
sentence. This finding is independent of F-10-1.

## Claims gate and clean-clone checks

A detached clean clone at `/tmp/food-log-verify-10.BkuzPe` was checked out at
the exact candidate SHA. `npm ci` completed with zero audit vulnerabilities.
All 20 exact commands in `.factory/claims.json` passed independently. Every
manifest ID occurs exactly once as a test tag.

| Claim IDs | Result |
| --- | --- |
| `csv-export`, `json-archive`, `local-only`, `format-import` | PASS |
| `explained-drops`, `lossy-fields`, `validation-notes`, `normalized-types` | PASS |
| `batch-import`, `free-behavior`, `license-restore`, `revoked-license` | PASS |
| `paid-purchase`, `license-request-data-boundary` | PASS |
| `offline-reload`, `demo-discard`, `privacy-no-account` | PASS |
| `detected-platform-downloads`, `verified-installer`, `windows-installer` | PASS |

Additional clean-clone results:

- `npm test`: 23/23 Vitest tests passed; 48/48 applicable Playwright tests
  passed. Four desktop-project skips have passing mobile-project counterparts.
- `npm run build`: passed and produced `dist/site/`.
- `npm run build:app`: passed and produced `dist/app/`.
- TypeScript checking runs inside both build commands and passed. No separate
  lint script exists.
- `npm audit --audit-level=high`: zero vulnerabilities.
- `cargo fmt --manifest-path src-tauri/Cargo.toml -- --check`: passed.
- `cargo test --locked --manifest-path src-tauri/Cargo.toml`: passed.
- `cargo clippy --locked --manifest-path src-tauri/Cargo.toml -- -D warnings`:
  passed after installing the native GTK/WebKit packages used by the release
  workflow.
- Site build output: 49.10 kB raw initial JavaScript across four chunks
  (16.93 kB gzip) and 23.48 kB CSS (6.10 kB gzip).

## End-to-end and edge cases

- Live demo exported CSV with 12 data rows and JSON with 12 records.
- A real `/app` import of `private-food.csv` showed `Private stew`, exported
  JSON, and made no request after page load.
- An invalid CSV showed “No food or weight column was found” with a next step.
  Selecting a valid CSV recovered to a visible `Tomato soup` row. A populated
  `Fiber` field appeared in conversion notes and was covered by the JSON
  preservation claim.
- The full claim suite exercised comma, semicolon, and tab CSV; JSON array and
  wrapper forms; missing/impossible dates; grouped, decimal-comma, ambiguous,
  unreadable, and negative numbers; unusable rows/files; all normalized record
  types; free and licensed behavior; restore; and revocation.
- Current-version service-worker control and offline reload passed with the
  named sample record and “You are offline.” An explicit no-change
  `registration.update()` left the current worker activated without errors.

## Privacy, security, rate limiting, and payments

- A fresh `/demo` request log contained only the document and same-origin JS
  and CSS. CSV/JSON export caused zero requests, cookies, or localStorage writes.
- A real user-file import/export on `/app` caused zero post-load requests,
  cross-origin requests, cookies, localStorage writes, console errors, or page
  errors.
- The cold landing requested only same-origin assets and the disclosed public
  GitHub releases API. There are no remote scripts or fonts.
- Live responses include CSP with `frame-ancestors 'none'`, HSTS, `nosniff`,
  strict-origin referrer policy, and denied camera/microphone/geolocation.
- HTML and `sw.js` use 30-second revalidation. Hashed JS/CSS and art use
  one-year immutable caching.
- A valid-shaped license verification request sends a GET query token only.
  The API returns `Cache-Control: no-store` and CORS for the product origin.
- Fresh rate-limit test from one client: requests 1–30 returned 200; request 31
  and later returned 429. The first 429 had `Retry-After: 3`; later responses
  also carried `Retry-After` and `X-RateLimit-After`. Observed allowance: 30
  requests per client window.
- The live buy endpoint returned 303 to
  `https://checkout.dodopayments.com/session/...`.
- The product does not require sign-in, so Entra tenant verification is not
  applicable.

## Accessibility, responsive behavior, routes, and performance

- `/`, `/demo`, `/app`, `/privacy`, and `/terms` returned 200. The designed
  unknown route returned HTTP 404. Every discovered link returned 200 after
  redirects, except the checkout's intentional redirect and `mailto:` links.
- Desktop and 390 × 844 checks on all six routes found `lang=en`, one `<h1>`,
  one `<main>`, no horizontal overflow, no undersized visible action, no page
  error, and zero axe serious/critical findings. Chromium reports the expected
  main-document 404 as a console network error only on the intentional 404.
- At 200% page scale on a 390 px viewport, the demo retained its heading and
  had zero horizontal overflow. The named sample card remained in the first
  viewport.
- Keyboard Tab first reached the 44 px skip link with a 3 px amber focus ring.
  Keyboard navigation reached **Try it with sample data**, and Enter loaded the
  populated demo.
- With `prefers-reduced-motion: reduce`, the maximum computed animation or
  transition duration was `0.00001s`.
- Fresh mobile Lighthouse: Performance 96, Accessibility 100, Best Practices
  100, SEO 100; FCP 0.9 s, LCP 2.0 s, TBT 200 ms, CLS 0.
- `/opt/fleet/lib/verify-url.sh` passed on all five supported live routes with
  no console/page errors or basic semantic failures.

## Deployment and desktop release identity

- Candidate production asset names exactly match live. SHA-256 matched for
  every JS/CSS asset plus `index.html`, `sw.js`, `manifest.webmanifest`, both
  installer scripts, and the static 404 files.
- Release v0.1.6 points to source
  `d1b3f51c2921df78afe0f9115967da4e90c0eb2f`. Candidate changes after that tag
  affect only factory evidence and generated graph metadata; there is no
  product-file diff.
- The published release has two DMGs, MSI, setup EXE, AppImage, DEB, RPM,
  `SHA256SUMS`, and `latest.json`. Live OS detection selected real v0.1.6 assets
  for Linux, Windows, Intel Mac, and the claim suite covered Apple Silicon.
- Downloaded DEB SHA-256
  `4bde0e008f0c453339e85f50be219cd1e2f260a2c52ec983756e21964f698b6c`
  exactly matched `SHA256SUMS`; package metadata is
  `food-log-export-kit`, version `0.1.6`, architecture `amd64`, with the
  executable and desktop entry present.
- Windows PowerShell was unavailable in this Linux worker; the clean unit
  harness executed the PowerShell installer contract through captured process
  intent, as documented by its claim.

## Defect summary

- Critical: 0
- High: 1 — service-worker update failure (F-10-1)
- Medium: 1 — unlisted README claim (F-10-2)
- Low: 0
