# Adversarial first-read review 4

Reviewed 2026-08-29 UTC against <https://food-log-export-kit.sociobot.in>
and commit `b54087fbbc2161262e66d752978ae4f59fae7ef5`.

## Verdict: FAIL

The first screen, demo, sandbox, declared claims, routes, accessibility checks,
and builds pass. The product still fails this zero-finding review because the
landing page makes one absolute product claim that is absent from
`.factory/claims.json`. The third walkthrough image also fails to show the
export state described by its caption and alternative text.

## Cold first read

Fresh browser contexts opened the live landing page at 390 × 844 and
1440 × 900. Nothing was scrolled before this assessment.

- **What it does:** saves food-tracker history as CSV and JSON files.
- **Who it is for:** food-tracker users who want years of meals and recipes in
  files they control.
- **What to click first:** **Try it with sample data**. The adjacent sentence
  says this opens 12 sample entries and downloads a CSV and JSON archive.

The exact first-screen text was “Save your food history”, “For food tracker
users who need years of meals and recipes in files they control”, and “Try it
with sample data”. All three questions are answered at both widths. At 390 px,
the three fact lines end at `y=792px` inside the 844 px viewport. The page has
no horizontal overflow, console error, or missing first-screen action.

## Findings

### F-4-1 — BLOCKING — “every row” is an unlisted absolute claim

**Location and exact quote:** landing preview heading: “See every row before
you export”.

**Evidence:** `.factory/claims.json` has claims for supported input, exported
row counts, unusable rows, unrecognized fields, and validation notes. It has no
claim that every source row is represented in the review UI before export, and
no single test tagged for that promise. The present tests exercise related
parts, but the claims contract requires the public claim itself to have exactly
one manifest entry and tagged observable test.

**Why this fails:** “Every” is a universal assurance in a migration tool. A
visitor may rely on it before deleting an old account or original export. The
review cannot infer complete row reconciliation by combining several narrower
claims.

**Concrete fix:** add a `review-every-row` entry to `.factory/claims.json` and
exactly one `@claim:review-every-row` test. Import one fixture containing valid,
invalid, and unmapped rows; assert that each source row is either present in the
review table or named in a conversion note, and that the reconciled count
equals the source-row count. Alternatively, replace the heading with a claim
already stated by the manifest, such as “Review entries and conversion notes”.

### F-4-2 — MEDIUM — the export walkthrough image does not show the described export state

**Location and exact quote:** landing walkthrough step 3,
`public/screens/03-export.webp`; alternative text: “The filled review table
with CSV and JSON export buttons.” The adjacent heading is “Save CSV and JSON”.

**Evidence:** the shipped 760 × 489 image ends beneath the faded “12 entries
are ready” summary. It contains neither the filled review table nor the CSV and
JSON export buttons. The live image loads successfully, so this is not a lazy
loading failure; the source asset itself has the wrong crop/state. The capture
also shows the older reduced app navigation.

**Why this fails:** the required desktop-app walkthrough reaches the export
step but provides no visual evidence of that step. The alternative text
describes content that is not in the image, which is misleading for both
sighted and screen-reader visitors.

**Concrete fix:** recapture the current app after its reveal has completed,
scroll the populated review and **Export CSV** / **Export JSON** controls into
the 760 × 489 frame, and keep alternative text that describes the resulting
image exactly. Confirm all three walkthrough captures use the current shared
navigation.

## Copy audit

Counts treat hyphenated terms, product names, filenames, URLs, and inline code
as one word. Repeated navigation labels are listed once. Sample values such as
meal names and calorie counts are data, not sentences. All reader-facing prose,
headings, actions, metadata, and image descriptions are included below.

No sentence exceeds 22 words or contains a banned marketing adjective. No
terminology inconsistency or non-result button was found. F-4-1 is a claims
inventory failure, and F-4-2 is an inaccurate image description.

### Landing page

