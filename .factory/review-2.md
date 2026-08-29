# Adversarial first-read review 2

Reviewed 2026-08-29 UTC against <https://food-log-export-kit.sociobot.in> and commit `ad419455d79abbeb8f00befb0d82114ee2400bf7`.

## Verdict: FAIL

The landing page and demo pass the 30-second first-read test, and all 19 declared claim commands pass from a clean clone. The product still fails because an unrecognized, populated input field is silently discarded while the live UI says every row was explained and the landing page calls JSON complete. The checkout copy also names the wrong host. Additional shell, metadata, terminology, and README copy findings remain. A PASS requires zero findings.

## Cold first read

Fresh contexts were opened at 390 × 844 and 1440 × 900 without scrolling.

- **What it does:** saves a calorie-tracker history as CSV and JSON files.
- **Who it is for:** calorie-tracker users who want years of meals and recipes in files they control.
- **What to click first:** **Try it with sample data**. The adjacent sentence says this opens 12 entries and lets the visitor download CSV and JSON.

The exact first-screen text was “Save your food history”, “For calorie tracker users who need years of meals and recipes in files they control”, and “Try it with sample data”. All three questions are answered on both viewports. The mobile page had no horizontal overflow or console errors.

## Findings

### F-2-1 / F-1-2 (reopened) — BLOCKING — lossy fields are silently dropped while the product claims a complete, explained result

**Locations and exact quotes:** landing: “Keep a CSV for spreadsheets and JSON for a complete local record”, “Keep JSON as the complete archive”, and “No silent drops.” App: “Every imported row was explained.” Terms: “The app preserves supplied values.” Brief: “flag lossy fields”.

**Evidence:** In a fresh live `/app` context, I imported:

```csv
Date,Food,Calories,Fiber
2026-08-29,Bean bowl,430,12
```

The review screen showed “No conversion notes” and “Every imported row was explained.” The JSON export had `issue_count: 0`; its only record omitted `Fiber`, and the archive contained no occurrence of `fiber`. In code, `src/importer.ts` maps only known aliases and never compares source keys with that alias set. `.factory/claims.json` has no lossy-field claim or test. The Terms claim that a refunded license stops batch access is also not covered: `@claim:revoked-license` exercises only a revoked replacement token.

**Why this fails:** Silent loss is the precise failure this migration tool promises to reveal. “Complete”, “no silent drops”, “preserves supplied values”, and “every imported row was explained” are false for a normal tracker-specific field. The claims inventory remains incomplete, so prior finding F-1-2 was only partly repaired.

**Concrete fix:** Detect every populated source column or JSON key that is not mapped. Preserve it in an `unmapped_fields` area or add a conversion note naming the field, source, and affected rows. Change “complete archive” to “normalized archive” until preservation is real. Replace “Every imported row was explained” with a statement that is true for both row and field loss. Add one `lossy-fields` manifest entry and exactly one tagged test that imports the fixture above, asserts a visible `Fiber` note, and finds the same note in JSON. Add a separate fixture/test for the refunded-license sentence or remove “refunded”.

### F-2-2 — BLOCKING — checkout is said to be hosted by Sociobot, but the tested checkout is hosted by Dodo

**Location and exact quote:** landing pricing ticket: “Checkout is hosted by Sociobot.”

**Evidence:** `@claim:paid-purchase` passed by confirming the Sociobot endpoint returns HTTP 303 to `https://checkout.dodopayments.com/session/...`. The manifest itself says “Dodo hosted checkout through Sociobot.”

**Why this fails:** The sentence misidentifies the third party that receives the checkout visit. That is material payment and privacy information.

**Concrete fix:** Replace it with: “Sociobot opens a checkout page hosted by Dodo.” Keep the existing redirect test.

### F-2-3 — MEDIUM — the app and demo routes omit the required shared navigation and footer

**Location:** live `/app` and `/demo`; `src/app.ts:35-44` and `src/app.ts:100-104`.

**Evidence:** Both routes have one app header, no `<nav>` in that header, and zero `<footer>` elements. They expose only Home and Privacy. Landing, Privacy, Terms, and 404 use the shared navigation and footer with Privacy, Terms, Param Factory, and version/build text.

