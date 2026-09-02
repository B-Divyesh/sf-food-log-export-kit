# Adversarial first-read review 7

Reviewed 2026-09-02 UTC against <https://food-log-export-kit.sociobot.in>
and work-order checkout `d77bda26e0de6ae1eda101d5fafcac2a1a1b5b66`.

## Verdict: FAIL

The landing page, demo, privacy boundary, routes, accessibility checks, and
direct browser claim tests pass. The required verdict is still **FAIL** because
the exact declared claim commands do not pass from a clean clone. The published
`v0.1.16` release targets `6930fab79aa0ff337e54b7631a40da4c48b66323`,
while the supplied checkout is `d77bda26e0de6ae1eda101d5fafcac2a1a1b5b66`.
This regresses earlier finding F-6-1 and blocks the claim gate.

## Cold first read

Fresh browser contexts opened the live landing page at 390 × 844 and
1440 × 844. Nothing was scrolled before this assessment.

- **What it does:** saves food-tracker history as CSV and JSON files.
- **Who it is for:** food-tracker users who need years of meals and recipes in
  files they control.
- **What to click first:** **Try it with sample data**. The adjacent text says
  the visitor will review 12 sample entries and download CSV and JSON.

The exact first-screen text was “Save your food history”, “For food tracker
users who need years of meals and recipes in files they control”, and “Try it
with sample data”. The three plain facts also fit inside the 390 × 844 first
viewport. No first-read finding was found.

## Findings

### F-7-1 / F-6-1 (reopened) — BLOCKING — the published release does not match this checkout, so declared claim commands fail

**Location and exact quote:** `.factory/claims.json`, `candidate-installers`:
“Published macOS, Windows, and Linux installers, checksums, and download links
come from the checked-out tagged candidate.” The README also says: “Site builds
use the checked-out Git commit.”

**Evidence:** A fresh `git clone --no-local /work/repo` resolved HEAD to
`d77bda26e0de6ae1eda101d5fafcac2a1a1b5b66`. The GitHub `v0.1.16` release,
its annotated tag, published `latest.json`, and the live
`/release-identity.json` resolve to
`6930fab79aa0ff337e54b7631a40da4c48b66323`. The exact
`@claim:candidate-installers` command failed with:

```text
Expected: d77bda26e0de6ae1eda101d5fafcac2a1a1b5b66
Received: 6930fab79aa0ff337e54b7631a40da4c48b66323
```

The 18 manifest commands of the form `npm test -- --grep @claim:…` also failed.
Each command runs the complete Vitest phase before Playwright, so the same
candidate assertion stopped the requested browser test from running. The 18
browser claims pass when Playwright is run directly, but that diagnostic does
not make the declared commands pass.

**Why this fails:** A failing declared claim test is blocking. The repository
claims that published installers are tied to the checked-out candidate, but an
independent run from the supplied checkout cannot prove that statement. This
is the same failure mode as review 6 after two later verification commits moved
`main` beyond the release tag.

**Concrete fix:** Choose one stable provenance contract and make its command
pass from the repository state reviewers receive. Either publish the next
version from the final commit and keep that commit as the reviewed checkout, or
rewrite the claim and test to bind installers to the immutable version tag and
deployed release identity instead of assuming `HEAD` is the tag commit. Then
run all 25 exact manifest commands from a fresh clone.

## Copy audit

Counts treat hyphenated terms, product names, filenames, URLs, and numbers as
one word. Commands and sample data are listed as useful fragments rather than
prose sentences. No sentence exceeds 22 words. No banned marketing adjective,
metaphor heading, inconsistent product term, or non-result action was found.

### Landing page

