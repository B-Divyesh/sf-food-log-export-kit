# Adversarial first-read review 5

Reviewed 2026-08-30 UTC against
<https://food-log-export-kit.sociobot.in> and candidate
8f6606c69381aa155fff7bdc207cf84a1514b314.

## Verdict: FAIL

No functional blocker or failing declared claim was found. The cold landing
page, one-click demo, sandbox, exports, offline behavior, routes, accessibility,
and builds pass. This remains a FAIL because a zero-finding verdict is required:
the app routes do not use the same navigation destinations as the other routes,
one README claim is absent from the claims manifest, and eight phrases fail the
plain-words standard.

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
with sample data”. All three questions are answered at both widths. On mobile,
the three fact lines end at y=792 inside the 844 px viewport. The page has no
horizontal overflow or console error.

## Findings

### F-5-1 — MEDIUM — app routes use different primary navigation destinations

**Location and exact text:** live landing, Privacy, Terms, and 404 navigation:
“Demo · How it works · Privacy · Terms”. Live app and demo navigation:
“Home · Demo · Privacy · Terms”. The same split exists between
src/shell.ts and src/app.ts.

**Why this fails:** The site-structure contract requires a consistent header
on every route and already makes the wordmark the Home link. Entering the
product removes **How it works** and adds a duplicate Home destination, so the
header changes meaning between the marketing and working surfaces.

**Concrete fix:** Use “Demo · How it works · Privacy · Terms” on every route.
Keep the wordmark as the Home link. Add one route-shell test that compares the
navigation labels and destinations on /, /demo, /app, /privacy, /terms, and the
404.

### F-5-2 — MEDIUM — the release-workflow sentence is an unlisted claim

**Location and exact quote:** README, Test and build: “The release workflow
builds macOS, Windows, and Linux installers after a v* tag is pushed.”

**Evidence:** .factory/claims.json has 21 entries, but none covers the workflow
trigger and three-platform result. An untagged unit test reads the workflow and
checks its tag and asset configuration, but the claims contract requires the
public sentence itself to have one manifest entry and exactly one tagged test.

**Why this fails:** A maintainer can rely on this sentence when making a
release. Passing an unrelated or unlisted regression test does not make the
claim discoverable or independently runnable through the claims manifest.

**Concrete fix:** Add a tagged release-workflow claim to .factory/claims.json
and apply that tag to the existing workflow test, with a sandbox that reads the
workflow and asserts the v* trigger plus both macOS architectures, Windows, and
Linux. Alternatively, remove the sentence.

### F-5-3 — MINOR — “Use CSV now” does not explain the use

**Location and exact quote:** landing walkthrough step 3: “Use CSV now.”

**Why this fails:** “Now” is a mood word, and the sentence gives no action or
reason that helps a visitor choose the format.

**Concrete fix:** Replace it with: “Use the CSV in a spreadsheet.”

### F-5-4 — MINOR — “account scraping” is browser jargon

**Location and exact quote:** landing privacy section: “No account scraping.”

**Why this fails:** A food-tracker user should not need to know what scraping
means to understand the account boundary.

**Concrete fix:** Replace it with: “The app does not sign in to your tracker.”

### F-5-5 — MINOR — “unmapped” is unexplained data-processing jargon

**Location and exact quote:** landing privacy section: “Unmapped fields are
reported.”

**Why this fails:** The surrounding page otherwise uses the plainer term
“unrecognized fields”. Changing terms makes the same behavior sound like a
different concept.

**Concrete fix:** Replace it with: “Unrecognized fields appear in conversion
notes.”

### F-5-6 — MINOR — README uses “map” for field recognition

**Location and exact quote:** README opening: “Files, rows, and populated fields
it cannot map appear in conversion notes.”

**Why this fails:** “Map” is implementation jargon and does not say what the
app failed to recognize.

**Concrete fix:** Replace it with: “Files, rows, and populated fields the app
does not recognize appear in conversion notes.”

### F-5-7 — MINOR — README repeats the unexplained “unmapped” term

**Location and exact quote:** README opening: “JSON preserves those unmapped
field values.”

