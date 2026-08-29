# Adversarial first-read review 3

Reviewed 2026-08-29 UTC against <https://food-log-export-kit.sociobot.in> and commit `606d61cce0cc9b703613f7270198947a3584e388`.

## Verdict: FAIL

No blocking defect was found. The first screen, demo, sandbox, declared claims, routes, accessibility checks, and build all pass. The required verdict is still **FAIL** because six minor copy and navigation findings remain. A PASS requires zero findings.

## Cold first read

Fresh browser contexts were opened at 390 × 844 and 1440 × 900 without scrolling.

- **What it does:** saves food-tracker history as CSV and JSON files.
- **Who it is for:** food-tracker users who want years of meals and recipes in files they control.
- **What to click first:** **Try it with sample data**. The adjacent sentence says this opens 12 entries and downloads a CSV and JSON archive.

The exact first-screen text was “Save your food history”, “For food tracker users who need years of meals and recipes in files they control”, and “Try it with sample data”. All three questions are answered on both viewports. At 390 px, the complete three-fact list ended at y=792 in an 844 px viewport. There was no horizontal overflow or console error.

## Findings

### F-3-1 — MINOR — a workflow heading does not identify which notes to read

**Location and exact quote:** landing walkthrough heading: “Read the notes”.

**Why this fails:** A heading must make sense when read outside its surrounding card. “The notes” could mean release notes, personal notes, or conversion notes.

**Concrete fix:** Replace it with **“Review conversion notes”**.

### F-3-2 — MINOR — a workflow heading relies on an unnamed antecedent

**Location and exact quote:** landing walkthrough heading: “Save both formats”.

**Why this fails:** “Both” does not name the output formats in a heading list. A visitor must read surrounding text to learn that it means CSV and JSON.

**Concrete fix:** Replace it with **“Save CSV and JSON”**.

### F-3-3 — MINOR — “normalized” is unexplained data-processing jargon

**Locations and exact quotes:** landing hero caption: “Keep a CSV for spreadsheets and JSON for a normalized local record.” Walkthrough: “Keep JSON as the normalized archive.”

**Why this fails:** A first-time food-tracker user is not told what “normalized” changes or preserves. The word carries no usable meaning without technical context.

**Concrete fix:** Use **“Keep a CSV for spreadsheets. JSON keeps consistent fields and conversion notes.”** and **“Keep JSON with consistent fields and conversion notes.”**

### F-3-4 — MINOR — the README uses “checksum” without explaining the result

**Location and exact quote:** README install section: “On Linux or macOS, the installer verifies the release checksum.”

**Why this fails:** “Checksum” is implementation jargon. The reader needs the security outcome, not the mechanism name.

**Concrete fix:** Replace it with **“On Linux or macOS, the installer checks that the downloaded file was not changed.”**

### F-3-5 — MINOR — the README uses “PATH” without explaining the user-visible result

**Location and exact quote:** README install section: “It adds a `food-log-export-kit` launcher to PATH.”

**Why this fails:** A non-developer may not know what PATH means or how the change helps them.

**Concrete fix:** Replace it with **“It installs the `food-log-export-kit` command so you can run it from a terminal.”**

### F-3-6 — MINOR — the release-notes instruction has no release-notes link

**Locations and exact quotes:** live download note: “Food.Log.Export.Kit_0.1.4_amd64.AppImage · Check the release notes before installing.” README: “Review the release notes for the platform-specific open step.”

**Why this fails:** The landing action immediately downloads the installer, while the adjacent instruction and README do not provide a release-notes destination. The visitor is told to complete a safety step but is not given the route.

**Concrete fix:** Add a visible **“Read release notes”** link beside the download, pointing to the selected GitHub release page. Link “release notes” to the same destination in the README and add that destination to the link-crawl test.

## Copy audit

