# Independent verification 11 — PASS

**Candidate:** `aae3b5e119250170ff1e7a1aefcda92663b8996d` (`main`)
**Live URL:** <https://food-log-export-kit.sociobot.in>
**Verified:** 2026-08-30 UTC

## Verdict

**PASS.** The candidate is a usable local-first food-log preservation utility.
All 21 declared claims passed from a clean dependency install, full web and
desktop checks passed, and the live static deployment is byte-identical to the
candidate production build for the checked shell, service worker, installers,
404 files, and hashed JS/CSS assets. No release-blocking defects were found.

## First read and demo gate

I opened the live landing page cold at 1440 × 900 before interacting with it.
The first screen says **“Save your food history”**, names **food tracker users
who need years of meals and recipes in files they control**, and offers **“Try
it with sample data”** with the adjacent outcome “Review 12 sample entries,
then download a CSV and JSON archive.” This satisfies what it does, who it is
for, and what to click first in plain words.

One click opened the populated demo: 12 realistic entries, filters, conversion
review, and CSV/JSON export controls were immediately available. The persistent
banner reads “Demo — sample data, nothing is saved” and includes **Reset demo**
and **Start for real**.

## Claims and local quality gates

`npm ci` completed with zero reported vulnerabilities. Every command declared
in `.factory/claims.json` was run separately, exactly as written, against its
declared demo/sandbox entry point. All 21 passed:

`csv-export`, `json-archive`, `local-only`, `format-import`,
`explained-drops`, `lossy-fields`, `validation-notes`, `batch-import`,
`license-restore`, `paid-purchase`, `offline-reload`, `demo-discard`,
`privacy-no-account`, `free-behavior`, `normalized-types`, `revoked-license`,
`detected-platform-downloads`, `verified-installer`, `windows-installer`,
`license-request-data-boundary`, and `static-hosting`.

Further clean checks passed:

- `npm test`: 23/23 Vitest tests and the full 53-test Playwright run passed
  (four desktop-project mobile-only checks are intentionally skipped and run in
  the mobile project).
- `npm run build` and `npm run build:app`: passed; `dist/site/` and `dist/app/`
  were produced. Initial JS is 49.10 kB raw / 16.93 kB gzip; CSS is 23.48 kB
  raw / 6.10 kB gzip.
- `cargo fmt --manifest-path src-tauri/Cargo.toml -- --check`,
  `cargo test --locked --manifest-path src-tauri/Cargo.toml`, and
  `cargo clippy --locked --manifest-path src-tauri/Cargo.toml -- -D warnings`
  passed after installing the release-equivalent GTK/WebKit development
  packages in this disposable Linux verifier.
- `CI=false npm run tauri -- build` passed after installing the release
  workflow's Linux dependencies (`file`, `patchelf`, GTK/WebKit libraries). It
  produced the Linux DEB, RPM, and AppImage, in addition to the desktop
  executable. There is no separate lint script.

## End-to-end, privacy, and PWA evidence

- Live `/demo` exported a CSV with 13 lines (header plus 12 entries), made only
  same-origin requests, had no cookies/localStorage writes, and had no console
  or page errors. A fresh controlled service-worker context reloaded that demo
  offline with “12 entries are ready” and “You are offline.”
- A live `/app` import of an invalid `Unknown,Column` CSV displayed the
  actionable “No food or weight column was found” error. Reloading and choosing
  a valid `Date,Food,Calories` CSV recovered to one visible `Private stew`
  record. Import/export made zero post-load requests, zero cross-origin
  requests, zero cookies, and zero localStorage writes.
- A live worker update check found an activated v6 worker, no waiting/installing
  worker, and only `food-log-export-kit-v6` in Cache Storage. The full local
  regression additionally passed its controlled v5-to-v6 worker upgrade.
- The published license verifier was exercised with an invalid synthetic token:
  requests 1–30 returned 200; request 31 returned **429** with
  `Retry-After: 2` (subsequent requests also had `Retry-After`). Observed
  allowance: **30 requests per client window**. The app has no sign-in, so
  Entra tenant verification is not applicable.

## Live deployment, accessibility, and release checks

- Live `/`, `/demo`, `/app`, `/privacy`, and `/terms` return 200; the designed
  unknown route returns 404. Headers include CSP with `frame-ancestors 'none'`,
  HSTS, `nosniff`, strict-origin referrer policy, denied camera/microphone/
  geolocation, 30-second revalidation for HTML/worker, and one-year immutable
  caching for hashed assets.
- Candidate and live SHA-256 values matched for `index.html`, `sw.js`,
  `manifest.webmanifest`, `install.sh`, `install.ps1`, `404.html`, `404.css`,
  `assets/index-0jQjMsY5.js`, and `assets/index-CZpZ9wnO.css`.
- Fresh Playwright Axe scans of the live demo at desktop and 390 × 844 mobile
  produced zero serious/critical violations. Both had `lang=en`, one h1, one
  main landmark, no overflow, and no console/page errors. Keyboard Tab first
  reached the skip link with a 3 px amber focus ring; keyboard reached and
  activated the sample demo. Under reduced motion the maximum computed duration
  was 0.01 ms.
- GitHub release `v0.1.6` has both macOS DMGs, MSI, setup EXE, AppImage, DEB,
  RPM, `SHA256SUMS`, and `latest.json`. The downloaded DEB SHA-256
  `4bde0e008f0c453339e85f50be219cd1e2f260a2c52ec983756e21964f698b6c`
  matches `SHA256SUMS`. The release target commit predates this candidate’s
  static-worker/test documentation changes, but `src-tauri/` is unchanged and
  the deployed website itself matches this candidate exactly.

## Defects

None found. No known release-blocking gaps remain.
