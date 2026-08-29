# Adversarial first-read review 1

Reviewed 2026-08-29 UTC against <https://food-log-export-kit.sociobot.in> and commit `ebf73bd63dba801fb580a7e62e50607235018ece`.

## Verdict: FAIL

There are blocking findings. The cold landing page is understandable, but the mobile demo does not show a realistic sample record in its first viewport and public claims remain outside the mandatory claims manifest. The findings below include lower-severity routing and copy issues; a PASS requires zero findings.

## Cold first read

At both 390 × 844 and 1440 × 900, before scrolling:

- **What it does:** save a calorie-tracker food history as files under the visitor's control.
- **Who it is for:** calorie-tracker users with years of meals and recipes.
- **First click:** **Try it with sample data**; the stated result is to review 12 entries and export files.

This answers all three first-read questions. The problem is the unspecified phrase “both files” (F-1-5), not first-screen comprehension of the core job.

## Findings

### F-1-1 — BLOCKING — the mobile demo first screen does not show sample data being used

**Location:** `/demo`, fresh 390 × 844 browser context.

**Evidence:** The demo banner is present and the page says “12 entries are ready”, but the first actual table row begins at `y=1168px`; the table itself begins at `y=1169px`, below an 844px viewport. The first viewport ends during the count summary. A visitor cannot see a realistic meal, date, or nutrition value without scrolling.

**Why this fails:** The required one-click demo must make the first screen after the click already look like the product being used with realistic sample data. A count is not a demonstration of the conversion result on a phone.

**Concrete fix:** Keep the demo banner and one visible review summary, but place a compact sample record before the stage rail or summary, for example: “14 Apr · Breakfast · Oatmeal with blueberries · 342 kcal”. Keep the full table below it. Add a 390px Playwright assertion that this named sample record is visible without scrolling immediately after opening `/demo`.

### F-1-2 — BLOCKING — the public claims inventory is incomplete

**Location:** landing page, metadata, Privacy, Terms, and `README.md`; compared with `.factory/claims.json`.

**Evidence:** These visitor-reliant statements have no matching manifest claim and tagged observable test:

- Landing: “Your old log becomes an archive you can open anywhere.”
- Landing and README: “Unsigned builds for macOS, Windows, and Linux.” / “The macOS and Windows builds are unsigned.”
- Landing and Terms: “Sociobot/Dodo handles payment and refunds.” / “Refunds are handled through the purchase receipt.”
- Privacy: “It sends that token to the Sociobot billing API for verification. It never sends food data with this request.”
- README: “Common column names used for dates, meals, foods, recipes, amounts, energy, macros, and weights.”
- README: “Purchases and license checks use the Sociobot billing API.”
- README: “Each product statement and its browser test is listed in `.factory/claims.json`.” This is false while the statements above are absent.
- Landing metadata: “Turn food tracker exports into a readable CSV and portable JSON archive without uploading your food history.” “Readable” is a visitor-facing quality claim with no defined observable test.

**Why this fails:** The claims contract requires every statement a visitor could rely on to have one manifest entry and one sandbox test. Existing claims cover CSV/JSON export, local conversion, payment checkout, and license restore, but do not cover the distinct promises above.

**Concrete fix:** Remove claims that cannot be proved in the sandbox (for example “open anywhere”, “readable”, and refund handling), or add a separate claim entry and exactly one tagged test for each remaining promise. In particular, add a `license-request-data-boundary` test that loads real sample data, verifies a license through a recorded response, and asserts the verification request contains only the token; either test published unsigned assets against recorded release metadata or state the signing status only in release notes; and replace the broad “common column names” promise with an exact supported-heading list covered by fixtures. Do not retain “Each product statement…” until this inventory is complete.

### F-1-3 — MEDIUM — Back navigation does not restore focus to the landing-page heading

**Location:** live client-side navigation: `/` → **Privacy** → browser Back.

**Evidence:** After opening Privacy, focus is correctly on its `<h1>`, “Your food data stays with you”. After browser Back, `/` has loaded but `document.activeElement` is `BODY`, not the landing `<h1>`, “Save your food history”. `src/main.ts` deliberately focuses a heading only when `path !== '/'`.