Counts treat hyphenated terms, product names, file names, URLs, and inline code as one word. Punctuation separators are not words. Repeated navigation labels are listed once. Sample table values and shell commands are data rather than sentences. Metadata, headings, actions, useful fragments, and image alt text are included so their clarity is checked too.

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
| Keep a CSV for spreadsheets and JSON for a normalized local record. | 12 | F-3-3 |
| A recipe card archive box in a quiet kitchen at dusk. | 11 | — |
| Desktop app · version 0.1.4 | 4 | — |
| Download the desktop app | 4 | — |
| The app reads CSV and JSON exports. | 7 | — |
| It also works when your internet is off. | 8 | — |
| Download for Linux | 3 | — |
| Food.Log.Export.Kit_0.1.4_amd64.AppImage · Check the release notes before installing. | 7 | F-3-6 |
| Review before export | 3 | — |
| See every row before you export | 6 | — |
| Invalid values, skipped rows, and populated unrecognized fields appear in conversion notes. | 12 | — |
| How it works | 3 | — |
| How to turn an export into an archive | 8 | — |
| Choose your export | 3 | — |
| Open a CSV or JSON file from your tracker. | 9 | — |
| The app screen for choosing a tracker export. | 8 | — |
| Read the notes | 3 | F-3-1 |
| Check missing fields and rows before saving anything. | 8 | — |
| A conversion note explaining an unusable row. | 7 | — |
| Save both formats | 3 | F-3-2 |
| Use CSV now. | 3 | — |
| Keep JSON as the normalized archive. | 6 | F-3-3 |
| The filled review table with CSV and JSON export buttons. | 10 | — |
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
| Batch-import license | 2 | — |
| $19 | 1 | — |
| One time | 2 | — |
| Buy the batch-import license | 4 | — |
| Sociobot opens a checkout page hosted by Dodo. | 8 | — |
| Read the terms. | 3 | — |
| Turn food tracker exports into a local archive. | 8 | — |
| Built by Param Factory | 4 | — |
| Version 0.1.4 · repair 4 · Generated artwork | 6 | — |

No landing sentence exceeds 22 words or contains a banned marketing word. F-3-1 and F-3-2 are context-dependent headings; F-3-3 is jargon; F-3-6 is an action without a destination. All buttons and action links otherwise use result-naming verbs.

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
| On Linux or macOS, the installer verifies the release checksum. | 10 | F-3-4 |
| It adds a `food-log-export-kit` launcher to PATH. | 7 | F-3-5 |
| On Windows, this command verifies and starts the MSI installer. | 10 | — |
| Review the release notes for the platform-specific open step. | 9 | F-3-6 |
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

No README sentence exceeds 22 words or contains a banned marketing word. Technical terms in the developer-only run, build, and project-map sections are appropriately scoped. The two unexplained installer terms are F-3-4 and F-3-5; the missing release-notes destination is F-3-6. The README has no product-interface buttons.

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

## Demo, sandbox, and privacy

- The first landing action opens `/?demo=1` in one click. Direct `/demo` also works.
- At 390 × 844, “14 Apr · Breakfast · Oatmeal with blueberries · 342 kcal” occupied y=521–616, fully inside the first viewport.
- The persistent banner says “Demo — sample data, nothing is saved” and includes **Reset demo** and **Start for real**.
- Filtering to Recipes produced “0 shown”; **Reset demo** restored “12 shown”.
- **Start for real** opened `/app` with an empty import workspace and no sample rows.
- Pre-existing `real:sentinel` local storage and `real:session` session storage values were unchanged through demo entry, reset, and exit. The demo added no cookie or storage key.
- A direct live `/demo` flow made no cross-origin request. The landing page separately requests the GitHub release API, which the Privacy page discloses.
- The live demo reloaded offline with all 12 sample records after its service worker took control.

The demo and sandbox requirements pass.

## Claims gate

A clean clone was created with `git clone --no-local`, followed by `npm ci`. Every exact command in `.factory/claims.json` was run independently. Each manifest ID appears exactly once as a test tag.

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

No unlisted claim-like sentence was found on the live landing page or in the README. The full clean-clone gate also passed: `npm test` reported 18 unit tests and 44 browser tests passed, with four intentional project skips. `npm run build` and `npm run build:app` both passed. The largest initial JavaScript chunk was 38.13 kB raw and 13.51 kB gzip.

## Earlier-history recheck

I read `.factory/review-1.md`, `.factory/review-2.md`, `.factory/polish-1.md`, `.factory/polish-2.md`, and the prior handoff. Every earlier finding was checked on the live site and in current source or its regression test.