**Why this fails:** The site-structure contract requires a consistent header and a footer on every route. A visitor in the working product cannot reach Terms directly or verify the product/build identity from the route.

**Concrete fix:** Add a compact semantic `<nav>` to the app header and reuse a compact shared footer on `/app` and `/demo`, including Privacy, Terms, Param Factory, and the current version/build marker.

### F-2-4 — MEDIUM — `/app` advertises the landing page as its canonical URL

**Location:** live `/app`; `src/main.ts:25`.

**Evidence:** `/app` returns 200, has its own title and description, and appears in `sitemap.xml`, but its canonical is `https://food-log-export-kit.sociobot.in/`.

**Why this fails:** The route is a distinct deep-linked workspace, not a duplicate of the landing page. The sitemap and canonical give conflicting indexing instructions.

**Concrete fix:** Set the `/app` canonical to `/app`. If it should not be indexed, remove it from the sitemap and use an explicit robots directive instead of declaring the landing page canonical.

### F-2-5 — MINOR — the 404 footer carries a stale build label

**Location:** live 404 footer and `public/404.html:31`.

**Exact text:** 404: “Version 0.1.2 · repair 1 · Generated artwork”; normal routes: “Version 0.1.2 · build 3 · Generated artwork”.

**Why this fails:** The shared footer presents two build identities for the same deployed product.

**Concrete fix:** Generate both footers from one build identifier or update the static 404 marker to the current value.

### F-2-6 — MINOR — the same source product is called both a calorie tracker and a food tracker

**Locations and exact quotes:** hero: “For calorie tracker users…”; elsewhere: “food tracker exports”, “from your tracker”, and README “food-tracker exports”.

**Why this fails:** “Calorie tracker” is narrower than “food tracker”, so the intended input and audience appear to change.

**Concrete fix:** Use “food tracker” throughout: “For food tracker users who need years of meals and recipes in files they control.”

### F-2-7 — MINOR — the paid tier has three names

**Locations and exact quotes:** “Batch-import license”, “PERSONAL LICENSE”, “Buy the batch license”, and README “personal license”.

**Why this fails:** A buyer cannot tell whether these labels describe one license or different products.

**Concrete fix:** Use “batch-import license” in the heading, ticket, button, README, Terms, and app. Button: “Buy the batch-import license”.

### F-2-8 — MINOR — “archive” is used for the app instead of its output

**Location and exact quote:** pricing: “A free archive handles one file at a time.”

**Why this fails:** Elsewhere an archive is the JSON output. Here it unexpectedly means the free product tier.

**Concrete fix:** Replace it with: “The free app handles one file at a time.”

### F-2-9 — MINOR — README uses “desktop webview” without explaining it

**Location and exact quote:** README: “All food-data conversion happens in the browser or desktop webview.”

**Why this fails:** “Webview” is implementation jargon and does not help a user understand the privacy boundary.

**Concrete fix:** “The website and desktop app convert food data on your device.”

### F-2-10 — MINOR — README uses “cross-origin requests” instead of naming the observable boundary

**Location and exact quote:** README: “The sample demo makes no cross-origin requests.”

**Why this fails:** This is browser-security jargon rather than a plain privacy statement.

**Concrete fix:** “The sample demo contacts only this website.”

### F-2-11 — MINOR — README uses an unnecessary date-format acronym

**Location and exact quote:** README: “ISO dates in `YYYY-MM-DD` order; impossible and ambiguous numeric dates are noted”.

**Why this fails:** The concrete format already communicates the rule; “ISO” adds jargon.

**Concrete fix:** “Dates in `YYYY-MM-DD` order; impossible or ambiguous numeric dates appear in conversion notes.”

### F-2-12 — MINOR — README uses “SPA routing” where a concrete deployment result is clearer

**Location and exact quote:** README: “The included Static Web Apps config sets SPA routing, security headers, caching behavior, and the 404 response.”

**Why this fails:** “SPA routing” is unexplained implementation jargon.

**Concrete fix:** “The included hosting config keeps app routes working after reload and sets security headers, caching, and the 404 response.”

## Copy audit

Counts treat hyphenated terms, numbers, file names, and URLs as one word. Punctuation separators are not words. Repeated navigation labels are listed once. Code blocks and sample-table values are data rather than sentences; headings, actions, metadata, and image alt sentences are included so their clarity can also be checked.

