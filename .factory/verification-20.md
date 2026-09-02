# Independent verification 20 — FAIL

**Candidate:** `6de278a9e1dc177c56b932ac8bf8edff4d36b728` on `main`

**Live URL:** <https://food-log-export-kit.sociobot.in>

**Verified:** 2026-09-02 UTC

## Decision

**FAIL — do not release this candidate.** The deployed website is the requested
candidate, but the downloadable `v0.1.20` desktop release was built from a
different commit. The required installer claim and the aggregate `npm test`
gate fail. The product's own Unix installer consequently refuses to install.

| Severity | Finding | Exact evidence |
| --- | --- | --- |
| Critical | Candidate, deployment, and desktop installers are not one immutable release. | Candidate and live `/release-identity.json` name `6de278a9e1dc177c56b932ac8bf8edff4d36b728`. Peeled tag `v0.1.20`, GitHub release `target_commitish`, `build-info.json`, `latest.json`, `SHA256SUMS`, and all installer records name `133320e0830a501127a2d1150b9cfe3c2155a70a`. `@claim:candidate-installers` fails on that comparison. The landing page shows **Downloads are being published**, and `sh public/install.sh` exits 1 with “The published download does not match this app version.” |
| Low | The required copy audit is stale. | `.factory/copy-audit.md` says it audits release candidate `0.1.17` and records three `0.1.17` strings, while this candidate and live site are `0.1.20`. The current visible copy still meets the measured word limits, but the recorded audit is not for this candidate. |

The tag-to-candidate diff contains only generated `graphify-out` changes, so no
user-facing converter behavior difference was found. That does not satisfy the
desktop release contract: the published source identity is different and the
installer intentionally blocks the download.

## Mandatory claims

The supplied checkout contained pre-existing modified/untracked `graphify-out`
files. To remove that ambiguity, all 25 commands in `.factory/claims.json` were
run independently after `npm ci` from a new detached worktree at the exact
candidate. `git status --short --branch` showed only `## HEAD (no branch)`.

- **Pass (24):** `csv-export`, `json-archive`, `local-only`, `format-import`,
  `explained-drops`, `lossy-fields`, `validation-notes`, `batch-import`,
  `license-restore`, `paid-purchase`, `offline-reload`, `demo-discard`,
  `privacy-no-account`, `free-behavior`, `normalized-types`, `revoked-license`,
  `detected-platform-downloads`, `verified-installer`, `windows-installer`,
  `license-request-data-boundary`, `static-hosting`, `release-workflow`,
  `site-source-commit`, and `release-preflight`.
- **Fail (release-blocking):** `candidate-installers` via
  `npm run test:unit -- --testNamePattern @claim:candidate-installers`.
  Expected tagged source `133320e…`; received deployed source `6de278a…`.

The downloaded 2,301,964-byte Windows setup asset itself matched the SHA-256 in
`SHA256SUMS` (`706bfb9f…dce8c`). Integrity within the stale release is sound;
its relationship to this candidate is not.

## First-read and end-to-end result

The cold first screen passes. It says what the product does (“Save your food
history”), who it serves (“food tracker users who need years of meals and
recipes”), and what to click first (**Try it with sample data**). The adjacent
copy explains that the click opens 12 sample entries for CSV and JSON export.
The action is visible in the first desktop and 390 px mobile viewport.

The one-click live demo opens a populated workspace with the persistent
“Demo — sample data, nothing is saved” banner. Live checks confirmed:

- CSV contained its header and 12 data rows; JSON had format
  `food-log-export-kit` and 12 records.
- Filtering, Reset demo, and Start for real worked. Leaving the demo opened an
  empty `/app` workspace and left a real-storage probe untouched.
- A normal/boundary fixture produced meal, recipe, and weight records plus five
  conversion notes. Impossible dates, unreadable numbers, and negative values
  were explained. An unknown-column file produced a plain recovery message;
  selecting the valid fixture afterward recovered successfully.
- Keyboard-only navigation reached and activated sample loading and CSV export.
  Focus used a visible 3 px amber outline. The skip link was first in tab order.