| Copy | Words | Flag |
|---|---:|---|
| Food Log Export Kit — Save your food history | 8 | — |
| Turn food tracker exports into CSV and JSON files on your device. | 12 | — |
| Food Log Export Kit | 4 | — |
| Demo; How it works; Privacy; Terms | 1; 3; 1; 1 | — |
| Export food tracker history | 4 | — |
| Save your food history | 4 | — |
| For food tracker users who need years of meals and recipes in files they control. | 15 | — |
| Try it with sample data | 5 | — |
| Review 12 sample entries, then download a CSV and JSON archive. | 11 | — |
| No uploads. | 2 | — |
| Conversion stays on this device. | 5 | — |
| No account. | 2 | — |
| Open a file and start. | 5 | — |
| Free for one file. | 4 | — |
| Batch import costs $19 once. | 5 | — |
| Keep a CSV for spreadsheets. | 5 | — |
| JSON keeps consistent fields and conversion notes. | 7 | — |
| A recipe card archive box in a quiet kitchen at dusk. | 11 | — |
| Desktop app · version 0.1.16 | 4 | — |
| Download the desktop app | 4 | — |
| The app reads CSV and JSON exports. | 7 | — |
| It also works when your internet is off. | 8 | — |
| Download for Linux | 3 | — |
| Food.Log.Export.Kit_0.1.16_amd64.AppImage | 1 | — |
| Read release notes; on GitHub | 3; 2 | — |
| Review before export | 3 | — |
| Review entries and conversion notes | 5 | — |
| Invalid values, skipped rows, and populated unrecognized fields appear in conversion notes. | 12 | — |
| Food Log Export Kit; On this device | 4; 3 | — |
| Import; Review; Export | 1; 1; 1 | — |
| sample-food-history.csv; 12 entries ready; CSV + JSON | 1; 3; 2 | — |
| APR 14; 3 meals; No notes | 2; 2; 2 | — |
| Breakfast; Oatmeal with blueberries; 342 kcal | 1; 3; 2 | — |
| Lunch; Lentil soup; 418 kcal | 1; 2; 2 | — |
| Dinner; Tofu ginger stir-fry; 561 kcal | 1; 3; 2 | — |
| How it works | 3 | — |
| How to turn an export into an archive | 8 | — |
| Choose your export | 3 | — |
| Open a CSV or JSON file from your tracker. | 9 | — |
| The app screen for choosing a tracker export. | 8 | — |
| Review conversion notes | 3 | — |
| Check missing fields and rows before saving anything. | 8 | — |
| A conversion note explaining an unusable row. | 7 | — |
| Save CSV and JSON | 4 | — |
| Use the CSV in a spreadsheet. | 6 | — |
| Keep JSON with consistent fields and conversion notes. | 8 | — |
| Two filled food-log rows above Export CSV and Export JSON buttons. | 11 | — |
| Privacy and limits | 3 | — |
| How the app handles your files | 6 | — |
| Your files stay local. | 4 | — |
| The app has no food-data server. | 6 | — |
| The app does not sign in to your tracker. | 9 | — |
| Use exports you requested from your tracker. | 7 | — |
| No nutrition advice. | 3 | — |
| Numbers are copied and labeled, not judged. | 7 | — |
| Unrecognized fields appear in conversion notes. | 6 | — |
| The app names them and keeps their values in JSON. | 10 | — |
| Batch-import license | 2 | — |
| Combine several exports for $19 | 5 | — |
| The free app handles one file at a time. | 9 | — |
| The batch-import license adds multi-file selection for migrations split across years or apps. | 13 | — |
| One-time purchase | 2 | — |
| Paste the license token on another device | 7 | — |
| CSV and JSON export stay free | 6 | — |
| Buy the batch-import license | 4 | — |
| Sociobot/Dodo is the merchant of record. | 6 | — |
| It handles refunds, which revoke the license. | 7 | — |
| Read the terms. | 3 | — |
| Turn food tracker exports into a local archive. | 8 | — |
| Built by Param Factory | 4 | — |
| Version 0.1.16 · release repair · Generated artwork | 6 | — |

### README