**Why this fails:** “Those” points to the previous jargon term, while the
landing page uses “unrecognized fields”.

**Concrete fix:** Replace it with: “JSON preserves those original field
values.”

### F-5-8 — MINOR — bare “tracker” changes the established meaning

**Location and exact quote:** README opening: “The project has no tracker,
account system, food-data server, or medical advice.”

**Why this fails:** Everywhere else, “food tracker” means the source product.
Here, bare “tracker” may mean a food log or analytics tracking, and “has no
medical advice” is also unnatural phrasing.

**Concrete fix:** Replace it with: “The project does not track meals, require
an account, store food data on a server, or give medical advice.”

### F-5-9 — MINOR — “platform-specific open step” is indirect jargon

**Location and exact quote:** README installer section: “Review the release
notes for the platform-specific open step.”

**Why this fails:** The reader needs instructions for their system, not an
abstract “platform-specific step”.

**Concrete fix:** Replace it with: “Review the release notes for the steps to
open the app on your system.”

### F-5-10 — MINOR — “desktop shell” names the implementation, not the task

**Location and exact quote:** README Run locally: “Rust is needed only for the
desktop shell.”

**Why this fails:** A contributor needs to know when Rust is required. “Desktop
shell” does not name the build task.

**Concrete fix:** Replace it with: “Rust is needed only to build the desktop
app.”

## Copy audit

Counts treat hyphenated terms, product names, filenames, URLs, and inline code
as one word. Repeated navigation labels are listed once. Sample table values
and command lines are data, not sentences. Metadata, headings, actions, useful
fragments, and image descriptions are included so their clarity is checked.

No item exceeds 22 words. No banned marketing adjective appears. Landing
buttons use result-naming verbs: **Try**, **Download**, **Read**, and **Buy**.
Navigation links use destination names. The flags below are the findings above.

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
| Desktop app · version 0.1.6 | 4 | — |
| Download the desktop app | 4 | — |
| The app reads CSV and JSON exports. | 7 | — |
| It also works when your internet is off. | 8 | — |
| Download for Linux | 3 | — |
| Food.Log.Export.Kit_0.1.6_amd64.AppImage | 1 | — |
| Read release notes | 3 | — |
| Review before export | 3 | — |
| Review entries and conversion notes | 5 | — |
| Invalid values, skipped rows, and populated unrecognized fields appear in conversion notes. | 12 | — |
| How it works | 3 | — |
| How to turn an export into an archive | 8 | — |
| Choose your export | 3 | — |
| Open a CSV or JSON file from your tracker. | 9 | — |
| The app screen for choosing a tracker export. | 8 | — |
| Review conversion notes | 3 | — |
| Check missing fields and rows before saving anything. | 8 | — |
| A conversion note explaining an unusable row. | 7 | — |
| Save CSV and JSON | 4 | — |
| Use CSV now. | 3 | F-5-3 |
| Keep JSON with consistent fields and conversion notes. | 8 | — |
| Two filled food-log rows above Export CSV and Export JSON buttons. | 11 | — |
| Privacy and limits | 3 | — |
| How the app handles your files | 6 | — |
| Your files stay local. | 4 | — |
| The app has no food-data server. | 6 | — |
| No account scraping. | 3 | F-5-4 |
| Use exports you requested from your tracker. | 7 | — |
| No nutrition advice. | 3 | — |
| Numbers are copied and labeled, not judged. | 7 | — |
| Unmapped fields are reported. | 4 | F-5-5 |
| The app names them and keeps their values in JSON. | 10 | — |
| Batch-import license | 2 | — |
| Combine several exports for $19 | 5 | — |
| The free app handles one file at a time. | 9 | — |
| The batch-import license adds multi-file selection for migrations split across years or apps. | 13 | — |
| One-time purchase | 2 | — |
| Paste the license token on another device | 7 | — |
| CSV and JSON export stay free | 6 | — |
| Buy the batch-import license | 4 | — |
| Sociobot opens a checkout page hosted by Dodo. | 8 | — |
| Read the terms. | 3 | — |
| Turn food tracker exports into a local archive. | 8 | — |
| Built by Param Factory | 4 | — |
| Version 0.1.6 · release repair · Generated artwork | 6 | — |