### Landing page

| Copy | Words |
| --- | ---: |
| Food Log Export Kit — Save your food history | 8 |
| Turn food tracker exports into CSV and JSON files on your device. | 12 |
| Food Log Export Kit | 4 |
| Demo | 1 |
| How it works | 3 |
| Privacy | 1 |
| Export food tracker history | 4 |
| Save your food history | 4 |
| For calorie tracker users who need years of meals and recipes in files they control. | 15 |
| Try it with sample data | 5 |
| Review 12 sample entries, then download a CSV and JSON archive. | 11 |
| No uploads. | 2 |
| Conversion stays on this device. | 5 |
| No account. | 2 |
| Open a file and start. | 5 |
| Free for one file. | 4 |
| Batch import costs $19 once. | 5 |
| Keep a CSV for spreadsheets and JSON for a complete local record. | 12 |
| A recipe card archive box in a quiet kitchen at dusk. | 11 |
| Desktop app · version 0.1.2 | 4 |
| Download the desktop app | 4 |
| The app reads CSV and JSON exports. | 7 |
| It also works when your internet is off. | 8 |
| Download for Linux | 3 |
| Food.Log.Export.Kit_0.1.2_amd64.AppImage · Check the release notes before installing. | 7 |
| Review before export | 3 |
| See every row before you export | 6 |
| Missing or invalid dates and unreadable or comma-formatted numbers appear as notes. | 12 |
| Skipped files and rows are named. | 6 |
| How it works | 3 |
| How to turn an export into an archive | 8 |
| Choose your export | 3 |
| Open a CSV or JSON file from your tracker. | 9 |
| The app screen for choosing a tracker export. | 8 |
| Read the notes | 3 |
| Check missing fields and rows before saving anything. | 8 |
| A conversion note explaining an unusable row. | 7 |
| Save both formats | 3 |
| Use CSV now. | 3 |
| Keep JSON as the complete archive. | 6 |
| The filled review table with CSV and JSON export buttons. | 10 |
| Privacy and limits | 3 |
| How the app handles your files | 6 |
| Your files stay local. | 4 |
| The app has no food-data server. | 6 |
| No account scraping. | 3 |
| Use exports you requested from your tracker. | 7 |
| No nutrition advice. | 3 |
| Numbers are copied and labeled, not judged. | 7 |
| No silent drops. | 3 |
| Skipped files and rows appear in conversion notes. | 8 |
| Batch-import license | 2 |
| Combine several exports for $19 | 5 |
| A free archive handles one file at a time. | 9 |
| The license adds multi-file selection for migrations split across years or apps. | 12 |
| One-time purchase | 2 |
| Paste the license token on another device | 7 |
| CSV and JSON export stay free | 6 |
| Personal license | 2 |
| One time | 2 |
| Buy the batch license | 4 |
| Checkout is hosted by Sociobot. | 5 |
| Read the terms. | 3 |
| Turn food tracker exports into a local archive. | 8 |
| Terms | 1 |
| Built by Param Factory | 4 |
| Version 0.1.2 · build 3 · Generated artwork | 6 |

No landing sentence exceeds 22 words. The adjective “complete” is flagged in F-2-1. Terminology flags are F-2-6 through F-2-8. No landing button fails the result-naming verb check: **Try**, **Download**, **Buy**, and **Read** name their results. Navigation links are destination names, not action buttons. Headings are concrete and make sense out of context.

### README

