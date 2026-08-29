# Independent verification 8 — FAIL

## Candidate and verdict

**FAIL — release blocking.** Verified commit
`096182095d44af37fa03382a9c193c270fa5dce0` against
<https://food-log-export-kit.sociobot.in> on 2026-08-29.

The deployed web/PWA exactly matches the candidate and its conversion flow is
good. The downloadable desktop application does not: its only published release
is an older source revision. A customer following the live desktop download
therefore receives a different app from the candidate that was verified here.

## First read and demo

Cold live landing, without prior state: “Save your food history” says this
turns food tracker history into files for food tracker users who need years of
meals and recipes in files they control. The first action is **Try it with
sample data**, and the adjacent copy says it opens 12 entries and enables CSV
and JSON download. This passes the plain-words and one-click demo requirements.

The live demo showed the persistent “Demo — sample data, nothing is saved”
banner, Reset demo, Start for real, and a named sample record. At 390 x 844 the
record was in the first viewport (y=520.5, height=95), there was zero horizontal
overflow and no visible link/button smaller than 44 px. After service-worker
control, it reloaded offline with the sample and “You are offline”.

## Clean-clone checks and claims

Fresh detached checkout: `/tmp/food-log-export-kit-qa.und2Vp`, at the exact
candidate SHA. `npm ci` succeeded with 0 vulnerabilities.

Every exact command in `.factory/claims.json` passed separately: all 18
`npm test -- --grep @claim:<id>` commands (`csv-export`, `json-archive`,
`local-only`, `format-import`, `explained-drops`, `lossy-fields`,
`validation-notes`, `batch-import`, `license-restore`, `paid-purchase`,
`offline-reload`, `demo-discard`, `privacy-no-account`, `free-behavior`,
`normalized-types`, `revoked-license`, `detected-platform-downloads`, and
`license-request-data-boundary`), plus the exact `verified-installer` and
`windows-installer` `npm run test:unit` commands.

`CI=1 npm test` passed: 20 unit tests and 46 browser tests; four expected
desktop-project skips are the mobile-only cases, which passed in the mobile
project. `npm run build` produced `dist/site`; `npm run build:app` produced
`dist/app`. Initial JS is 13.54 kB gzip and CSS is 6.10 kB gzip.

`cargo test --manifest-path src-tauri/Cargo.toml` was attempted and stopped
before candidate compilation because this disposable image lacks the host
`glib-2.0.pc` development package. That is an environment prerequisite for the
Tauri Linux target, not a source failure; it is not the release finding below.

## Live product, privacy, accessibility, and headers

- Live `/app`: an invalid `Unknown,Columns` CSV showed the stated
  missing-food/weight-column remedy. A subsequent one-row `Tomato soup` CSV
  recovered, and its CSV export contained the expected header plus one row.
- The direct live import/recovery/export flow made only same-origin document,
  JS, and CSS requests; it set no cookies and logged no console/page errors.
  The demo’s complete offline flow also made only same-origin requests. The
  cold landing separately requested the disclosed GitHub release API, and no
  food data was sent to it.
- Axe found zero serious or critical violations on `/`, `/demo`, `/app`,
  `/privacy`, `/terms`, and `/missing-page`. The full browser suite also passed
  keyboard sample/export, visible focus, history focus restoration, 200% zoom,
  touch targets, and reduced-motion checks.
- `verify-url.sh` passed live: HTTP 200, title, `lang=en`, one `h1`, one
  `main`, image alt coverage, labeled buttons, and zero console errors.
- Live HTML and service worker revalidate after 30 seconds; hashed JS/CSS are
  `max-age=31536000, immutable`. Headers include HSTS, `nosniff`, strict-origin
  referrer policy, a restrictive CSP with `frame-ancestors 'none'`, and disabled
  camera/microphone/geolocation.
- The Sociobot license endpoint allowed 30 harmless invalid-token requests from
  one cookie-backed client. Request 31 returned **429** with `Retry-After: 3`
  and `X-RateLimit-After: 3`. Checkout claim coverage observed the required 303
  redirect to Dodo hosted checkout.

## Deployment identity

The candidate's production web output does match live exactly:

| File | SHA-256 (candidate build and live) |
| --- | --- |
| `index-DXXE8Sra.js` | `e2cbdff0db64fc37c73e4c9bcdc16d9e6386749db4f124d7e29ef0f522039e47` |
| `index-CZpZ9wnO.css` | `7046a4ea956176ccbc994f6c4b7af0551d34c436b57c0da5e480ad9d71a75d53` |

## Defects

### Release blocker — published desktop artifacts are not this candidate

The live download resolver selects GitHub release `v0.1.4`. GitHub identifies
that release's target commit as `5b770194cb02e41d70efb114f7e11a1a35f6766c`;
it is an ancestor of the candidate, not the candidate. `git diff
v0.1.4..0961820` includes runtime desktop/frontend files: `src/app.ts`,
`src/pages.ts`, `src/shell.ts`, `src/styles.css`, and `public/404.html`.
For example, the candidate changes the installed app's stage-4 copy from
“Store anywhere” to “Keep both files” and changes the export/archive wording.

The Linux DEB itself is authentic but stale: its published checksum and the
downloaded asset both equal
`5177129fc7f0044d883f1e048848edac4193c0a055b0f876e59180e32994a194`; its
metadata is `food-log-export-kit` 0.1.4 AMD64. Matching a checksum only proves
it is the old release, not that it is the candidate.

**Required repair:** build and publish a new, versioned desktop release from
`096182095d44af37fa03382a9c193c270fa5dce0` (or a descendant), with macOS
arm64/x64, Windows MSI/EXE, Linux AppImage/DEB/RPM, `SHA256SUMS`, and
`latest.json`; then make the live resolver point to that release and verify one
downloaded artifact against the candidate.

