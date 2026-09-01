# Adversarial first-read review 6

Reviewed 2026-09-01 UTC against https://food-log-export-kit.sociobot.in, fresh browser contexts at 390 × 844 and 1440 × 1000, and checkout 89753a7bd284c5dd359c965168402a00001b1c83.

## Verdict: FAIL

The landing page is clear, the demo is usable and isolated, and live route, accessibility, and navigation checks pass. This review fails because declared claim commands do not pass from this checkout. The README also has release-process assurances without matching claims entries.

## Cold first read

Before scrolling at both sizes:

- What it does: turns food-tracker exports into CSV and JSON files that the visitor keeps.
- Who it is for: food-tracker users who want years of meals and recipes in files they control.
- What to click first: Try it with sample data. Its adjacent text says that the next screen has 12 sample entries and CSV and JSON downloads.

The exact first-screen text is “Save your food history”, “For food tracker users who need years of meals and recipes in files they control”, and “Try it with sample data”. At 390 px, all three plain facts are visible without scrolling. This check has no finding.

## Findings

### F-6-1 — BLOCKING — declared claim commands fail because the published installer candidate does not match this checkout

**Location and evidence:** .factory/claims.json declares 23 commands. Nineteen use npm test -- --grep @claim:…. Each stops in the shared Vitest phase at @claim:candidate-installers, before its tagged browser test runs:

    Expected: 89753a7bd284c5dd359c965168402a00001b1c83
    Received: 12b6feb595b55aab9e7bd681b762678aba9e67ba

The live GitHub v0.1.12 release identifies 12b6feb… as its target, while git rev-parse HEAD here is 89753a7…. The exact public promise is the candidate-installers claim: “Published macOS, Windows, and Linux installers, checksums, and download links come from the checked-out tagged candidate.”

**Why this fails:** a visitor can download a desktop installer from the live site, but the supplied test cannot confirm that it is the installer candidate for this product revision. It also prevents independent confirmation of 19 other declared claims. The claims contract makes any failing claim test blocking.

**Concrete fix:** publish a new version whose tag, release metadata, latest.json, checksums, installer assets, and deployed website are built from the same checked-out commit. Then run every claims command from that checkout and retain the passing output. Do not leave version 0.1.12 while its release points to an older revision.

### F-6-2 — MEDIUM — README release-process claims are absent from the claims inventory

**Location and exact quotes:** README, Test and build: “Site builds embed the checked-out Git commit.” “If VITE_FOOD_LOG_SOURCE_COMMIT is set, it must be that exact commit; a site build refuses a stale identity.” README, Publish a desktop release: “The preflight refuses a dirty checkout, a non-main branch, a local or remote tag that already exists, a version mismatch, or a main tip that does not match HEAD.”

**Why this fails:** these are specific operational assurances. None has an exact entry in .factory/claims.json. The candidate-installers entry checks published installer identity, and untagged unit tests inspect parts of the scripts, but neither listed claim covers these stated build and preflight outcomes.

**Concrete fix:** add separate claims with one exact tagged test each for source-commit validation and release-preflight behavior, or remove these sentences. Each test should run the script in a temporary repository state and confirm the stated result. Split the two quoted long sentences as part of the rewrite.

### F-6-3 — MINOR — the required copy-audit record does not describe the current product copy

**Location and exact evidence:** .factory/copy-audit.md says “Audited 2026-09-01 after repair 12” but lists “Desktop app · version 0.1.11”, Food.Log.Export.Kit_0.1.11_amd64.AppImage, and “Version 0.1.11 · release repair · Generated artwork”. The live page presents version 0.1.12 and the matching 0.1.12 asset name.

**Why this fails:** the audit is the documented proof that all visitor copy was read and checked. A reviewer cannot use it as current evidence when it names an earlier release.

**Concrete fix:** regenerate .factory/copy-audit.md from the current landing page and README after every release-copy change. Keep every current sentence, word count, terminology decision, and flag in that audit.

## Copy audit

Counts treat hyphenated terms, product names, filenames, URLs, and numbers as one word. Command blocks are instructions rather than prose sentences. No landing sentence exceeds 22 words. No marketing adjective, metaphor heading, inconsistent public product term, or non-result action was found. The README exceptions are listed as F-6-2.

### Landing page

