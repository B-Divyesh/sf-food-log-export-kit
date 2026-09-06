# Independent verification 22 — PASS

- **Work order:** `food-log-export-kit-verify-22`
- **Implementation reviewed:** `68cd2a8c899b433776ce0f0a6e9a9cd1fe3b8d25` (`v0.1.22`)
- **Documentation/Graphify baseline:** `071749f3a8124b664ce4b07f88c4f6b9098d715f` (`main` at verification start)
- **Live URL:** <https://food-log-export-kit.sociobot.in>
**Verified:** 2026-09-06 UTC

## Verdict

**PASS — accept the deployed desktop app.** Finding count: **0**. Untested
claim count: **0**. No critical, high, medium, low, or informational product
finding remains.

The later `071749f` commit changes only `graphify-out` files. Live product
identity, the immutable tag, the release, installers, manifests, and the clean
production build all identify implementation `68cd2a8`. Pre-existing modified
and untracked `graphify-out` files were preserved and excluded from this work.

## Job, audience, and first action

I opened the live root in new 1440 × 900 desktop and 390 × 844 phone Chromium
contexts without scrolling.

- **Job:** save food-tracker history as local CSV and JSON files.
- **Audience:** people leaving a food tracker who need years of meals and
  recipes in files they control.
- **First action:** **Try it with sample data**. The adjacent sentence says it
  opens 12 entries and downloads a CSV and JSON archive.

The action is above the fold at both sizes. The page has one `h1`, one `main`,
`lang="en"`, no horizontal overflow, and no console or page errors.

## Demo and real workflow

One click opened `/?demo=1`. The first phone viewport showed the named
**Oatmeal with blueberries** record at y=521–616. The persistent banner says
**Demo — sample data, nothing is saved** and includes **Reset demo** and
**Start for real**.

- The sample contains 11 meals and one weight entry across four days.
- CSV export contained its header plus 12 rows and the oatmeal record.
- JSON parsed as `food-log-export-kit`, contained 12 records, and included an
  issues list.
- Filtering to recipes showed zero records. **Reset demo** restored 12.
- Demo conversion and both downloads made no cross-origin request.
- The only extra local-storage item was cached public release metadata. Demo
  data did not touch license or workspace storage.
- **Start for real** opened an empty `/app` workspace and preserved an
  independent real-storage probe unchanged.

Live normal, invalid, boundary, and recovery checks also passed. An unsupported
CSV named the required headings. Selecting a corrected file recovered to one
`Private stew` record; JSON preserved `Fiber: 9` under `unmapped_fields` and
kept the prior failed-file explanation. A fresh boundary import exposed five
conversion notes and a missing-date label. Import and export made no
cross-origin request.

## Mandatory claims

I cloned the immutable tag with `git clone --no-local --branch v0.1.22`, ran
`npm ci`, and confirmed a detached clean checkout at `68cd2a8`. Every exact
command in `.factory/claims.json` was run separately as written.

| Claim | Result |
| --- | --- |
| `csv-export`, `json-archive`, `local-only`, `format-import` | PASS |
| `explained-drops`, `lossy-fields`, `validation-notes` | PASS |
| `batch-import`, `license-restore`, `paid-purchase` | PASS |
| `offline-reload`, `demo-discard`, `privacy-no-account` | PASS |
| `free-behavior`, `normalized-types`, `revoked-license` | PASS |
| `detected-platform-downloads`, `verified-installer`, `windows-installer` | PASS |
| `license-request-data-boundary`, `static-hosting`, `release-workflow` | PASS |
| `candidate-installers`, `site-source-commit`, `release-preflight` | PASS |

The manifest has 25 unique IDs. Its regression test proves each ID has one
focused command and exactly one tagged test. I compared the live landing page,
Privacy, Terms, README, and current copy audit with the manifest. No missing,
false, partial, or untested public claim was found. AI assistance would not add
an obviously necessary step to this deterministic local conversion job.

## Builds and installed artifact