**Why this fails:** The routing requirement includes moving focus to the new `<h1>` on route change, including Back/Forward. A screen-reader or keyboard user receives no route-change focus cue when returning home.

**Concrete fix:** Focus the new heading for every client-side route transition, while avoiding only the initial document load if that is desired. Add an end-to-end test for `/` → `/privacy` → Back that asserts the landing `<h1>` is focused.

### F-1-4 — MEDIUM — the HTTP 404 route does not use the required route metadata or shared footer

**Location:** `public/404.html`, live `/not-a-real-route` (HTTP 404).

**Evidence:** The page has a correct 404 status, title, description, favicon, heading, and home link. It lacks canonical, Open Graph, Twitter-card, and Apple-touch metadata. Its footer contains only the one-line description plus Privacy and Terms; it omits “Built by Param Factory” and the version/build identifier required of every route. Its header also omits the normal navigation.

**Why this fails:** It is a real product route and must retain the site's standard header/footer and per-route metadata, not become a reduced static page.

**Concrete fix:** Bring `404.html` to the same metadata and shared-skeleton contract as the other pages: route-specific canonical/OG/Twitter/apple-touch tags, the normal navigation where appropriate, and the full footer including Param Factory and build/version. Add a static 404 metadata/footer test.

### F-1-5 — MINOR — the primary-action outcome does not name the files

**Location:** landing hero, beside **Try it with sample data**.

**Exact quote:** “Review 12 entries, then export both files.”

**Why this fails:** “Both” has no named antecedent in the first screen. A cold visitor has to scroll to learn that the files are CSV and JSON.

**Concrete fix:** Replace with: “Review 12 sample entries, then download a CSV and JSON archive.”

### F-1-6 — MINOR — decorative “exit” labels carry no usable section information

**Location:** landing hero.

**Exact quotes:** “Your exit from a food tracker” and “01 / THE SAFE EXIT”.

**Why this fails:** These are slogan/metaphor labels, not headings that identify content for a skim reader or screen-reader heading list. “Safe” is also an unsupported quality adjective.

**Concrete fix:** Delete “01 / THE SAFE EXIT”. Replace the eyebrow with “Export food tracker history” or omit it because the `<h1>` already states the job.

### F-1-7 — MINOR — the desktop-download heading is indirect

**Location:** landing desktop-download section.

**Exact quote:** “Keep the converter on your computer”.

**Why this fails:** It does not name the section's action or artifact. The section offers an installer.

**Concrete fix:** Replace with: “Download the desktop app”.

### F-1-8 — MINOR — one section label is context-free

**Location:** landing preview eyebrow.

**Exact quote:** “The product”.

**Why this fails:** It does not identify what the following content is about.

**Concrete fix:** Replace with “Review before export” or delete the label and let the following heading carry the section.

### F-1-9 — MINOR — the workflow heading describes a metaphor instead of the task

**Location:** landing “How it works” section.

**Exact quote:** “Three checks between export and archive”.

**Why this fails:** “Between export and archive” is ambiguous: the export is itself the source file in the surrounding copy, while the numbered items are import, review, and save steps.

**Concrete fix:** Replace with: “How to turn an export into an archive”.

### F-1-10 — MINOR — the privacy section starts with generic contrast copy

**Location:** landing privacy section.

**Exact quotes:** “Private by design” and “A converter, not another tracker”.

**Why this fails:** Neither names the concrete privacy boundaries listed below, and “by design” is generic marketing language.

**Concrete fix:** Replace the eyebrow and heading with “Privacy and limits” and “How the app handles your files”.

### F-1-11 — MINOR — the pricing eyebrow is a slogan instead of a section name

**Location:** landing pricing section.

**Exact quote:** “One job. One price.”

**Why this fails:** It gives neither the purchase name nor the paid capability.

**Concrete fix:** Replace with: “Batch-import license”.

### F-1-12 — MINOR — README opening uses a 24-word, jargon-heavy compound sentence

**Location:** `README.md`, opening description.

**Exact quote (24 words):** “It reads user-provided CSV and JSON files, normalizes meal, recipe, nutrition, and weight fields, then exports a readable CSV and a versioned JSON archive.”