| Copy | Words | Check |
| --- | ---: | --- |
| Food Log Export Kit — Save your food history | 8 | Metadata title |
| Turn food tracker exports into CSV and JSON files on your device. | 12 | Metadata description |
| Food Log Export Kit | 4 | Wordmark |
| Demo; How it works; Privacy; Terms | 1; 3; 1; 1 | Clear destinations |
| Export food tracker history | 4 | Task label |
| Save your food history | 4 | Job headline |
| For food tracker users who need years of meals and recipes in files they control. | 15 | Names visitor and outcome |
| Try it with sample data | 5 | Result-naming action |
| Review 12 sample entries, then download a CSV and JSON archive. | 11 | Names immediate result |
| No uploads. | 2 | Privacy fact |
| Conversion stays on this device. | 5 | Privacy fact |
| No account. | 2 | Access fact |
| Open a file and start. | 5 | Access fact |
| Free for one file. | 4 | Price fact |
| Batch import costs $19 once. | 5 | Price fact |
| Keep a CSV for spreadsheets. | 5 | Explains CSV |
| JSON keeps consistent fields and conversion notes. | 7 | Explains JSON |
| A recipe card archive box in a quiet kitchen at dusk. | 11 | Accurate art description |
| Desktop app · version 0.1.12 | 4 | Section label |
| Download the desktop app | 4 | Section heading |
| The app reads CSV and JSON exports. | 7 | Capability |
| It also works when your internet is off. | 8 | Offline capability |
| Download for Linux | 3 | Result-naming action |
| Food.Log.Export.Kit_0.1.12_amd64.AppImage | 1 | Asset name |
| Read release notes; on GitHub | 3; 2 | Clear link |
| Review before export | 3 | Section label |
| Review entries and conversion notes | 5 | Section heading |
| Invalid values, skipped rows, and populated unrecognized fields appear in conversion notes. | 12 | Concrete scope |
| Food Log Export Kit; On this device | 4; 3 | Preview labels |
| Import; Review; Export | 1; 1; 1 | Clear stages |
| sample-food-history.csv; 12 entries ready; CSV + JSON | 1; 3; 2 | Useful preview data |
| APR 14; 3 meals; No notes | 2; 2; 2 | Useful preview data |
| Breakfast; Oatmeal with blueberries; 342 kcal | 1; 3; 2 | Useful preview data |
| Lunch; Lentil soup; 418 kcal | 1; 2; 2 | Useful preview data |
| Dinner; Tofu ginger stir-fry; 561 kcal | 1; 3; 2 | Useful preview data |
| How it works | 3 | Section label |
| How to turn an export into an archive | 8 | Task heading |
| Choose your export | 3 | Step heading |
| Open a CSV or JSON file from your tracker. | 9 | Step instruction |
| The app screen for choosing a tracker export. | 8 | Accurate image description |
| Review conversion notes | 3 | Step heading |
| Check missing fields and rows before saving anything. | 8 | Step instruction |
| A conversion note explaining an unusable row. | 7 | Accurate image description |
| Save CSV and JSON | 4 | Step heading |
| Use the CSV in a spreadsheet. | 6 | Explains use |
| Keep JSON with consistent fields and conversion notes. | 8 | Explains use |
| Two filled food-log rows above Export CSV and Export JSON buttons. | 11 | Accurate image description |
| Privacy and limits | 3 | Section label |
| How the app handles your files | 6 | Section heading |
| Your files stay local. | 4 | Privacy fact |
| The app has no food-data server. | 6 | Privacy fact |
| The app does not sign in to your tracker. | 9 | Boundary |
| Use exports you requested from your tracker. | 7 | Boundary |
| No nutrition advice. | 3 | Boundary |
| Numbers are copied and labeled, not judged. | 7 | Boundary |
| Unrecognized fields appear in conversion notes. | 6 | Consistent term |
| The app names them and keeps their values in JSON. | 10 | Useful outcome |
| Batch-import license | 2 | Tier name |
| Combine several exports for $19 | 5 | Tier heading |
| The free app handles one file at a time. | 9 | Limit |
| The batch-import license adds multi-file selection for migrations split across years or apps. | 13 | Paid outcome |
| One-time purchase. | 2 | Tier fact |
| Paste the license token on another device. | 7 | Tier fact |
| CSV and JSON export stay free. | 6 | Tier fact |
| Buy the batch-import license | 4 | Result-naming action |
| Sociobot/Dodo is the merchant of record. | 6 | Payment role |
| It handles refunds, which revoke the license. | 7 | Refund effect |
| Read the terms. | 3 | Link action |
| Turn food tracker exports into a local archive. | 8 | Footer statement |
| Built by Param Factory | 4 | Attribution |
| Version 0.1.12 · release repair · Generated artwork | 6 | Build information |

### README

