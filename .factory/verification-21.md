# Independent verification 21 — FAIL

**Candidate:** `adb500d0a89cd022d8aacae6d7430b4aad88b14a` (`main`)

**Live URL:** <https://food-log-export-kit.sociobot.in>

**Verified:** 2026-09-02 UTC

## Verdict

**FAIL — do not release this candidate.** The core local importer, one-click
demo, exports, privacy boundary, accessibility, PWA behavior, production build,
and native build checks pass. Release identity does not: the deployed site is
candidate `adb500d…`, while release `v0.1.21` and every published desktop
installer are bound to `c68cbed…`. The mandatory `candidate-installers` claim
fails, the live landing page suppresses its platform download, and the live
Unix installer exits before downloading. A failing declared claim is
release-blocking under the acceptance contract.

## First-read and demo gate

I opened the live landing page cold at 1440 × 900 before interacting with it.
The first viewport answers the required questions in plain words:

- **What:** “Save your food history,” with CSV and JSON named beside the main
  action.
- **For whom:** “For food tracker users who need years of meals and recipes in
  files they control.”
- **First action:** **Try it with sample data**, followed by “Review 12 sample
  entries, then download a CSV and JSON archive.”

One click opened `/?demo=1` with 12 realistic entries already visible. The
persistent banner says “Demo — sample data, nothing is saved” and provides
**Reset demo** and **Start for real**. The sample exported a 13-line CSV
(header plus 12 records) and JSON with 12 records. Screenshots are in
`.factory/qa-artifacts/first-read-desktop.png` and
`.factory/qa-artifacts/live-mobile.png`. This mandatory gate passes.

## Findings

### High / release-blocking — desktop releases are not bound to the candidate

Fresh public evidence disagrees at the source-commit boundary:

```text
deployed release-identity.json source_commit:
adb500d0a89cd022d8aacae6d7430b4aad88b14a

GitHub v0.1.21 target_commitish:
c68cbed9be960ee9757db2b186a70642edf91054

latest.json, build-info.json, and SHA256SUMS source_commit:
c68cbed9be960ee9757db2b186a70642edf91054
```

The clean claim command
`npm run test:unit -- --testNamePattern @claim:candidate-installers` failed on
that exact expected/received difference. The landing page consequently shows
“Downloads are being published” instead of an operating-system download.
Running the public one-line Unix installer in isolated temporary install
directories exited 1 with:

```text
The published download does not match this app version.
```

The published Windows setup EXE itself downloaded successfully, and its
SHA-256 was
`18ea8c3b291fae4f827dbc293ee040bb762f872a7362d2d971e6c0605fae5cdb`,
matching `SHA256SUMS`. That proves artifact integrity, but the checksum file
also identifies the older `c68cbed…` source. Candidate and release differ only
in factory handoff/graph files, but the declared claim and installer contract
require the exact candidate commit, not runtime equivalence with an ancestor.

Required repair: publish a new version tag from the final candidate commit,
let the tagged workflow publish all platform artifacts and deploy the
tag-built site, then rerun `@claim:candidate-installers` and the live installer.

### Medium — the copy audit is not an exact audit of the current README

`.factory/copy-audit.md` says it contains every README sentence, but its
release section still records the older single sentence “Then run the
candidate-installers claim before deploying…”. The README now contains the
separate `npm run release:site` refusal statement and a deploy-then-run-claim
statement. Neither current sentence appears in the audit. No sentence-length
or banned-word problem was observed, but the required audit is stale.

## Claims gate

From detached clean clone
`/tmp/food-log-export-kit-verify-21.BDuXdz` at the exact candidate, `npm ci`
completed with zero reported vulnerabilities. Every command in
`.factory/claims.json` was then run separately as written.

| Result | Claims |
| --- | --- |
| PASS | `csv-export`, `json-archive`, `local-only`, `format-import`, `explained-drops`, `lossy-fields`, `validation-notes` |
| PASS | `batch-import`, `license-restore`, `paid-purchase`, `offline-reload`, `demo-discard`, `privacy-no-account`, `free-behavior` |
| PASS | `normalized-types`, `revoked-license`, `detected-platform-downloads`, `verified-installer`, `windows-installer` |
| PASS | `license-request-data-boundary`, `static-hosting`, `release-workflow`, `site-source-commit`, `release-preflight` |
| **FAIL** | `candidate-installers` — deployed source `adb500d…` does not equal release source `c68cbed…` |

The manifest has 25 unique IDs, and the repository check confirming one
focused tagged test per ID passed. Landing and README claims map to the
manifest. The copy-audit defect above concerns the plain-words evidence file,
not a missing claim test.