| Copy | Words | Flag |
| --- | ---: | --- |
| Food Log Export Kit — Save your food history | 8 | — |
| Turn food tracker exports into CSV and JSON files on your device. | 12 | — |
| Food Log Export Kit | 4 | — |
| Demo | 1 | — |
| How it works | 3 | — |
| Privacy | 1 | — |
| Terms | 1 | — |
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
| Desktop app · version 0.1.5 | 4 | — |
| Download the desktop app | 4 | — |
| The app reads CSV and JSON exports. | 7 | — |
| It also works when your internet is off. | 8 | — |
| Download for Linux | 3 | — |
| Food.Log.Export.Kit_0.1.5_amd64.AppImage | 1 | — |
| Read release notes | 3 | — |
| on GitHub | 2 | — |
| Review before export | 3 | — |
| See every row before you export | 6 | F-4-1 |
| Invalid values, skipped rows, and populated unrecognized fields appear in conversion notes. | 12 | — |
| On this device | 3 | — |
| Import | 1 | — |
| Review | 1 | — |
| 12 entries ready | 3 | — |
| Export | 1 | — |
| CSV + JSON | 2 | — |
| How to turn an export into an archive | 8 | — |
| Choose your export | 3 | — |
| Open a CSV or JSON file from your tracker. | 9 | — |
| The app screen for choosing a tracker export. | 8 | — |
| Review conversion notes | 3 | — |
| Check missing fields and rows before saving anything. | 8 | — |
| A conversion note explaining an unusable row. | 7 | — |
| Save CSV and JSON | 4 | — |
| Use CSV now. | 3 | — |
| Keep JSON with consistent fields and conversion notes. | 8 | — |
| The filled review table with CSV and JSON export buttons. | 10 | F-4-2 |
| Privacy and limits | 3 | — |
| How the app handles your files | 6 | — |
| Your files stay local. | 4 | — |
| The app has no food-data server. | 6 | — |
| No account scraping. | 3 | — |
| Use exports you requested from your tracker. | 7 | — |
| No nutrition advice. | 3 | — |
| Numbers are copied and labeled, not judged. | 7 | — |
| Unmapped fields are reported. | 4 | — |
| The app names them and keeps their values in JSON. | 10 | — |
| Batch-import license | 2 | — |
| Combine several exports for $19 | 5 | — |
| The free app handles one file at a time. | 9 | — |
| The batch-import license adds multi-file selection for migrations split across years or apps. | 13 | — |
| One-time purchase | 2 | — |
| Paste the license token on another device | 7 | — |
| CSV and JSON export stay free | 6 | — |
| $19 | 1 | — |
| one time | 2 | — |
| Buy the batch-import license | 4 | — |
| Sociobot opens a checkout page hosted by Dodo. | 8 | — |
| Read the terms. | 3 | — |
| Turn food tracker exports into a local archive. | 8 | — |
| Built by Param Factory | 4 | — |
| external site | 2 | — |
| Version 0.1.5 · release repair · Generated artwork | 6 | — |

### README

