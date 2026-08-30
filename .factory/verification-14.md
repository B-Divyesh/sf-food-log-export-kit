# Verification 14 — FAIL

- **Candidate:** `d449a5c411d2ad0d139de19d4575d419ec09065c`
- **Live URL:** <https://food-log-export-kit.sociobot.in>
- **Verified:** 2026-08-30 UTC

**Decision:** **FAIL — do not accept this desktop-app candidate.**

## Release blockers

### High — the live candidate has no direct desktop download

The live site is a byte-for-byte deployment of candidate `d449a5c…`, but its
published desktop release is bound to ancestor `6f4bb7f…`. The candidate's
source guard therefore rejects the release and withholds every detected-system
download.

- A normal production build at `d449a5c…` matched live `/` and the live entry
  script byte-for-byte. SHA-256 values were
  `c7c0237695656b078ed1f726523f7f52e29286d9f7729f457d51c3b3e272163f`
  for `index.html` and
  `a8ed3d08dede84c63b6f4ae8419373559d15ea96126c40793c0386be99274a92`
  for `/assets/index-B1PKH3GG.js`.
- The live script contains candidate identity `d449a5c411d2ad0d139de19d4575d419ec09065c`.
- GitHub's live `v0.1.7` Release API reports `target_commitish`
  `6f4bb7f207528aa36ed7e1a2e8f13ace474f4066`. The annotated tag peels to
  the same older commit. Both `latest.json` and the `SHA256SUMS` provenance
  header also name `6f4bb7f…`.
- Fresh Linux, Windows, Apple Silicon, and Intel Mac browser contexts all saw
  **Downloads are being published**, a generic Releases-page link, and no
  direct asset link.
- `6f4bb7f…` and `d449a5c…` differ in product/build files including
  `src/build.ts`, `vite.config.ts`, both public installers, and the release
  workflow. This is not merely an untracked workspace difference.

The existing claim coverage masks the problem: `playwright.config.ts` forces
the test site identity to `6f4bb7f…`, while `@claim:candidate-installers`
explicitly defines that older commit as the candidate. Those tests pass, but
they do not test the requested or deployed candidate. This violates the
desktop-app requirement that the landing page's detected-platform action link
to a real candidate asset.

The old release itself is intact. It has arm64/x64 DMGs, MSI/EXE, AppImage,
DEB, RPM, `latest.json`, and `SHA256SUMS`. A fresh download of the smallest
asset, `Food.Log.Export.Kit_0.1.7_x64-setup.exe`, matched its published SHA-256
`1ea2edbc7e24701e6e7bb2fb1ac79cf97e410de62aff140c311150ea6652216e`.
The live Unix installer independently downloaded and verified the 77 MiB
AppImage at SHA-256
`bc0882f2f3c09e87eef36c98dacd28b37ae87e6a577d6bbcfd51802c7ff69ecd`;
it stayed running through an eight-second Xvfb smoke (`timeout` exit 124).
That proves the older package works, but it does not fix candidate identity or
the missing landing-page download.

### Medium — a required claim interaction failed intermittently

The first complete `npm test` run produced 27/27 passing Vitest tests, then
49 passing Playwright tests, four expected desktop-project skips, and one
failure in `@claim:demo-discard`. After clicking **Recipes**, the button had
focus but the UI remained at **12 shown** instead of **0 shown** until the
five-second assertion timed out. This is a failure of a required claim test
and therefore release-blocking under the work order.

A focused rerun passed, a second full `npm test` passed (50 passed, four
skipped), and a two-worker 20-repeat stress run passed 20/20. The low observed
rate makes this an intermittent interaction or test-isolation defect, not a
consistently reproducible converter failure.

## Other findings

### Medium — record-filter state is not exposed to assistive technology

The **All entries**, **Meals**, **Recipes**, and **Weights** controls act as a
single-choice filter and visibly mark one button with `.selected`, but none
has `aria-pressed` or `aria-selected`. Live inspection before and after
choosing Recipes returned both attributes as `null`, even though the visible
count changed to **0 shown**. A screen reader cannot determine which filter is
active. This misses the supplied name/role/state accessibility baseline.

### Medium — required payment legal copy is incomplete

The landing page says Sociobot opens checkout hosted by Dodo, and `/terms`
states the price and licensed feature. Neither page states that Sociobot/Dodo
is the merchant of record or that refunds are handled there, as required by
the supplied paid-unlock contract.

## Required claims and first-read gate

`.factory/claims.json` exists with 23 entries. After `npm ci`, every exact
listed command passed individually from the candidate checkout:

`csv-export`, `json-archive`, `local-only`, `format-import`,
`explained-drops`, `lossy-fields`, `validation-notes`, `batch-import`,
`license-restore`, `paid-purchase`, `offline-reload`, `demo-discard`,
`privacy-no-account`, `free-behavior`, `normalized-types`, `revoked-license`,
`detected-platform-downloads`, `verified-installer`, `windows-installer`,
`license-request-data-boundary`, `static-hosting`, `release-workflow`, and
`candidate-installers`.