| Check | Result |
| --- | --- |
| `npm ci` | PASS — 66 packages; zero reported vulnerabilities |
| Every declared claim command | PASS — 25/25 |
| `CI=1 npm test` | PASS — 44 unit and 58 browser tests; four desktop-project mobile checks passed in the mobile project |
| `npm run build` | PASS — produced `dist/site/` |
| `npm run build:app` | PASS — produced `dist/app/` |
| `npm audit --audit-level=high` | PASS — zero vulnerabilities |
| `npm run native:prereqs` | PASS after installing the README-listed GTK/WebKit packages |
| `cargo fmt --check --manifest-path src-tauri/Cargo.toml` | PASS |
| locked `cargo test` | PASS — native and doc targets |
| locked Clippy, all targets, `-D warnings` | PASS |
| `CI=false npm run tauri -- build --no-bundle` | PASS — optimized Linux executable produced |
| Fresh native executable launch | PASS — remained running for the 10-second Xvfb smoke window |

The work-order wrapper said `build command failed`, but no `build.log` exists
in the repository and the failure did not reproduce from the documented clean
setup.

The real live Unix installer was also run with isolated install and app
directories. It downloaded the 80,964,088-byte AppImage, verified it against
`SHA256SUMS`, installed the launcher, and remained running for a 20-second
Xvfb smoke window. Separately, the published 3,435,962-byte DEB matched SHA-256
`ddd23d5c84323514e44e4730596ec9b1e0fcd9631134d92b0239084438fc5027`,
identified package/version/architecture `food-log-export-kit`/`0.1.22`/`amd64`,
and its extracted executable launched after documented prerequisites were
installed.

## Release and live identity

Live `/release-identity.json`, peeled tag `v0.1.22`, GitHub release
`target_commitish`, `latest.json`, `build-info.json`, and the checksum source
header all name `68cd2a8c899b433776ce0f0a6e9a9cd1fe3b8d25`. The release contains
Intel and Apple Silicon macOS artifacts, Windows MSI/EXE, Linux
AppImage/DEB/RPM, `SHA256SUMS`, `latest.json`, and `build-info.json`.

The detected Linux button links to the real `0.1.22` AppImage and its release
notes. I compared every publicly served clean build file except the hosting-only
`staticwebapp.config.json`: **28/28 files matched SHA-256 byte for byte**.

## Accessibility, routes, privacy, and resilience

- Fresh live Axe scans on `/`, `/demo`, `/app`, `/privacy`, and `/terms` at
  desktop and phone sizes found zero serious or critical violations.
- Every route has one `h1`, one `main`, `lang="en"`, its own title, shared
  navigation/footer, and no undersized visible phone target.
- Keyboard Tab starts at the skip link; Enter focuses the heading. Keyboard
  sample loading and filter state work. Back navigation restores focus to the
  landing `h1` after render. Focus is visibly styled.
- At 200% page scale, phone content remains available without horizontal
  overflow. Reduced motion limits the maximum computed duration to 0.00001 s.
- Offline reload retained the 12-record demo and displayed **You are offline**.
  The controlled old-worker replacement regression passed.
- Privacy and Terms are reachable and describe local files, demo disposal,
  token-only verification, GitHub release lookup, price, merchant, refunds,
  revocation, limits, and contacts in plain words.
- All discovered live site, release, download, checkout, and factory links
  resolved. `mailto:` links were correctly excluded from HTTP crawling.
- `/missing-verification-22` deliberately returns HTTP 404 and renders the
  designed page with one `h1`, one `main`, shared navigation/footer, a home
  action, and route-specific title. The expected failed-document 404 is not a
  defect.
- HTML includes HSTS, CSP with `frame-ancestors 'none'`, `nosniff`, strict
  referrer policy, and denied camera/microphone/geolocation. HTML and `sw.js`
  revalidate after 30 seconds; hashed assets are immutable for one year.
- The demo sends only same-origin requests. The cold landing additionally
  calls only the disclosed GitHub release API. There are no analytics, remote
  scripts, account fields, or food-data uploads.