| Copy | Words | Flag |
| --- | ---: | --- |
| Food Log Export Kit | 4 | — |
| Turn food tracker exports into a local archive. | 8 | — |
| Food Log Export Kit is for people leaving a food tracker. | 11 | — |
| It reads CSV and JSON food tracker exports. | 8 | — |
| It keeps meal, recipe, nutrition, and weight fields. | 8 | — |
| It exports a CSV and JSON archive. | 7 | — |
| Files, rows, and populated fields it cannot map appear in conversion notes. | 12 | — |
| JSON preserves those unmapped field values. | 6 | — |
| The website and desktop app convert food data on your device. | 11 | — |
| The project has no tracker, account system, food-data server, or medical advice. | 12 | — |
| The sample demo contacts only this website. | 7 | — |
| Live site | 2 | — |
| Demo | 1 | — |
| Supported input | 2 | — |
| CSV files separated by commas, semicolons, or tabs | 8 | — |
| JSON arrays and objects with `entries`, `records`, `meals`, `foods`, `items`, or `data` lists | 13 | — |
| CSV headings for dates, meals, foods, recipes, amounts, energy, macros, and weights | 12 | — |
| Dates in `YYYY-MM-DD` order; impossible or ambiguous numeric dates appear in conversion notes | 13 | — |
| Dot decimals, grouped commas such as `1,234`, and decimal commas such as `1,5`; comma interpretations are noted | 17 | — |
| The free app imports one file at a time. | 9 | — |
| A $19 one-time batch-import license adds multi-file selection. | 8 | — |
| Paste its token to restore it on another device. | 9 | — |
| CSV and JSON export stay free. | 6 | — |
| License checks send only the token to the Sociobot billing API. | 11 | — |
| Install the desktop app | 4 | — |
| The landing page selects the published build for your system. | 10 | — |
| On Linux or macOS, the installer checks that the downloaded file was not changed. | 14 | — |
| It installs the `food-log-export-kit` command so you can run it from a terminal. | 12 | — |
| On Windows, this command verifies and starts the MSI installer. | 10 | — |
| Review the release notes for the platform-specific open step. | 9 | — |
| Run locally | 2 | — |
| Requires Node.js 22. | 3 | — |
| Rust is needed only for the desktop shell. | 8 | — |
| Open `http://127.0.0.1:4173/demo` for the isolated sample workspace. | 7 | — |
| Test and build | 3 | — |
| `npm run build:site` writes the deployable website to `dist/site/`, with `index.html` at that root. | 14 | — |
| `npm run build:app` writes the Tauri frontend to `dist/app/`. | 9 | — |
| The release workflow builds macOS, Windows, and Linux installers after a `v*` tag is pushed. | 15 | — |
| Tested product claims are listed in `.factory/claims.json`. | 7 | — |
| Demo behavior is documented in `.factory/demo.md`. | 6 | — |
| Project map | 2 | — |
| `src/importer.ts` — format detection and normalization | 5 | — |
| `src/exporter.ts` — CSV and portable JSON output | 6 | — |
| `src/app.ts` — local workspace and demo | 5 | — |
| `src-tauri/` — Tauri 2 desktop shell | 5 | — |
| `.github/workflows/release.yml` — cross-platform release builds | 4 | — |
| Deploy | 1 | — |
| Publish `dist/site/` as a static site. | 6 | — |
| The included hosting config keeps app routes working after reload and sets security headers, caching, and the 404 response. | 19 | — |
| The factory handles DNS and deployment. | 6 | — |
| Privacy and license | 3 | — |
| The MIT license covers the source code. | 7 | — |
| Product terms for the batch-import license are available at `/terms`; data handling details are at `/privacy`. | 16 | — |

Developer commands and project-map labels use technical names only where they
identify required tools, files, or build output. They are not marketing copy.

### Terminology

| Concept | Term used | Result |
| --- | --- | --- |
| Input file from another tracker | export | Consistent |
| Saved collection | archive | Consistent |
| Spreadsheet output | CSV | Consistent |
| Structured output with conversion details | JSON | Consistent |
| Import warning or preservation detail | conversion note | Consistent |
| Paid multi-file capability | batch-import license | Consistent |
| Isolated sample environment | demo | Consistent |
| Source product category | food tracker | Consistent |

The landing buttons use result-naming verbs: **Try**, **Download**, **Read**,
and **Buy**. Navigation links use destination names. No metaphor, mood heading,
generic slogan, or inconsistent product term remains.

## Demo, sandbox, and privacy

- The landing action opens `/?demo=1` in one click. Direct `/demo` also works.
- At 390 × 844, the named sample record “14 Apr · Breakfast · Oatmeal with
  blueberries · 342 kcal” occupies `y=521–616px`, fully inside the first
  viewport.
- The persistent banner says “Demo — sample data, nothing is saved” and
  includes **Reset demo** and **Start for real**.
