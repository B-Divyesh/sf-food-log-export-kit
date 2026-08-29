# Independent verification 7

## Verdict: PASS

Verified candidate `6ca589f6ae918a304f6eec857431e30c95d40055` against
<https://food-log-export-kit.sociobot.in> on 2026-08-29. No release-blocking
defects were found.

## First-read and demo

Cold live landing read: this saves food-tracker history for food-tracker users
who need meals and recipes in files they control. The first action is the
one-click **Try it with sample data** link; it says it will open 12 sample
entries and enable CSV and JSON downloads. This satisfies the plain-words and
demo-entry requirements.

`/demo` showed the persistent “Demo — sample data, nothing is saved” banner,
Reset demo, Start for real, and a named sample record. After service-worker
control, the live demo reloaded offline with the record present and the
“You are offline” state.

## Claims and local checks

From the clean candidate checkout, `npm ci` completed with 0 vulnerabilities.
Every command declared by `.factory/claims.json` passed individually:

- 18 `npm test -- --grep @claim:<id>` commands: `csv-export`, `json-archive`,
  `local-only`, `format-import`, `explained-drops`, `lossy-fields`,
  `validation-notes`, `batch-import`, `license-restore`, `paid-purchase`,
  `offline-reload`, `demo-discard`, `privacy-no-account`, `free-behavior`,
  `normalized-types`, `revoked-license`, `detected-platform-downloads`, and
  `license-request-data-boundary`.
- `npm run test:unit -- --testNamePattern @claim:verified-installer` passed.
- `npm run test:unit -- --testNamePattern @claim:windows-installer` passed.

The full `npm test` passed: 18 unit tests and 44 browser tests; four desktop
project mobile-only cases were intentionally skipped because the matching
mobile project ran and passed them. `npm run build` and `npm run build:app`
passed. `cargo test --manifest-path src-tauri/Cargo.toml` passed after
installing the same Linux packages listed in the release workflow; the Rust
crate has no native test cases, but both library and binary test targets
compiled successfully. The exact Linux production command
`CI=true npm exec tauri build -- --bundles deb` also passed and generated
`Food Log Export Kit_0.1.4_amd64.deb` (3,432,582 bytes).

## Product exercise, privacy, and accessibility

- Live `/app`: an invalid CSV displayed “The file could not be imported” with
  the missing-food/weight-column remedy. Selecting a valid one-row CSV next
  recovered normally and exported a two-line CSV containing the entry.
- Claim coverage independently exercised comma/semicolon/tab CSV and JSON,
  meals/recipes/nutrition/body-weight types, invalid dates and numbers,
  unmapped-field preservation, mixed valid/unusable rows, free single-file
  behavior, licensed batch behavior, license restore/revocation, and both
  archive formats.
- During the real live import/export recovery flow, request logging recorded
  only the document plus same-origin JS/CSS. No food data or console/page
  errors occurred. The cold landing makes one disclosed GitHub API request for
  installer metadata; Privacy names that request. No analytics, tracking, or
  account fields were observed.
- Playwright axe had 0 serious/critical findings on `/`, `/demo`, `/app`,
  `/privacy`, `/terms`, and the 404 route at desktop and 390 x 844 mobile.
  Each page had one `main` and one `h1`; live mobile had 0 horizontal overflow.
  Keyboard sample loading/export, visible focus, 44 px targets, 200% scale,
  heading focus on history navigation, and reduced motion passed in the full
  suite. No console/page errors occurred on product routes. The expected 404
  network console message occurred only while deliberately loading the missing
  route.

## Deployment, headers, performance, and identity

- Candidate production output exactly matched live: every generated JS, CSS,
  and source-map SHA-256 matched, including live `index-tFfH5u6N.js`
  `3fd2a2ed76faeb536fb178ee631f087efac1e7ae543e83cdc9e59daac23eb357`
  and CSS `index-DFSEALGf.css`
  `6271b5be477e1a725982fa91b13d9a04b5eaa7b61dc68e14e754394e5789ac9a`.
  The candidate only changes factory documentation/graph output from the
  `v0.1.4` runtime source, so the published desktop artifact is runtime-equal
  to the candidate.
- `v0.1.4` has macOS arm64/x64, Windows MSI/EXE, Linux AppImage/DEB/RPM,
  `latest.json`, and `SHA256SUMS`. A clean downloaded DEB passed the published
  checksum and reports `food-log-export-kit`, `0.1.4`, `amd64`.
- HTML is cached for 30 seconds; hashed JS/CSS/art/screens are
  `max-age=31536000, immutable`. Initial JS is 13.51 KB gzip and CSS 6.08 KB
  gzip, below the 200 KB/50 KB budgets. Existing same-source live Lighthouse
  evidence reports 100/100 performance, accessibility, best-practices, and
  SEO.
- Live responses supplied HSTS, `nosniff`, strict-origin referrer policy,
  restrictive CSP with `frame-ancestors 'none'`, and camera/microphone/
  geolocation denial. The license endpoint is `no-store`.
- The lone server dependency was rate-tested with a new cookie-backed client
  and harmless invalid tokens: requests 1–30 returned 200; requests 31–35
  returned 429 with `Retry-After` and `X-RateLimit-After` (3 then 2 seconds).
  Observed allowance: 30 requests/client window. Checkout claim test also
  observed the Sociobot endpoint’s 303 redirect to Dodo hosted checkout.

## Defects by severity

None.

## Notes

The first native Cargo attempt failed before compilation because this clean
container did not initially contain `glib-2.0.pc`. This is an environment
prerequisite, not a product defect: the release workflow installs
`libwebkit2gtk-4.1-dev`, `libappindicator3-dev`, `librsvg2-dev`, and `patchelf`.
After installing the documented prerequisites plus GLib development headers,
the native test compiled and passed.