## Accessibility, responsive behavior, and routes

- Independent live Axe scans of `/`, `/demo`, `/app`, `/privacy`, `/terms`,
  and the designed 404 found **0 serious/critical findings** at 1440 px and
  390 px.
- Every live route had `lang="en"`, one `<main>`, one `<h1>`, and a route-specific
  title. All visible links/buttons were at least 44×44 CSS px.
- No horizontal overflow occurred at either width or at 200% page scale. The
  first named sample record fit in the initial 390×844 demo viewport.
- Reduced-motion emulation reduced the maximum sampled animation/transition
  duration to `0.00001 s`.
- All discovered links resolved as intended: same-origin routes returned 200,
  the designed missing route returned 404, checkout returned 303 to
  `checkout.dodopayments.com`, and the release/Sociobot links returned 200.
- No console or page errors occurred on real routes. Chromium reports the
  expected failed-document console message when deliberately loading the HTTP
  404 route; the designed 404 itself rendered correctly.

## Privacy, network, headers, and rate limiting

During the complete live demo conversion/export/offline flow, every request was
same-origin. There were no cookies, local-storage writes, analytics, remote
scripts, console errors, or page errors. A cold landing additionally requested
only the documented public GitHub release endpoint. A live invalid-license
check sent one GET query containing only the token and no body or food data.

The billing verification endpoint returned 200 for requests 1–30 from one
client, then 429 for requests 31–35 with `Retry-After: 3` and
`X-RateLimit-After: 3`. The observed allowance is therefore 30 verification
requests per client per active window. Checkout returned 303 to Dodo. The
product has no product-controlled backend, account system, server persistence,
or concurrency boundary; Entra sign-in checks are not applicable.

Live responses include HSTS, CSP, `nosniff`, strict referrer policy, and a
camera/microphone/geolocation-denying permissions policy. HTML, the service
worker, and release identity use 30-second must-revalidate caching; hashed JS,
CSS, and art use one-year immutable caching. `/`, `/demo`, `/app`, `/privacy`,
and `/terms` return 200, while `/missing-page` returns 404.

## PWA, performance, and build evidence

- Live offline reload retained the sample and showed “You are offline.”
- A seeded legacy service worker/cache was replaced by the live worker; only
  `food-log-export-kit-v8` remained and the current heading rendered.
- Mobile Lighthouse on the deployed landing page: Performance **93**,
  Accessibility **100**, Best Practices **100**, SEO **100**; LCP **2.1 s**,
  FCP **0.9 s**, TBT **280 ms**, CLS **0**, total transfer **88 KiB**.
- Fresh production output totals **17,360 bytes gzip JS** and **6,098 bytes gzip
  CSS**. The mobile hero is 14,420 bytes. Live main JS/CSS SHA-256 hashes equal
  the fresh candidate build, corroborating the live candidate identity.

Clean-checkout and native results:

- `npm ci` — pass; 66 packages, 0 vulnerabilities.
- `npm test` — **fail**; 41/42 unit tests pass, then the failing unit stage
  prevents the aggregate command from starting Playwright.
- `npm run test:e2e` — pass; 58 passed, 4 desktop-project skips whose checks
  passed in the 390 px project.
- `npm run build` — pass; exact production site build and TypeScript check.
- `npm run build:app` — pass.
- `npm run native:prereqs` — pass after installing the documented system
  packages in the disposable verifier container.
- `cargo fmt --check`, locked `cargo test`, and locked Clippy with
  `-D warnings` — pass.
- `CI=false npm run tauri -- build --no-bundle` — pass; optimized Linux binary
  built. It stayed running for a 10-second Xvfb smoke window (timeout 124), with
  only a virtual-display EGL acceleration warning.

## Required repair

Do not move or overwrite `v0.1.20`. Bump the version, update the stale copy
audit, create a new immutable tag from the final candidate commit, publish all
platform artifacts and manifests from that tag, and deploy the site artifact
from the same workflow run. Then verify that the detected-platform button is a
real asset, both public installers accept the release identity, and the
`candidate-installers` claim plus `npm test` pass from a clean checkout.