### README

| Copy | Words | Flag |
| --- | ---: | --- |
| Food Log Export Kit | 4 | — |
| Turn food tracker exports into a local archive. | 8 | — |
| Food Log Export Kit is for people leaving a food tracker. | 11 | — |
| It reads CSV and JSON food tracker exports. | 8 | — |
| It keeps meal, recipe, nutrition, and weight fields. | 8 | — |
| It exports a CSV and JSON archive. | 7 | — |
| Files, rows, and populated fields it cannot map appear in conversion notes. | 12 | F-5-6 |
| JSON preserves those unmapped field values. | 6 | F-5-7 |
| The website and desktop app convert food data on your device. | 11 | — |
| The project has no tracker, account system, food-data server, or medical advice. | 12 | F-5-8 |
| The sample demo contacts only this website. | 7 | — |
| Live site | 2 | — |
| Demo | 1 | — |
| Supported input | 2 | — |
| CSV files separated by commas, semicolons, or tabs | 8 | — |
| JSON arrays and objects with entries, records, meals, foods, items, or data lists | 13 | — |
| CSV headings for dates, meals, foods, recipes, amounts, energy, macros, and weights | 12 | — |
| Dates in YYYY-MM-DD order; impossible or ambiguous numeric dates appear in conversion notes | 13 | — |
| Dot decimals, grouped commas such as 1,234, and decimal commas such as 1,5; comma interpretations are noted | 17 | — |
| The free app imports one file at a time. | 9 | — |
| A $19 one-time batch-import license adds multi-file selection. | 8 | — |
| Paste its token to restore it on another device. | 9 | — |
| CSV and JSON export stay free. | 6 | — |
| License checks send only the token to the Sociobot billing API. | 11 | — |
| Install the desktop app | 4 | — |
| The landing page selects the published build for your system. | 10 | — |
| On Linux or macOS, the installer checks that the downloaded file was not changed. | 14 | — |
| It installs the food-log-export-kit command so you can run it from a terminal. | 12 | — |
| On Windows, this command verifies and starts the MSI installer. | 10 | — |
| Review the release notes for the platform-specific open step. | 9 | F-5-9 |
| Run locally | 2 | — |
| Requires Node.js 22. | 3 | — |
| Rust is needed only for the desktop shell. | 8 | F-5-10 |
| Open http://127.0.0.1:4173/demo for the isolated sample workspace. | 7 | — |
| Test and build | 3 | — |
| npm run build:site writes the deployable website to dist/site/, with index.html at that root. | 14 | — |
| npm run build:app writes the Tauri frontend to dist/app/. | 9 | — |
| The release workflow builds macOS, Windows, and Linux installers after a v* tag is pushed. | 15 | F-5-2 |
| Tested product claims are listed in .factory/claims.json. | 7 | — |
| Demo behavior is documented in .factory/demo.md. | 6 | — |
| Project map | 2 | — |
| src/importer.ts — format detection and normalization | 5 | — |
| src/exporter.ts — CSV and portable JSON output | 6 | — |
| src/app.ts — local workspace and demo | 5 | — |
| src-tauri/ — Tauri 2 desktop shell | 5 | — |
| .github/workflows/release.yml — cross-platform release builds | 4 | — |
| Deploy | 1 | — |
| Publish dist/site/ as a static site. | 6 | — |
| The included hosting config defines reload routes, security headers, cache rules, and the 404 response. | 15 | — |
| The factory handles DNS and deployment. | 6 | — |
| Privacy and license | 3 | — |
| The MIT license covers the source code. | 7 | — |
| Product terms for the batch-import license are available at /terms; data handling details are at /privacy. | 16 | — |

Developer commands and project-map labels use technical names only where they
identify required tools, files, or build output. The README has no
product-interface buttons.

### Terminology