| Copy | Words | Flag |
|---|---:|---|
| Turn food tracker exports into a local archive. | 8 | — |
| Food Log Export Kit is for people leaving a food tracker. | 11 | — |
| It reads CSV and JSON food tracker exports. | 8 | — |
| It keeps meal, recipe, nutrition, and weight fields. | 8 | — |
| It exports a CSV and JSON archive. | 7 | — |
| Files, rows, and populated fields the app does not recognize appear in conversion notes. | 14 | — |
| JSON preserves those original field values. | 6 | — |
| The website and desktop app convert food data on your device. | 11 | — |
| The project does not track meals, require an account, store food data on a server, or give medical advice. | 19 | — |
| The sample demo contacts only this website. | 7 | — |
| CSV files separated by commas, semicolons, or tabs | 7 | — |
| JSON arrays and objects with entries, records, meals, foods, items, or data lists | 12 | — |
| CSV headings for dates, meals, foods, recipes, amounts, energy, macros, and weights | 12 | — |
| Dates in YYYY-MM-DD order; impossible or ambiguous numeric dates appear in conversion notes | 12 | — |
| Dot decimals, grouped commas such as 1,234, and decimal commas such as 1,5; comma interpretations are noted | 15 | — |
| The free app imports one file at a time. | 9 | — |
| A $19 one-time batch-import license adds multi-file selection. | 8 | — |
| Paste its token to restore it on another device. | 9 | — |
| CSV and JSON export stay free. | 6 | — |
| License checks send only the token to the Sociobot billing API. | 11 | — |
| Sociobot/Dodo is the merchant of record and handles refunds. | 9 | — |
| A refund revokes the license. | 5 | — |
| The landing page selects the published build for your system. | 10 | — |
| On Linux or macOS, the installer checks that the downloaded file was not changed. | 14 | — |
| It installs the food-log-export-kit command so you can run it from a terminal. | 12 | — |
| On Windows, this command verifies and starts the MSI installer. | 10 | — |
| Review the release notes for the steps to open the app on your system. | 13 | — |
| The published manifest and checksum file name the source commit used for every desktop build. | 15 | — |
| Each site build publishes its matching release identity for the installers. | 11 | — |
| Requires Node.js 22. | 3 | — |
| Rust is needed only to build the desktop app. | 9 | — |
| Open http://127.0.0.1:4173/demo for the isolated sample workspace. | 7 | — |
| The release workflow builds macOS, Windows, and Linux installers after a v* tag is pushed. | 15 | — |
| Site builds use the checked-out Git commit. | 7 | — |
| A supplied commit must match it. | 6 | — |
| Commit and push all source, test, handoff, and evidence changes first. | 10 | — |
| From the clean main tip, run: | 7 | — |
| The preflight stops a dirty checkout. | 6 | — |
| It also stops wrong branches, existing tags, version mismatches, and stale main tips. | 12 | — |
| Wait for GitHub Actions to publish installers, SHA256SUMS, and latest.json. | 10 | — |
| Then run the candidate-installers claim before deploying the site built from that commit. | 13 | — |
| Tested product claims are listed in .factory/claims.json. | 7 | — |
| Demo behavior is documented in .factory/demo.md. | 6 | — |
| Publish dist/site/ as a static site. | 6 | — |
| The included hosting config defines reload routes, security headers, cache rules, and the 404 response. | 15 | — |
| The factory handles DNS and deployment. | 6 | — |
| The MIT license covers the source code. | 7 | — |
| Product terms for the batch-import license are available at /terms; data handling details are at /privacy. | 16 | — |

README headings — “Supported input”, “Install the desktop app”, “Run locally”,
“Test and build”, “Publish a desktop release”, “Project map”, “Deploy”, and
“Privacy and license” — all identify their sections without surrounding copy.
Technical terms appear only in developer install, build, release, and project
map sections where they name actual commands, formats, or files.

Terminology is consistent: **export** is an input from a tracker, **archive** is
the saved result, **CSV** is the spreadsheet output, **JSON** is the structured
output, **conversion note** explains a field or row, **batch-import license** is
the paid feature, and **demo** is the isolated sample.

## Demo, sandbox, privacy, and offline behavior

- The first landing action opens `/?demo=1` in one click.
- At 390 × 844, the persistent “Demo — sample data, nothing is saved” banner
  and “Oatmeal with blueberries” sample record are visible. The named record
  ends at 579 CSS pixels.
- The first demo render contains 12 realistic records. Filtering to Recipes
  shows “0 shown”; **Reset demo** restores 12 records and “12 shown”.
- Exported CSV contains one header plus 12 data rows. Exported JSON contains 12
  records.
- **Start for real** opens `/app` with an empty workspace and no sample rows.
- Pre-existing `real:sentinel` local storage and `real:session` session storage
  values remain unchanged through demo entry, reset, export, and exit. The demo
  writes no cookie or storage key.