## Clean build and automated checks

- `CI=1 npm test`: **FAIL**, with 42/43 unit tests passing; the sole failure is
  `@claim:candidate-installers`. Because the npm script chains with `&&`, its
  Playwright phase correctly did not start after that failure.
- `CI=1 npm run test:e2e`: **PASS**, 58 passed and 4 desktop-project skips.
  Those four checks are mobile-only and passed in the 390 px project.
- `npm run build`: **PASS**, producing `dist/site/` after `tsc --noEmit`.
- `npm run build:app`: **PASS**, producing `dist/app/` after `tsc --noEmit`.
- No separate lint script exists. `npm audit --audit-level=high` reported zero
  vulnerabilities.
- Initial JS totals 50.09 kB raw / 17.36 kB gzip. CSS is 23.48 kB raw /
  6.10 kB gzip. The mobile hero is 14.42 kB. All are below the budgets.
- `npm run native:prereqs`, `cargo fmt --check`, locked `cargo test`, and locked
  Clippy with `-D warnings`: **PASS** after installing the documented local
  GTK/WebKit packages.
- `CI=false npm run tauri -- build --no-bundle`: **PASS**, producing a 13 MB
  x86-64 release executable.

## End-to-end product evidence

- Live `/app` rejected `broken.csv` with an announced error naming the missing
  food/weight heading. Selecting a valid one-row CSV immediately afterward
  recovered to `Private stew`, and CSV export contained the header plus that
  record.
- Claim tests cover comma, semicolon, and tab CSV; JSON record lists; meal,
  recipe, nutrition, and body-weight fields; impossible/ambiguous dates;
  unreadable, grouped, decimal-comma, and negative numbers; unknown-field
  preservation; mixed usable/unusable rows; free single-file import; licensed
  multi-file import; restore/revocation; and both output formats.
- Direct demo import/export used only same-origin requests. A landing-to-demo
  flow additionally called only the disclosed public GitHub release API.
  Live `/app` import/recovery/export made zero post-load requests. No cookies,
  food-data uploads, analytics, remote scripts, console errors, page errors,
  or local-storage writes were observed in those fresh contexts.
- The license boundary test confirms that verification sends only the token.
  A fresh live client received 200 for requests 1–30; requests 31–35 returned
  429 with `Retry-After: 4`. Observed allowance: **30 requests per client
  window**.
- The product has no sign-in, so the Entra External ID check is not applicable.

## Accessibility, PWA, headers, and performance

- Fresh live Axe scans found zero serious/critical issues on `/`, `/demo`,
  `/app`, `/privacy`, and `/terms` at 1440 × 900 and 390 × 844.
- Each tested route had one `h1`, one `main`, and no horizontal overflow.
  Keyboard Tab first reached the skip link with a 3 px amber focus outline.
  The complete suite passed keyboard sample/export, 44 px mobile targets,
  200% scale, history focus restoration, and heading/title/canonical checks.
- Reduced-motion mode limited computed animation/transition duration to
  `0.00001s`.
- The live v9 service worker was activated with no waiting worker. `/demo`
  reloaded offline with the 12 sample records and its offline status. The
  controlled v5-to-v9 update regression also passed.
- `/`, `/demo`, `/app`, `/privacy`, and `/terms` return 200; an unknown route
  returns 404. HTML and `sw.js` use 30-second revalidation. Hashed JS is cached
  for one year as immutable.
- Headers include HSTS, `nosniff`, strict-origin referrer policy, a restrictive
  CSP with `frame-ancestors 'none'`, and disabled camera, microphone, and
  geolocation.
- Mobile Lighthouse: **97 Performance, 100 Accessibility, 100 Best Practices,
  100 SEO**; FCP 1.0 s, LCP 1.2 s, CLS 0, TBT 200 ms, interactive 1.4 s.
- Candidate/live byte comparison checked 28 publicly served production files;
  all matched. `staticwebapp.config.json` correctly returned 404 because it is
  hosting configuration rather than a public asset. The main JS SHA-256 is
  `2fcebdcbfe7008bacee30a3220c75f46660a90e62e8ffcdc3130ee71d36bb059`;
  the service-worker SHA-256 is
  `b0c99ddce50589fc02ff51d0af8251da5b6c44bea58fabc5c07d20aaae4c2043`.

## Defects by severity

- **High / release-blocking:** deployed candidate and published desktop
  release have different source commits; the declared claim fails and live
  installation is intentionally disabled.
- **Medium:** `.factory/copy-audit.md` is stale relative to the current README.
- **Critical:** none.
- **Low:** none.