**Why this fails:** It exceeds the 22-word cap, joins three ideas, and introduces “normalizes” and “versioned” without explaining them.

**Concrete fix:** Replace with: “It reads CSV and JSON food-tracker exports. It keeps meal, recipe, nutrition, and weight fields. It exports a CSV and JSON archive.”

## Copy audit

Counts treat hyphenated terms, product names, URLs, and numbers as one word. Headings are evaluated in the findings above; tables below list prose sentences and useful fragments shown to a reader.

### Landing page

| Copy | Words |
| --- | ---: |
| Save your food history. | 4 |
| For calorie tracker users who need years of meals and recipes in files they control. | 15 |
| Try it with sample data. | 5 |
| Review 12 entries, then export both files. | 7 |
| No uploads. | 2 |
| Conversion stays on this device. | 5 |
| No account. | 2 |
| Open a file and start. | 5 |
| Free for one file. | 4 |
| Batch import costs $19 once. | 5 |
| Your old log becomes an archive you can open anywhere. | 10 |
| Keep the converter on your computer. | 6 |
| The app reads CSV and JSON exports. | 7 |
| It also works when your internet is off. | 8 |
| Unsigned builds for macOS, Windows, and Linux. | 7 |
| Download for Linux. | 3 |
| Food.Log.Export.Kit_0.1.2_amd64.AppImage · unsigned build. | 4 |
| See every row before you export. | 6 |
| Missing or invalid dates and unreadable or comma-formatted numbers appear as notes. | 12 |
| Skipped files and rows are named. | 6 |
| Open a CSV or JSON file from your tracker. | 9 |
| Check missing fields and rows before saving anything. | 8 |
| Use CSV now. | 3 |
| Keep JSON as the complete archive. | 6 |
| Your files stay local. | 4 |
| The app has no food-data server. | 6 |
| No account scraping. | 3 |
| Use exports you requested from your tracker. | 7 |
| No nutrition advice. | 3 |
| Numbers are copied and labeled, not judged. | 7 |
| No silent drops. | 3 |
| Skipped files and rows appear in conversion notes. | 8 |
| Combine several exports for $19. | 5 |
| A free archive handles one file at a time. | 9 |
| The license adds multi-file selection for migrations split across years or apps. | 12 |
| One-time purchase. | 2 |
| Paste the license token on another device. | 7 |
| CSV and JSON export stay free. | 6 |
| Sociobot/Dodo handles payment and refunds. | 5 |
| Read the terms. | 3 |
| Turn food tracker exports into a local archive. | 8 |

### README

| Copy | Words |
| --- | ---: |
| Turn food tracker exports into a local archive. | 8 |
| Food Log Export Kit is for people leaving a calorie tracker. | 11 |
| It reads user-provided CSV and JSON files, normalizes meal, recipe, nutrition, and weight fields, then exports a readable CSV and a versioned JSON archive. | 24 |
| Files and rows it cannot use appear in conversion notes. | 10 |
| All food-data conversion happens in the browser or desktop webview. | 10 |
| The project has no tracker, account system, food-data server, or medical advice. | 12 |
| The sample demo makes no cross-origin requests. | 7 |
| CSV files separated by commas, semicolons, or tabs. | 8 |
| JSON arrays and objects with `entries`, `records`, `meals`, `foods`, `items`, or `data` lists. | 13 |
| Common column names used for dates, meals, foods, recipes, amounts, energy, macros, and weights. | 14 |
| ISO dates in `YYYY-MM-DD` order; impossible and ambiguous numeric dates are noted. | 12 |
| Dot decimals, grouped commas such as `1,234`, and decimal commas such as `1,5`; comma interpretations are noted. | 17 |
| The free app imports one file at a time. | 9 |
| A $19 one-time personal license adds multi-file selection. | 8 |
| Paste its token to restore it on another device. | 9 |
| CSV and JSON export stay free. | 6 |
| Purchases and license checks use the Sociobot billing API. | 9 |
| The landing page selects the published build for your system. | 10 |
| On Linux or macOS, the installer verifies the release checksum. | 10 |
| It adds a `food-log-export-kit` launcher to PATH. | 7 |
| On Windows, this command verifies and starts the MSI installer. | 9 |
| The macOS and Windows builds are unsigned. | 7 |
| Review the release notes for the platform-specific open step. | 9 |
| Requires Node.js 22. | 3 |
| Rust is needed only for the desktop shell. | 8 |
| Open `http://127.0.0.1:4173/demo` for the isolated sample workspace. | 8 |
| `npm run build:site` writes the deployable website to `dist/site/`, with `index.html` at that root. | 12 |
| `npm run build:app` writes the Tauri frontend to `dist/app/`. | 10 |
| The release workflow builds unsigned macOS, Windows, and Linux installers after a `v*` tag is pushed. | 15 |
| Each product statement and its browser test is listed in `.factory/claims.json`. | 10 |
| Demo behavior is documented in `.factory/demo.md`. | 7 |
| Publish `dist/site/` as a static site. | 6 |
| The included Static Web Apps config sets SPA routing, security headers, caching behavior, and the 404 response. | 16 |
| The factory handles DNS and deployment. | 6 |
| The MIT license covers the source code. | 7 |
| Product terms for the paid batch license are available at `/terms`; data handling details are at `/privacy`. | 16 |