| Copy | Words |
| --- | ---: |
| Food Log Export Kit | 4 |
| Turn food tracker exports into a local archive. | 8 |
| Food Log Export Kit is for people leaving a calorie tracker. | 11 |
| It reads CSV and JSON food-tracker exports. | 7 |
| It keeps meal, recipe, nutrition, and weight fields. | 8 |
| It exports a CSV and JSON archive. | 7 |
| Files and rows it cannot use appear in conversion notes. | 10 |
| All food-data conversion happens in the browser or desktop webview. | 10 |
| The project has no tracker, account system, food-data server, or medical advice. | 12 |
| The sample demo makes no cross-origin requests. | 7 |
| Live site | 2 |
| Demo | 1 |
| Supported input | 2 |
| CSV files separated by commas, semicolons, or tabs | 8 |
| JSON arrays and objects with `entries`, `records`, `meals`, `foods`, `items`, or `data` lists | 13 |
| CSV headings for dates, meals, foods, recipes, amounts, energy, macros, and weights | 12 |
| ISO dates in `YYYY-MM-DD` order; impossible and ambiguous numeric dates are noted | 12 |
| Dot decimals, grouped commas such as `1,234`, and decimal commas such as `1,5`; comma interpretations are noted | 17 |
| The free app imports one file at a time. | 9 |
| A $19 one-time personal license adds multi-file selection. | 8 |
| Paste its token to restore it on another device. | 9 |
| CSV and JSON export stay free. | 6 |
| License checks send only the token to the Sociobot billing API. | 11 |
| Install the desktop app | 4 |
| The landing page selects the published build for your system. | 10 |
| On Linux or macOS, the installer verifies the release checksum. | 10 |
| It adds a `food-log-export-kit` launcher to PATH. | 7 |
| On Windows, this command verifies and starts the MSI installer. | 10 |
| Review the release notes for the platform-specific open step. | 9 |
| Run locally | 2 |
| Requires Node.js 22. | 3 |
| Rust is needed only for the desktop shell. | 8 |
| Open `http://127.0.0.1:4173/demo` for the isolated sample workspace. | 7 |
| Test and build | 3 |
| `npm run build:site` writes the deployable website to `dist/site/`, with `index.html` at that root. | 14 |
| `npm run build:app` writes the Tauri frontend to `dist/app/`. | 9 |
| The release workflow builds macOS, Windows, and Linux installers after a `v*` tag is pushed. | 15 |
| Tested product claims are listed in `.factory/claims.json`. | 7 |
| Demo behavior is documented in `.factory/demo.md`. | 6 |
| Project map | 2 |
| `src/importer.ts` — format detection and normalization | 5 |
| `src/exporter.ts` — CSV and portable JSON output | 6 |
| `src/app.ts` — local workspace and demo | 5 |
| `src-tauri/` — Tauri 2 desktop shell | 5 |
| `.github/workflows/release.yml` — cross-platform release builds | 4 |
| Deploy | 1 |
| Publish `dist/site/` as a static site. | 6 |
| The included Static Web Apps config sets SPA routing, security headers, caching behavior, and the 404 response. | 17 |
| The factory handles DNS and deployment. | 6 |
| Privacy and license | 3 |
| The MIT license covers the source code. | 7 |
| Product terms for the paid batch license are available at `/terms`; data handling details are at `/privacy`. | 17 |

No README sentence exceeds 22 words. Jargon flags and rewrites are F-2-9 through F-2-12. The source-map fragments use technical names appropriately because they identify code files. The README has no user-interface buttons. Its headings name their sections and do not use mood copy.

## Demo, sandbox, and privacy

- The first landing action opens `/?demo=1` in one click. Direct `/demo` also works.
- At 390 × 844, the named sample card “14 Apr · Breakfast · Oatmeal with blueberries · 342 kcal” occupied y=483–578, fully inside the first viewport.
- The persistent banner says “Demo — sample data, nothing is saved” and includes **Reset demo** and **Start for real**.
- Filtering to Recipes produced “0 shown”; **Reset demo** restored “12 shown”.
- **Start for real** opened `/app` with the empty “Choose a tracker export” screen and no sample table.
- A pre-existing local-storage probe and session-storage probe were unchanged through reset and exit. A fresh direct demo had no local storage, session storage, or cookies.
- The live demo/import/export request log contained only `/demo` and the two same-origin compiled assets. It made no cross-origin request.
- The clean-clone `@claim:offline-reload` test passed after the service worker took control and the browser context went offline.

The demo requirement passes. It does not expose the lossy-field blocker because the supplied sample contains only recognized fields.

## Claims gate

A fresh clone was created with `git clone --no-local`, followed by `npm ci`. Every exact command in `.factory/claims.json` was run independently and passed.

| Claim ID | Result |
| --- | --- |
| csv-export | PASS |
| json-archive | PASS |
| local-only | PASS |
| format-import | PASS |
| explained-drops | PASS |
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