This is a static local-first product, so backend tenant isolation, server
restart persistence, SQLite, and health endpoints do not apply. The only
runtime service is Sociobot billing. Checkout redirected to Dodo as disclosed;
license verification returned normal invalid-token JSON and then enforced its
client allowance with HTTP 429 and numeric `Retry-After`. The request-boundary
claim confirms only the token is sent.

## Performance

The clean initial build totals 50.09 kB raw / 17.36 kB gzip JavaScript and
23.48 kB raw / 6.10 kB gzip CSS. The factory `verify-url.sh` passed with no
errors, one `h1`, one `main`, complete image alternatives, and labeled buttons.

Fresh mobile Lighthouse results:

| Performance | Accessibility | Best practices | SEO | LCP | TBT | CLS | Transfer |
| ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| 100 | 100 | 100 | 100 | 1.7 s | 0 ms | 0 | 87 KiB |

## Earlier finding disposition

I read all earlier review, polish, verification, and handoff files, including
minor findings. Current evidence closes each group:

| Earlier findings | Current disposition and proof |
| --- | --- |
| Initial verification: unavailable purchase; silent bad-file omission; token-cache reuse; invalid dates; claim gaps; small targets; HTTP-200 missing route | Fixed. Purchase/rate-limit, explained drops, revoked token, validation, manifest, phone target, and real 404 checks all pass. |
| Review 1 F-1-1–F-1-12 | Fixed. The phone first viewport shows a named sample; all claims are declared; history focus and shared 404 structure pass; current first-action, section, pricing, and README words are concrete and within the audit limits. |
| Review 2 F-2-1–F-2-12 | Fixed. Unknown values are named and preserved; Dodo is named; app/demo share navigation and correct canonicals; version text and food-tracker/license/archive terminology are consistent; the cited README jargon is gone. |
| Review 3 F-3-1–F-3-6 | Fixed. Headings name conversion notes and CSV/JSON; plain text replaces normalization/checksum/PATH jargon; live and README release-notes links resolve. |
| Review 4 F-4-1–F-4-2 | Fixed. The absolute “every row” copy was replaced by the tested claim. The current export walkthrough visibly contains two rows and both export buttons, matching its alt text. |
| Review 5 F-5-1–F-5-10 | Fixed. Shared navigation and release-workflow claim coverage pass; current CSV, account, field, food-tracker, platform, and desktop wording is plain and consistent. |
| Reviews 6–7 F-6-1–F-6-3 and F-7-1 | Fixed. All claim commands pass from the immutable tag, release claims are declared, and the copy audit exactly records candidate `0.1.22`. |
| Verification 2 Unix installer and claim inventory; verification 3 Windows claim | Fixed. The real Unix installer completed, Windows has its own tagged test, and the 25-claim inventory is complete. |
| Verifications 6, 8, 13, 17–21 release/installer provenance findings | Fixed. Tag, deployment, release, manifests, checksums, download links, and 28 live files bind to `68cd2a8`; `candidate-installers` passes. |
| Verification 10 PWA update and undeclared README claim | Fixed. Controlled service-worker replacement and exact claim inventory pass. |
| Verification 12 billing 503 | Fixed. Checkout, normal verification, 429, and `Retry-After` passed live. |
| Verification 13 documented native command | Fixed. The CI-normalization regression passes; native prerequisites, test, Clippy, build, and launch all pass. |
| Verification 14 missing direct download, intermittent claim, filter state, and payment legal copy | Fixed. Live platform download resolves; all independent and aggregate claims pass; filter `aria-pressed` is tested; merchant/refund/revocation copy is present. |
| Verification 20 stale copy audit and verification 21 exact README audit | Fixed. The audit is for `0.1.22` and includes both current release-site sentences; its regression passes. |

## Final severity count

| Critical | High | Medium | Low | Untested claims |
| ---: | ---: | ---: | ---: | ---: |
| 0 | 0 | 0 | 0 | 0 |