- Selecting **Recipes** produces “0 shown”; **Reset demo** restores “12 shown”.
- **Start for real** opens `/app` with “Choose a tracker export” and no sample
  rows.
- Pre-existing local- and session-storage sentinels remain unchanged through
  demo entry, reset, and exit. Direct demo mode reads neither the release cache
  nor the stored license code path. The sample records remain in memory.
- The demo request log contains only same-origin application assets. It sets no
  cookies and produces no console or page errors.
- After the service worker takes control, `/demo` reloads offline with the named
  record and displays “You are offline”.
- Live CSV and JSON download behavior is also covered by the passing claim
  tests. The one-click demo requirement passes.

## Claims gate

A clean clone at `/tmp/food-log-review4.1IPPgx` was created with
`git clone --no-local`, followed by `npm ci`. Every exact command in
`.factory/claims.json` was run independently. Every manifest ID occurs exactly
once as a test tag.

| Claim ID | Result |
| --- | --- |
| csv-export | PASS |
| json-archive | PASS |
| local-only | PASS |
| format-import | PASS |
| explained-drops | PASS |
| lossy-fields | PASS |
| validation-notes | PASS |
| batch-import | PASS |
| license-restore | PASS |
| paid-purchase | PASS |
| offline-reload | PASS |
| demo-discard | PASS |
| privacy-no-account | PASS |
| free-behavior | PASS |
| normalized-types | PASS |
| revoked-license | PASS |
| detected-platform-downloads | PASS |
| verified-installer | PASS |
| windows-installer | PASS |
| license-request-data-boundary | PASS |

F-4-1 is the only unlisted product claim found on the live landing page or in
the README. Passing related tests does not create the required manifest entry.

The full clean-clone gate also passed: `npm test` reported 21 unit tests and 48
browser tests passing, with four intentional cross-project skips.
`npm run build` and `npm run build:app` both produced their expected output.
The largest initial JavaScript chunk is 38.69 kB raw and 13.67 kB gzip.

## Earlier-history recheck

Every earlier review, polish report, and the prior handoff was read. Each prior
finding was then checked on the live site and in current source or its
regression test.

| Earlier finding | Live and code result |
| --- | --- |
| F-1-1 mobile demo hid the sample record | **Fixed.** The oatmeal record ends at 616 px; the mobile regression passes. |
| F-1-2 public claims were incomplete | **Fixed for the claims named in review 1.** There are 20 unique declared tags and all commands pass. F-4-1 is a newly identified absolute claim. |
| F-1-3 Back did not focus the landing heading | **Fixed.** `/` → Privacy → Back focuses the landing `<h1>` live and in the regression. |
| F-1-4 404 lacked metadata and the shared shell | **Fixed.** The live HTTP 404 has canonical/social metadata, standard navigation, footer, attribution, and version. |
| F-1-5 the first action did not name both formats | **Fixed.** It names CSV and JSON beside the action. |
| F-1-6 decorative exit labels | **Fixed.** The eyebrow is “Export food tracker history”; the exit slogan is absent. |
| F-1-7 indirect desktop heading | **Fixed.** It is “Download the desktop app”. |
| F-1-8 context-free product label | **Fixed.** It is “Review before export”. |
| F-1-9 metaphor workflow heading | **Fixed.** It is “How to turn an export into an archive”. |
| F-1-10 generic privacy heading | **Fixed.** It is “Privacy and limits” / “How the app handles your files”. |
| F-1-11 slogan pricing label | **Fixed.** It is “Batch-import license”. |
| F-1-12 long README opening | **Fixed.** It is split into short concrete sentences. |
| F-2-1 / F-1-2 lossy fields were dropped | **Fixed.** A fresh live Fiber import produced a named note and JSON `unmapped_fields.Fiber = "12"`; no remote request carried the food data. |
| F-2-2 checkout host was misstated | **Fixed.** Copy names Dodo; the live Sociobot endpoint returns 303 to `checkout.dodopayments.com`. |
| F-2-3 app/demo omitted shared navigation/footer | **Fixed.** Both routes have semantic navigation, Privacy, Terms, attribution, and the version footer. |
| F-2-4 `/app` used the landing canonical | **Fixed.** Live canonical and OG URL are `/app`. |
| F-2-5 the 404 build label was stale | **Fixed.** Static and rendered footers both show version 0.1.5 and “release repair”. |
| F-2-6 calorie/food tracker terms differed | **Fixed.** Public copy uses “food tracker”. |
| F-2-7 the paid tier had three names | **Fixed.** Public copy uses “batch-import license”. |
| F-2-8 archive named the free app | **Fixed.** It says “The free app”. |
| F-2-9 README used “desktop webview” | **Fixed.** It says “website and desktop app”. |
| F-2-10 README used “cross-origin requests” | **Fixed.** It says the demo “contacts only this website”. |
| F-2-11 README used unnecessary “ISO” | **Fixed.** It names `YYYY-MM-DD` directly. |
| F-2-12 README used “SPA routing” | **Fixed.** It describes route reload behavior. |
| F-3-1 “Read the notes” was ambiguous | **Fixed.** It is “Review conversion notes”. |
| F-3-2 “Save both formats” was ambiguous | **Fixed.** It is “Save CSV and JSON”. |
| F-3-3 “normalized” was unexplained | **Fixed.** Landing copy says JSON keeps consistent fields and conversion notes. |
| F-3-4 README used “checksum” | **Fixed.** It explains that the installer checks the file was not changed. |
| F-3-5 README used “PATH” | **Fixed.** It says the command can be run from a terminal. |
| F-3-6 release notes had no destination | **Fixed.** The live 44 px link points to the selected v0.1.5 release and returns 200. |