Passing declared tests does not clear F-2-1: the lossy-field and refunded-license statements are not declared. It does not clear F-2-2: the payment test proves the live sentence uses the wrong host name.

The full clean-clone gate also passed: `npm test` reported 39 passed and 4 intentional skips; `npm run build` produced `dist/site/`. The largest initial JavaScript chunk was 36.87 kB raw and 13.20 kB gzip.

## Earlier-history recheck

I read `.factory/review-1.md`, `.factory/polish-1.md`, and `.factory/handoff.md`, then checked each finding in both the live site and current code.

| Earlier finding | Live and code result |
| --- | --- |
| F-1-1 mobile demo did not show a record | **Fixed.** The oatmeal card is fully visible at 390 px, and the mobile regression test asserts it. |
| F-1-2 public claims inventory was incomplete | **Not fully fixed; reopened as F-2-1.** Token-only verification was added and the old claims were narrowed, but “complete”, field preservation, and refunded-license wording remain outside adequate claim coverage. |
| F-1-3 Back did not restore heading focus | **Fixed.** Live `/` → `/privacy` → Back focuses the landing `<h1>` after render; the regression test passes. |
| F-1-4 404 lacked route metadata/shared footer | **Fixed for the named omissions.** Live 404 returns HTTP 404 and has canonical, OG/Twitter, Apple-touch, navigation, Param Factory, and a version marker. The new stale-marker inconsistency is F-2-5. |
| F-1-5 action outcome did not name formats | **Fixed.** It now says “download a CSV and JSON archive.” |
| F-1-6 decorative exit labels | **Fixed.** The live eyebrow is “Export food tracker history”; the second label is gone. |
| F-1-7 indirect desktop heading | **Fixed.** It is “Download the desktop app”. |
| F-1-8 context-free preview label | **Fixed.** It is “Review before export”. |
| F-1-9 metaphor workflow heading | **Fixed.** It is “How to turn an export into an archive”. |
| F-1-10 generic privacy heading | **Fixed.** It is “Privacy and limits” / “How the app handles your files”. |
| F-1-11 slogan pricing eyebrow | **Fixed.** It is “Batch-import license”. |
| F-1-12 24-word README opening | **Fixed.** It is split into short concrete sentences. |

## Structure, routing, accessibility, and visual identity

- `/`, `/demo`, `/app`, `/privacy`, and `/terms` returned 200. An unknown URL returned a designed HTTP 404.
- Each checked route had `lang=en`, one `<h1>`, one `<main>`, a route title, description, favicon, Apple-touch icon, OG/Twitter data, and no serious or critical axe violations at 390 px.
- `robots.txt` and `sitemap.xml` are present. The `/app` canonical conflict is F-2-4.
- All discovered same-origin links returned 200 except the deliberate current-page skip link on the 404 response. The Linux release asset returned 200, Sociobot returned 200, and checkout returned its expected 303 to Dodo. No dead destination was found.
- Back navigation restored heading focus. Reduced-motion, 200% mobile scaling, touch targets, keyboard sample loading, and mobile overflow checks passed in the full suite.
- The live verifier reported no console errors, one `<h1>`, `<main>`, `lang=en`, and no missing image alt text for `/` and `/demo`.
- The dusk kitchen art, archive-box motif, clipped paper labels, serif display face, forest/apricot palette, and ledger UI form a distinct product identity. It is not a generic centered SaaS hero or three-card template.
- The shared-shell omissions and stale footer label are F-2-3 and F-2-5.

## Missed leverage

The obvious missing feature is not AI or sync. It is the brief’s explicit lossy-field check: identify source fields the normalizer does not preserve and show them before export. This should work locally and deterministically; adding AI would add cost and privacy exposure without improving the core migration job. CSV and JSON import/export already exist.

## What would make this perfect

Report or preserve every populated unmapped field, cover that behavior and the refund state in the claims manifest, and remove “complete” until the archive is demonstrably complete. Correct the checkout host sentence. Then make `/app` and `/demo` use the shared navigation/footer, resolve the `/app` canonical, unify the 404 build marker, standardize tracker/license/archive terms, and replace the four README jargon phrases. Re-run all 19 existing claim commands plus the new claims, the full test/build gate, live request logging, the route crawl, and the 390 px first-view check.