- The complete demo flow makes only same-origin requests. After service-worker
  control, a fresh `/demo` context reloads offline with all 12 records.

No demo or sandbox finding was found.

## Claims gate

A clean clone was created with `git clone --no-local`, followed by `npm ci`.
Every exact command in `.factory/claims.json` was run independently.

| Claim ID | Exact command result |
|---|---|
| csv-export | FAIL — stopped by F-7-1 in the shared Vitest phase |
| json-archive | FAIL — stopped by F-7-1 in the shared Vitest phase |
| local-only | FAIL — stopped by F-7-1 in the shared Vitest phase |
| format-import | FAIL — stopped by F-7-1 in the shared Vitest phase |
| explained-drops | FAIL — stopped by F-7-1 in the shared Vitest phase |
| lossy-fields | FAIL — stopped by F-7-1 in the shared Vitest phase |
| validation-notes | FAIL — stopped by F-7-1 in the shared Vitest phase |
| batch-import | FAIL — stopped by F-7-1 in the shared Vitest phase |
| license-restore | FAIL — stopped by F-7-1 in the shared Vitest phase |
| paid-purchase | FAIL — stopped by F-7-1 in the shared Vitest phase |
| offline-reload | FAIL — stopped by F-7-1 in the shared Vitest phase |
| demo-discard | FAIL — stopped by F-7-1 in the shared Vitest phase |
| privacy-no-account | FAIL — stopped by F-7-1 in the shared Vitest phase |
| free-behavior | FAIL — stopped by F-7-1 in the shared Vitest phase |
| normalized-types | FAIL — stopped by F-7-1 in the shared Vitest phase |
| revoked-license | FAIL — stopped by F-7-1 in the shared Vitest phase |
| detected-platform-downloads | FAIL — stopped by F-7-1 in the shared Vitest phase |
| verified-installer | PASS |
| windows-installer | PASS |
| license-request-data-boundary | FAIL — stopped by F-7-1 in the shared Vitest phase |
| static-hosting | PASS |
| release-workflow | PASS |
| candidate-installers | FAIL — release targets `6930fab…`, not checkout `d77bda2…` |
| site-source-commit | PASS |
| release-preflight | PASS |

As a diagnostic, `npx playwright test --grep '@claim:'` passed all 18 browser
claims. The manifest contains one actual tagged test definition for each ID.
No unlisted claim-like sentence was found on the live landing page or in the
README. The failing exact commands remain blocking regardless of the direct
browser result.

## Earlier-history recheck

Every earlier review, polish record, and handoff was read. Each prior finding
was checked against the live site and current code or its focused regression.