| Concept | Intended term | Result |
| --- | --- | --- |
| Input file from another tracker | export | Consistent |
| Saved collection | archive | Consistent |
| Spreadsheet output | CSV | Consistent |
| Structured output | JSON | Consistent |
| Import warning or preservation detail | conversion note | Consistent |
| Paid multi-file capability | batch-import license | Consistent |
| Isolated sample environment | demo | Consistent |
| Source product category | food tracker | F-5-8 uses bare “tracker” |
| Source field the app does not recognize | unrecognized field | F-5-5 through F-5-7 use “map/unmapped” |

## Demo, sandbox, privacy, and offline behavior

- The landing action opens /?demo=1 in one click. Direct /demo also works.
- At 390 × 844, the banner, Reset demo, Start for real, “14 Apr · Breakfast”,
  “Oatmeal with blueberries”, and “342 kcal” are visible without scrolling.
  The named sample record ends at y=602.
- Filtering to Recipes produces “0 shown”; **Reset demo** restores “12 shown”,
  the heading “12 entries are ready”, and the oatmeal sample.
- **Start for real** opens /app at “Choose a tracker export” with no sample
  rows.
- A pre-existing real-storage probe remains unchanged through reset and exit.
  Direct demo mode adds no local-storage key, session-storage key, cookie, or
  IndexedDB database. Sample records remain in JavaScript memory.
- Direct live demo entry, reset, CSV export, JSON export, and exit make only
  same-origin requests. The landing page separately asks GitHub for release
  metadata, as disclosed on Privacy.
- The CSV download has one header plus 12 data rows. The JSON archive has 12
  records.
- After the service worker takes control, the live /demo reloads offline with
  the 12-entry heading and named sample record.

The one-click demo and sandbox requirements pass.

## Claims gate

A clean clone at /tmp/food-log-review5.61ploY/repo was created with
git clone --no-local, followed by npm ci. Every exact command in
.factory/claims.json ran independently and passed. Every manifest ID appears
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
| static-hosting | PASS |

The full clean-clone gate also passed: npm test reported 23 unit tests and 49
browser tests passing, with four intentional cross-project skips. npm run build
produced dist/site/. The largest initial JavaScript chunk is 38.71 kB raw and
13.67 kB gzip.

F-5-2 is the only unlisted claim-like sentence found on the live landing page
or in README. It has related untagged coverage, but it is not independently
runnable through the claims manifest.

## Earlier-history recheck

Every earlier review, polish report, and the prior handoff was read. Each prior
finding was checked on the live site and in current source or its regression
test.