No earlier finding is reopened. F-4-1 and F-4-2 are newly identified.

## Structure, routing, accessibility, and visual identity

- `/`, `/demo`, `/app`, `/privacy`, and `/terms` return 200. An unknown URL
  returns the designed HTTP 404.
- At desktop and 390 px, every checked route has `lang=en`, one `<h1>`, one
  `<main>`, ordered headings, a route title under 60 characters, a description,
  canonical, OG/Twitter data, SVG favicon, 180 px Apple icon, header, navigation,
  footer, and complete image alternatives.
- `robots.txt` and `sitemap.xml` list the real routes. Deep links reload. Browser
  Back restores focus to the landing heading and route changes are announced.
- Every discovered same-origin link and fragment resolves. The selected release
  page returns 200, the AppImage link returns its expected GitHub 302, the
  checkout returns its expected Dodo 303, and `mailto:` links are explicit.
- The CSP is delivered as a response header and includes
  `frame-ancestors 'none'`. HSTS, `nosniff`, referrer policy, and permissions
  restrictions are present.
- Live axe scans at 1440 × 900 and 390 × 844 found zero WCAG 2 A/AA violations
  on all six checked routes. The worker verifier found no errors on all five
  200 routes. Repository tests cover keyboard use, reduced motion, 200% scale,
  touch targets, and mobile overflow.
- The kitchen-at-dusk art, archive box, paper ledger, clipped labels,
  serif/system type pairing, and forest/apricot palette match
  `.factory/design.md`. The site is visually distinct rather than a generic
  SaaS template. F-4-2 concerns the accuracy of one walkthrough asset.

## Missed leverage

No missing AI feature, sync, or additional import/export path is identified.
The brief calls for deterministic local validation and CSV/JSON output, which
the product provides. AI would add privacy and reliability costs without
improving this migration job. Batch import, offline use, lossy-field reporting,
and both export formats are already present.

## What would make this perfect

Declare and test the “every row” reconciliation promise, or narrow that heading
to an existing tested claim. Then replace the third walkthrough capture with a
current, fully visible populated table and the two export controls. Re-run the
20 existing claim commands plus the new claim, the full suite, the live copy
audit, and the route/image check. Nothing else remains from this review.