| Copy | Words | Check |
| --- | ---: | --- |
| Turn food tracker exports into a local archive. | 8 | Clear summary |
| Food Log Export Kit is for people leaving a food tracker. | 11 | Names visitor |
| It reads CSV and JSON food tracker exports. | 8 | Capability |
| It keeps meal, recipe, nutrition, and weight fields. | 8 | Scope |
| It exports a CSV and JSON archive. | 7 | Outcome |
| Files, rows, and populated fields the app does not recognize appear in conversion notes. | 14 | Consistent term |
| JSON preserves those original field values. | 6 | Outcome |
| The website and desktop app convert food data on your device. | 11 | Privacy statement |
| The project does not track meals, require an account, store food data on a server, or give medical advice. | 19 | Boundaries |
| The sample demo contacts only this website. | 7 | Network boundary |
| CSV files separated by commas, semicolons, or tabs | 7 | Supported-input fragment |
| JSON arrays and objects with entries, records, meals, foods, items, or data lists | 12 | Supported-input fragment |
| CSV headings for dates, meals, foods, recipes, amounts, energy, macros, and weights | 12 | Supported-input fragment |
| Dates in YYYY-MM-DD order; impossible or ambiguous numeric dates appear in conversion notes | 12 | Validation fragment |
| Dot decimals, grouped commas such as 1,234, and decimal commas such as 1,5; comma interpretations are noted | 15 | Validation fragment |
| The free app imports one file at a time. | 9 | Limit |
| A $19 one-time batch-import license adds multi-file selection. | 8 | Paid outcome |
| Paste its token to restore it on another device. | 9 | Action |
| CSV and JSON export stay free. | 6 | Price fact |
| License checks send only the token to the Sociobot billing API. | 11 | Data boundary |
| Sociobot/Dodo is the merchant of record and handles refunds. | 9 | Payment role |
| A refund revokes the license. | 5 | Refund effect |
| The landing page selects the published build for your system. | 10 | Outcome |
| On Linux or macOS, the installer checks that the downloaded file was not changed. | 14 | Verification result |
| It installs the food-log-export-kit command so you can run it from a terminal. | 12 | User result |
| On Windows, this command verifies and starts the MSI installer. | 10 | User result |
| Review the release notes for the steps to open the app on your system. | 13 | Instruction |
| The published manifest and checksum file name the source commit used for every desktop build. | 15 | Release documentation |
| Each site build publishes its matching release identity for the installers. | 11 | Release documentation |
| Requires Node.js 22. | 3 | Prerequisite |
| Rust is needed only to build the desktop app. | 9 | Prerequisite |
| Open http://127.0.0.1:4173/demo for the isolated sample workspace. | 7 | Instruction |
| The release workflow builds macOS, Windows, and Linux installers after a v* tag is pushed. | 15 | Listed claim |
| Site builds embed the checked-out Git commit. | 7 | Unlisted claim: F-6-2 |
| If VITE_FOOD_LOG_SOURCE_COMMIT is set, it must be that exact commit; a site build refuses a stale identity. | 14 | Unlisted claim: F-6-2 |
| Tested product claims are listed in .factory/claims.json. | 7 | Documentation |
| Demo behavior is documented in .factory/demo.md. | 6 | Documentation |
| Commit and push all source, test, handoff, and evidence changes first. | 10 | Release instruction |
| From the clean main tip, run: | 7 | Release instruction |
| The preflight refuses a dirty checkout, a non-main branch, a local or remote tag that already exists, a version mismatch, or a main tip that does not match HEAD. | 27 | Unlisted and over 22 words: F-6-2 |
| Wait for the GitHub Actions release to publish its installers, SHA256SUMS, and latest.json; then run the candidate-installers claim before deploying dist/site built from that same commit. | 25 | Over 22 words: F-6-2 |
| Publish dist/site as a static site. | 6 | Deployment instruction |
| The included hosting config defines reload routes, security headers, cache rules, and the 404 response. | 15 | Listed claim |
| The factory handles DNS and deployment. | 6 | Ownership |
| The MIT license covers the source code. | 7 | License statement |
| Product terms for the batch-import license are available at /terms; data handling details are at /privacy. | 16 | Clear links |

## Demo, sandbox, and privacy checks

The one-click /?demo=1 route opened a working review screen, not a setup screen. The first 390px screen showed the persistent “Demo — sample data, nothing is saved” banner and the named “Oatmeal with blueberries” record at y=520.5. The table had 12 records. Reset demo reseeded 12 sample records. Start for real opened /app with zero records and “Choose a tracker export”. Before and after, cookies, localStorage, and sessionStorage were empty. The recorded demo flow used only same-origin requests. These checks have no additional finding.

## Claim-test gate

All 23 listed commands were attempted from this dependency-clean checkout.

| Claim command group | Result |
| --- | --- |
| verified-installer, windows-installer, static-hosting, release-workflow | PASS |
| csv-export, json-archive, local-only, format-import, explained-drops, lossy-fields, validation-notes, batch-import, license-restore, paid-purchase, offline-reload, demo-discard, privacy-no-account, free-behavior, normalized-types, revoked-license, detected-platform-downloads, license-request-data-boundary, candidate-installers | FAIL at the shared candidate-installers identity assertion in F-6-1, before the requested browser test could run |

As an additional diagnostic, the browser suite started successfully and completed CSV, JSON, local-only, demo-discard, privacy-no-account, route, focus, link, and accessibility checks. That does not replace the declared-command gate.