| Earlier finding | Live and code result |
| --- | --- |
| F-1-1 mobile demo hid the sample record | **Fixed.** The named record ends at y=602; the mobile regression passes. |
| F-1-2 public claims were incomplete | **Fixed for the earlier statements.** All 21 current manifest commands pass. F-5-2 is a newly identified README workflow statement. |
| F-1-3 Back did not focus the landing heading | **Fixed.** Privacy focuses its h1; Back focuses “Save your food history”. |
| F-1-4 404 lacked metadata and shared footer | **Fixed.** The HTTP 404 has route metadata, navigation, legal links, attribution, and version. |
| F-1-5 first action did not name formats | **Fixed.** It names CSV and JSON. |
| F-1-6 decorative exit labels | **Fixed.** The eyebrow is “Export food tracker history”; the slogan is absent. |
| F-1-7 indirect desktop heading | **Fixed.** It is “Download the desktop app”. |
| F-1-8 context-free preview label | **Fixed.** It is “Review before export”. |
| F-1-9 metaphor workflow heading | **Fixed.** It is “How to turn an export into an archive”. |
| F-1-10 generic privacy heading | **Fixed.** It is “Privacy and limits” / “How the app handles your files”. |
| F-1-11 slogan pricing label | **Fixed.** It is “Batch-import license”. |
| F-1-12 long README opening | **Fixed.** Every current sentence is under 22 words. |
| F-2-1 / F-1-2 lossy fields were dropped | **Fixed.** Unknown fields are named and preserved; the tagged claim passes. |
| F-2-2 checkout host was misstated | **Fixed.** Copy names Dodo; live checkout returns 303 to checkout.dodopayments.com. |
| F-2-3 app/demo omitted navigation/footer | **Fixed for the omission.** Both have semantic navigation and the full footer. F-5-1 is the narrower destination mismatch. |
| F-2-4 /app used the landing canonical | **Fixed.** Canonical and OG URL are /app. |
| F-2-5 404 build marker was stale | **Fixed.** Static and rendered footers say version 0.1.6 · release repair. |
| F-2-6 calorie/food tracker terms differed | **Fixed for the source product.** Public audience and input copy use “food tracker”; F-5-8 concerns one ambiguous bare noun. |
| F-2-7 paid tier had three names | **Fixed.** Public tier copy uses “batch-import license”. |
| F-2-8 archive named the free app | **Fixed.** It says “The free app”. |
| F-2-9 README used “desktop webview” | **Fixed.** It says “website and desktop app”. |
| F-2-10 README used “cross-origin requests” | **Fixed.** It says the demo “contacts only this website”. |
| F-2-11 README used “ISO” | **Fixed.** It names YYYY-MM-DD directly. |
| F-2-12 README used “SPA routing” | **Fixed.** It names reload routes and hosting behavior. |
| F-3-1 “Read the notes” was ambiguous | **Fixed.** It is “Review conversion notes”. |
| F-3-2 “Save both formats” was ambiguous | **Fixed.** It is “Save CSV and JSON”. |
| F-3-3 “normalized” was unexplained | **Fixed.** Landing copy names consistent fields and conversion notes. |
| F-3-4 README used “checksum” | **Fixed.** It explains that verification checks whether the file changed. |
| F-3-5 README used “PATH” | **Fixed.** It explains that the installed command runs from a terminal. |
| F-3-6 release notes had no destination | **Fixed.** The live release-notes link returns 200. |
| F-4-1 “every row” was an unlisted absolute claim | **Fixed.** The heading is “Review entries and conversion notes”; the absolute wording is absent. |
| F-4-2 walkthrough image did not show export state | **Fixed.** The current image visibly contains two populated rows and both export controls; its alt text matches. |

No earlier finding is reopened.

## Structure, routing, accessibility, and visual identity

- /, /demo, /app, /privacy, and /terms return 200. An unknown URL returns a
  designed HTTP 404.
- Every checked route has html lang=en, one h1, one main, ordered headings, a
  route-specific title under 60 characters, a description, canonical,
  OG/Twitter metadata, SVG favicon, Apple-touch icon, and image alternatives.
- robots.txt, sitemap.xml, the 1200 × 630 social image, and security headers are
  present. The CSP is delivered as a response header and includes
  frame-ancestors 'none'.
- Deep links reload. Browser Back restores focus to the landing h1 after the
  route render, and route changes are announced.
- Every discovered same-origin link and fragment resolves. The selected release
  page returns 200, the AppImage returns its expected GitHub 302, Sociobot
  returns 200, checkout returns its expected Dodo 303, and mailto links are
  explicit.
- The worker verifier reports no console, structure, alt, or control-label
  error on all five 200 routes. Live Axe scans at 1440 × 900 and 390 × 844
  report zero violations on those routes and the HTTP 404. Repository checks
  cover keyboard use, reduced motion, 200% scaling, 44 px targets, and mobile
  overflow.
- The dusk-kitchen art, recipe archive box, paper ledger, clipped labels,
  serif/system type pairing, and forest/apricot palette match
  .factory/design.md. The product is visually distinct rather than a generic
  SaaS template.

F-5-1 is the remaining shared-header structure issue. Routing itself is not
broken.

## Missed leverage

No missing AI feature, sync, or additional import/export path is identified.
The brief calls for deterministic, local validation and CSV/JSON output, which
the product provides. AI would add privacy and reliability costs without
improving the migration job. Batch import, offline use, unknown-field
reporting, and both export formats already cover the obvious leverage.

## What would make this perfect

Use the same four navigation destinations on every route; declare and tag the
release-workflow claim or remove it; then apply the eight concrete copy
rewrites above. Re-run all 21 declared claims plus the new workflow claim if it
is retained, the full clean-clone suite, copy audit, live route crawl, 390 px
first-view check, demo storage/request audit, and Back-focus check. A perfect
round has no remaining finding.