| Earlier finding | Current result |
|---|---|
| F-1-1 | Fixed: the named oatmeal sample is above the 390 px fold. |
| F-1-2 | Fixed: 25 claims are listed with one actual tagged test each; F-7-1 is a test-execution/provenance failure, not a missing inventory item. |
| F-1-3 | Fixed: Privacy receives heading focus and browser Back focuses the landing h1. |
| F-1-4 | Fixed: unknown URLs return a designed HTTP 404 with metadata, shared navigation, footer, and return action. |
| F-1-5 | Fixed: the primary-action result names CSV and JSON. |
| F-1-6 | Fixed: the eyebrow names the export task; exit slogans are absent. |
| F-1-7 | Fixed: the heading is “Download the desktop app”. |
| F-1-8 | Fixed: the preview label is “Review before export”. |
| F-1-9 | Fixed: the workflow heading names the export-to-archive task. |
| F-1-10 | Fixed: privacy headings name privacy and file handling. |
| F-1-11 | Fixed: the pricing label is “Batch-import license”. |
| F-1-12 | Fixed: the README opening uses short concrete sentences. |
| F-2-1 | Fixed: populated unrecognized fields are named in notes and retained in JSON; the focused browser claim passes. |
| F-2-2 | Fixed: copy names Sociobot/Dodo and checkout returns a Dodo 303 redirect. |
| F-2-3 | Fixed: `/app` and `/demo` use the shared navigation and footer. |
| F-2-4 | Fixed: `/app` has its own title, description, canonical, and OG URL. |
| F-2-5 | Fixed: live client and static 404 footers both show version 0.1.16. |
| F-2-6 | Fixed: public source-product wording uses “food tracker”. |
| F-2-7 | Fixed: public paid-tier wording uses “batch-import license”. |
| F-2-8 | Fixed: “archive” describes output and “free app” describes the tier. |
| F-2-9 | Fixed: README says “website and desktop app”. |
| F-2-10 | Fixed: README says the demo contacts only this website. |
| F-2-11 | Fixed: README names `YYYY-MM-DD` directly. |
| F-2-12 | Fixed: README describes route reload behavior without “SPA routing”. |
| F-3-1 | Fixed: the heading is “Review conversion notes”. |
| F-3-2 | Fixed: the heading is “Save CSV and JSON”. |
| F-3-3 | Fixed: landing copy explains consistent fields instead of using “normalized”. |
| F-3-4 | Fixed: README explains that verification checks whether the download changed. |
| F-3-5 | Fixed: README explains that the installed command runs from a terminal. |
| F-3-6 | Fixed: the live release-notes link resolves to `v0.1.16`. |
| F-4-1 | Fixed: the absolute “every row” heading is absent. |
| F-4-2 | Fixed: the image shows two populated rows and both export buttons; its alt text matches. |
| F-5-1 | Fixed: every route has `Demo · How it works · Privacy · Terms`. |
| F-5-2 | Fixed: `release-workflow` is listed and its exact command passes. |
| F-5-3 | Fixed: CSV copy names spreadsheet use. |
| F-5-4 | Fixed: the tracker boundary says the app does not sign in. |
| F-5-5 | Fixed: landing copy says “Unrecognized fields”. |
| F-5-6 | Fixed: README says “does not recognize”. |
| F-5-7 | Fixed: README says “original field values”. |
| F-5-8 | Fixed: README names the meal, account, server, and advice boundaries. |
| F-5-9 | Fixed: README says “steps to open the app on your system”. |
| F-5-10 | Fixed: README says Rust is needed to build the desktop app. |
| F-6-1 | **Regressed and reopened as F-7-1:** the current checkout follows the `v0.1.16` source commit, so candidate identity tests fail. |
| F-6-2 | Fixed: `site-source-commit` and `release-preflight` are listed and their exact commands pass. |
| F-6-3 | Fixed: `.factory/copy-audit.md` matches current version 0.1.16 and current README copy. |

## Structure, accessibility, and visual identity

- `/`, `/demo`, `/app`, `/privacy`, and `/terms` return 200. An unknown route
  returns the designed HTTP 404.
- Every checked route has `lang=en`, one `<h1>`, one `<main>`, a route-specific
  title, description, canonical and OG URL, social image, favicon, Apple-touch
  icon, shared header, and shared footer.
- `robots.txt`, `sitemap.xml`, the favicon, Apple-touch icon, and social image
  return 200. Same-origin links resolve; the installer returns its expected
  GitHub 302 and checkout its expected Dodo 303.
- Deep-link reloads work. Client navigation and browser Back move focus to the
  new route heading.
- The worker URL verifier reports no console, title, language, heading, main,
  alt-text, or button-name error. The Playwright Axe/accessibility suite passes
  38 checks with four intentional desktop-project skips whose mobile versions
  pass. Keyboard export, 200% mobile scale, 44 px targets, reduced motion, and
  mobile overflow checks pass.
- `npm run build` passes. The largest production JavaScript chunk is 39.70 kB
  raw and 14.10 kB gzip.
- The kitchen-at-dusk artwork, archive-box imagery, ruled-paper work surface,
  serif display face, clipped labels, and forest/apricot palette follow
  `.factory/design.md`. The product does not look like a generic SaaS template.

No additional structure, accessibility, or visual finding was found.

## Missed leverage

No missing feature is identified. The brief asks for deterministic local
validation, normalization, conversion notes, CSV export, JSON export, and
batch import; all are present. AI or sync would add privacy and reliability
costs without improving the archive migration job.

## What would make this perfect

Make the immutable release-provenance contract pass from the checkout supplied
to reviewers, then rerun all 25 exact claim commands from a fresh clone. No
other copy, demo, privacy, routing, accessibility, visual, or feature change is
indicated by this review.