The initial pre-install invocation could not find `vitest`; `npm ci` installed
the locked dependencies (67 packages, zero reported vulnerabilities), after
which the complete exact claim list ran successfully. The stale candidate
constant described above means the installer-related claims are not valid
acceptance evidence for `d449a5c…`.

The cold first-read gate passes. The first screen says **Save your food
history**, identifies food-tracker users with years of meals and recipes, and
shows **Try it with sample data** beside the result: review 12 entries, then
download CSV and JSON. One click opens the populated, isolated demo.

## Build and automated checks

| Check | Fresh result |
| --- | --- |
| `npm ci` | Passed; 67 packages, zero reported vulnerabilities. |
| All 23 exact claim commands | Passed individually after install. |
| First `npm test` | Failed: 49 browser tests passed, 4 skipped, `@claim:demo-discard` failed; unit tests passed 27/27. |
| Second `npm test` | Passed: 27/27 unit and 50/50 executed browser tests; 4 expected skips. |
| Claim stress | `@claim:demo-discard` passed 20/20 with two workers. |
| `npm run build` | Passed TypeScript and Vite; produced `dist/site/`. |
| `npm run build:app` | Passed TypeScript and Vite; produced `dist/app/`. |
| `cargo test --manifest-path src-tauri/Cargo.toml` | Passed after installing the workflow's GTK/WebKit packages; the crate contains zero Rust tests. |
| `CI=1 npm run tauri build` | Passed; produced AppImage, DEB, and RPM bundles. |

No separate lint command exists. Initial JavaScript is 17,048 bytes gzip in
total, CSS is 6,103 bytes gzip, and the mobile hero is 14,420 bytes. These are
within the 200 KiB JS, 50 KiB CSS, and 300 KiB hero budgets.

## Independent end-to-end and live evidence

- `/demo` loaded 12 records: 11 meals, zero recipes, one weight, and four
  dates. CSV contained one header plus 12 data rows; JSON parsed with 12
  records. Recipe filtering and Reset demo worked in the live audit.
- Empty CSV, damaged JSON, header-only CSV, and unknown-heading CSV each gave
  a specific recovery instruction. A valid replacement immediately recovered
  to a populated review. Zero and `999999999` calorie boundary values remained
  readable. No console or page errors occurred.
- Keyboard traversal began at the skip link. Every tested focus outline was a
  visible 3 px amber ring. Enter loaded sample data and Enter on **Export CSV**
  downloaded `food-log.csv`.
- At 390×844 there was no horizontal overflow, every visible link/button was
  at least 44 px in both dimensions, and the named sample record fit in the
  first viewport. At 200% page scale, the H1 stayed visible with no horizontal
  overflow. Reduced-motion mode had a maximum computed duration of 0.00001 s.
- Axe on `/`, `/demo`, `/app`, `/privacy`, `/terms`, and a real 404 found zero
  serious/critical violations on desktop; the repository suite also passed
  those scans at 390 px. `/opt/fleet/lib/verify-url.sh` passed all five public
  product routes with correct title/lang, one H1, one main landmark, image
  alternatives, labeled buttons, and no console errors.
- The service worker was active and controlling `/demo`; an offline reload
  kept all 12 records and showed **You are offline**. The stale-worker update
  regression passed in the full suite.
- The live app has no sign-in or account flow, so Entra tenant validation is
  not applicable.

## Privacy, network, headers, and throttling

- The complete live demo/export flow made same-origin requests only. There
  were no cookies, remote scripts, analytics, or tracking. The landing page's
  only external request was the disclosed GitHub release-metadata request.
- With realistic sample food data loaded, live license verification sent one
  GET to the Sociobot product endpoint with only the harmless test token in
  the query string, no request body, and no food terms.
- A fresh single-client verification probe received normal `200` invalid-token
  JSON on requests 1–30. Request 31 and later returned `429`; the first
  `Retry-After` was `3`. Observed allowance: **30 requests per client window**.
- The checkout endpoint returned `303` to
  `https://checkout.dodopayments.com/session/...`.
- HTML and service-worker responses use
  `Cache-Control: public, must-revalidate, max-age=30`. Hashed JS/CSS and art
  use `public, max-age=31536000, immutable`.
- Live responses include HSTS, `nosniff`, strict-origin referrer policy,
  camera/microphone/geolocation denial, and a restrictive CSP with
  `frame-ancestors 'none'` and only the documented GitHub and Sociobot connect
  origins.
- Live mobile Lighthouse scored performance 97, accessibility 100, best
  practices 100, and SEO 100. FCP was 0.9 s, LCP 1.8 s, TBT 180 ms, CLS 0,
  and total transfer was 89,014 bytes.

## Scope

No product code, deployment, infrastructure, secrets, or unrelated services
were changed. The supplied worktree already contained modified and untracked
`graphify-out/` files; they were not staged or altered intentionally. Only
this report and the required handoff update are verifier changes.