| Earlier finding | Live and code result |
| --- | --- |
| F-1-1 mobile demo did not show a record | **Fixed.** The named oatmeal record ends at y=616 in an 844 px viewport; the mobile regression test passes. |
| F-1-2 public claims inventory was incomplete | **Fixed.** There are 20 declared claims, each with one tag; all exact commands pass. No unlisted live/README claim was found. |
| F-1-3 Back did not restore heading focus | **Fixed.** Back returns focus to “Save your food history”; the regression test passes. |
| F-1-4 404 lacked route metadata/shared footer | **Fixed.** The live HTTP 404 has route metadata, normal navigation, footer, attribution, and current build marker. |
| F-1-5 action outcome did not name formats | **Fixed.** It names CSV and JSON beside the primary action. |
| F-1-6 decorative exit labels | **Fixed.** The live eyebrow is “Export food tracker history”; the slogan is absent. |
| F-1-7 indirect desktop heading | **Fixed.** It is “Download the desktop app”. |
| F-1-8 context-free preview label | **Fixed.** It is “Review before export”. |
| F-1-9 metaphor workflow heading | **Fixed.** It is “How to turn an export into an archive”. |
| F-1-10 generic privacy heading | **Fixed.** It is “Privacy and limits” / “How the app handles your files”. |
| F-1-11 slogan pricing eyebrow | **Fixed.** It is “Batch-import license”. |
| F-1-12 24-word README opening | **Fixed.** It is split into short concrete sentences. |
| F-2-1 / F-1-2 lossy fields were silently dropped | **Fixed.** A live Fiber import produced a named conversion note and JSON `unmapped_fields.Fiber = "12"`; the claim test passes. |
| F-2-2 checkout host was misstated | **Fixed.** Copy names Dodo hosting through Sociobot; the live endpoint returned 303 to `checkout.dodopayments.com`. |
| F-2-3 app/demo omitted shared navigation/footer | **Fixed.** Both routes contain semantic navigation, Privacy, Terms, attribution, and the shared footer. |
| F-2-4 `/app` used the landing canonical | **Fixed.** Its canonical and OG URL are `/app`. |
| F-2-5 404 build label was stale | **Fixed.** Static and rendered footers both show “Version 0.1.4 · repair 4 · Generated artwork”. |
| F-2-6 calorie/food tracker terminology differed | **Fixed.** Public copy consistently uses “food tracker”. |
| F-2-7 paid tier had three names | **Fixed.** Public copy consistently uses “batch-import license”. |
| F-2-8 archive was used for the free app | **Fixed.** The sentence now says “The free app”. |
| F-2-9 README used “desktop webview” | **Fixed.** It says “website and desktop app”. |
| F-2-10 README used “cross-origin requests” | **Fixed.** It says the demo “contacts only this website”. |
| F-2-11 README used unnecessary “ISO” | **Fixed.** It names `YYYY-MM-DD` directly. |
| F-2-12 README used “SPA routing” | **Fixed.** It describes app-route reload behavior. |

No earlier finding is reopened. F-3-1 through F-3-6 are newly identified copy defects.

## Structure, routing, accessibility, and visual identity

- `/`, `/demo`, `/app`, `/privacy`, and `/terms` returned 200. An unknown URL returned a designed HTTP 404.
- Each route had `lang=en`, one `<h1>`, one `<main>`, a route-specific title, description, canonical, OG/Twitter data, favicon, and Apple-touch icon.
- `robots.txt` and `sitemap.xml` are present. Deep-link reloads work. Back navigation restores heading focus.
- Every discovered same-origin link and anchor resolved. The published AppImage returned its expected GitHub 302; checkout returned its expected Dodo 303; `mailto:` links were exempt.
- `/opt/fleet/lib/verify-url.sh` passed the landing and demo with no console, structure, alt, or button-label errors.
- Live Playwright axe scans at 390 × 844 and 1440 × 900 reported zero WCAG 2 A/AA violations on all six checked routes. Keyboard, 200% text, 44 px touch targets, reduced motion, and mobile overflow also pass the repository suite.
- The kitchen-at-dusk artwork, archive-box motif, paper ledger, serif display face, clipped labels, and forest/apricot palette match `.factory/design.md`. The site is visually distinct and does not use a generic SaaS hero or feature-card template.

Structure and visual identity pass. F-3-6 concerns the missing release-notes destination, not a dead existing link.

## Missed leverage

No missing AI feature is identified. Import validation, lossy-field reporting, CSV export, JSON export, batch import, and offline use cover the brief’s obvious leverage. The work is deterministic; adding AI or sync would add privacy and reliability costs without serving the migration job.

## What would make this perfect

Rename the two context-dependent walkthrough headings, explain the JSON result without “normalized”, replace the README’s checksum/PATH jargon, and link the release-notes instruction to the selected release. Then rerun the copy audit and link crawl. No functional, demo, privacy, claim, accessibility, routing, build, or visual change is otherwise indicated by this review.