## Earlier-history recheck

Every earlier review, polish record, and handoff was read. The following fresh live-and-code check covers every earlier finding. “Confirmed” means the original visitor-facing defect is fixed; F-6-1 separately blocks current claim-test acceptance evidence.

| Earlier finding | Status and evidence |
| --- | --- |
| F-1-1 | Confirmed: /demo loads a named sample record above the 390px fold. |
| F-1-2 | Confirmed inventory: 23 claims exist; command verification is blocked by F-6-1. |
| F-1-3 | Confirmed: popstate rerenders and focuses the route h1; browser route test passes. |
| F-1-4 | Confirmed: unknown URL returns designed HTTP 404 with metadata, legal links, footer, and return link. |
| F-1-5 | Confirmed: primary action names sample data and the CSV/JSON result. |
| F-1-6 | Confirmed: eyebrow names the export task. |
| F-1-7 | Confirmed: heading is “Download the desktop app”. |
| F-1-8 | Confirmed: “Review before export” identifies the section. |
| F-1-9 | Confirmed: workflow heading names the task. |
| F-1-10 | Confirmed: privacy headings are specific. |
| F-1-11 | Confirmed: batch-import license is the single tier name. |
| F-1-12 | Confirmed: README opening is short and concrete. |
| F-2-1 | Confirmed: code retains populated unknown values as unmapped_fields and names them in notes. |
| F-2-2 | Confirmed: live checkout returns HTTP 303 to Dodo and copy names the roles. |
| F-2-3 | Confirmed: /app and /demo use the shared navigation and footer. |
| F-2-4 | Confirmed: /app has its own title, description, canonical, and OG URL. |
| F-2-5 | Confirmed: rendered and static 404 footers both show 0.1.12. |
| F-2-6 | Confirmed: public source-product term is food tracker. |
| F-2-7 | Confirmed: public paid-tier term is batch-import license. |
| F-2-8 | Confirmed: archive describes output, not the app tier. |
| F-2-9 | Confirmed: README says website and desktop app. |
| F-2-10 | Confirmed: README uses the plain same-site network boundary. |
| F-2-11 | Confirmed: README names YYYY-MM-DD and conversion notes. |
| F-2-12 | Confirmed: known routes reload and an unknown route returns HTTP 404. |
| F-3-1 | Confirmed: walkthrough says “Review conversion notes”. |
| F-3-2 | Confirmed: walkthrough says “Save CSV and JSON”. |
| F-3-3 | Confirmed: landing avoids unexplained normalized wording. |
| F-3-4 | Confirmed: README explains download verification. |
| F-3-5 | Confirmed: README explains the terminal-command result. |
| F-3-6 | Confirmed: visible release-notes link resolves to the selected release. |
| F-4-1 | Confirmed: scoped review heading replaces the universal every-row promise. |
| F-4-2 | Confirmed: export frame shows filled rows and export buttons; alt text matches. |
| F-5-1 | Confirmed: all client routes have the same main-navigation destinations. |
| F-5-2 | Confirmed: release-workflow has a listed tagged test, which passes. |
| F-5-3 | Confirmed: CSV copy names spreadsheet use. |
| F-5-4 | Confirmed: tracker sign-in boundary uses plain words. |
| F-5-5 | Confirmed: conversion-note copy uses unrecognized fields. |
| F-5-6 | Confirmed: README says “does not recognize”. |
| F-5-7 | Confirmed: README says “original field values”. |
| F-5-8 | Confirmed: README names meal tracking, account, server, and advice boundaries. |
| F-5-9 | Confirmed: README says steps to open the app on your system. |
| F-5-10 | Confirmed: README says Rust is needed to build the desktop app. |

## Structure, route, and visual checks

Live /, /demo, /app, /privacy, /terms, and an unknown route were checked in fresh contexts. Each rendered route has one h1, main, a route-specific title, description, canonical URL, OG URL, shared header, and footer. The static 404 returns HTTP 404 and has a return link. Back navigation restores heading focus. First-party links, robots, sitemap, favicon, social image, and the selected GitHub release link returned successfully. The checkout link returns its documented Dodo redirect. Live Axe checks reported no violations on all six routes. The warm paper, dark kitchen, archive-label geometry, and original kitchen art form a product-specific visual system rather than a generic template. No additional structure finding was found.

## Missed leverage

The brief calls for local validation, normalization, conversion notes, and CSV/JSON export. The product provides those direct paths. An AI feature would not make this offline archival task clearer or more dependable, so none is expected. No missed import, export, or sync feature was found.

## What would make this perfect

Publish one commit-matched desktop release and website build, restore a fully passing declared-claim gate, add claim coverage or remove the remaining README release assurances, and regenerate the current copy-audit record. At that point the product would have no outstanding QA finding from this review.