No landing or README button fails the result-naming-verb check. Terminology is mostly consistent: **export** is input, **archive** is output, and **conversion note** is the explanation of a skipped or altered value.

## Demo, sandbox, and privacy checks

- Direct `/demo` in a fresh context displayed 12 realistic entries and the persistent “Demo — sample data, nothing is saved” banner.
- **Reset demo** restored 12 entries. **Start for real** opened empty `/app` storage. Direct demo entry and both exports left local and session storage empty.
- Direct demo CSV had a header plus 12 rows; JSON contained 12 records.
- Direct demo conversion/export made only same-origin requests. The landing page separately calls the disclosed GitHub release API; no food data was sent there.
- The mobile first-viewport defect remains blocking (F-1-1).

## Claims test gate

I cloned the candidate into a fresh temporary directory, ran `npm ci`, then ran every exact command from `.factory/claims.json` independently. All 18 passed. The initial accidental concurrent rerun caused local port-collision failures; `local-only`, `format-import`, and `revoked-license` were rerun alone and passed.

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

The live checkout endpoint also returned HTTP 303 to a `checkout.dodopayments.com` session. Passing declared claims does not clear F-1-2, because the manifest does not cover every public claim.

## Earlier-history recheck

There are no earlier `.factory/review-*.md` or `.factory/polish-*.md` files. I read the prior handoff and verification history. The earlier findings were verified fixed in live behavior and code:

- checkout now returns the Dodo redirect;
- failed files become visible conversion notes in `readFiles()`;
- cached license verdicts are bound to their token;
- impossible ISO dates and number formats produce notes;
- tab-delimited CSV is covered by the declared test;
- the release installer tests cover Linux and both Mac architectures, plus Windows;
- mobile targets and HTTP 404 status pass the present checks;
- the earlier missing Windows-installer claim is now declared and tested.

## Structure and visual checks

- `/`, `/demo`, `/app`, `/privacy`, and `/terms` returned 200; an unknown path returned a designed HTTP 404.
- Landing has one `<h1>`, `<main>`, `lang=en`, title, description, canonical, OG/Twitter data, favicon, and Apple touch icon. `robots.txt` and `sitemap.xml` are present.
- Same-origin landing links returned 200; explicit external/mail links were not dead-link candidates.
- Client navigation updated title and focused the new heading on forward navigation. The Back focus regression is F-1-3. The static 404 omissions are F-1-4.
- At 390px the landing had no horizontal overflow and no console errors. The visual system follows the documented dusk/archive direction and is not a generic SaaS template.

## Missed leverage

No missing AI feature is identified. The job is deterministic import, review, and export; adding an AI step would not improve the core task. Import and both requested exports already exist.

## What would make this perfect

Show a named sample record in the mobile demo's first viewport; make the claims manifest exactly match public copy; complete Back-focus and 404 route parity; then remove the remaining slogan, ambiguity, and README-density issues. Re-run the full clean-clone claims gate and the mobile first-view test after those changes.
