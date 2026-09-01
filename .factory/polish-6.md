# Polish round 6 — finding map

Candidate: `0.1.13`. Evidence paths are relative to `.factory/`; live checks use `https://food-log-export-kit.sociobot.in` after the matching site deployment.

| Finding | Change made | Evidence |
|---|---|---|
| F-1-1 | Kept direct `/demo` and `?demo=1`, the in-memory sample namespace, persistent banner, reset, exit, and the named oatmeal record before the mobile fold. | `mobile demo shows a named sample record in the first viewport`; `evidence/polish-6/demo-mobile-390.png`; live `/demo`. |
| F-1-2 | Kept the complete claim inventory; each public promise has one tagged observable test. | Manifest uniqueness audit; `npm test -- --grep @claim:license-request-data-boundary`; live `/`, `/privacy`, `/terms`. |
| F-1-3 | Kept client navigation and Back/Forward heading focus with a polite announcement. | `back navigation restores focus to the landing heading`; live `/` → `/privacy` → Back. |
| F-1-4 | Kept the designed static HTTP 404 with route metadata, shared navigation, legal links, attribution, and current build marker. | `gives the static 404 page the shared metadata, navigation, and footer`; `evidence/polish-6/not-found-desktop.png`; live `/not-a-real-route`. |
| F-1-5 | Kept the primary-action result explicit about CSV and JSON. | `Review 12 sample entries, then download a CSV and JSON archive.`; `evidence/polish-6/landing-desktop-1440.png`; live `/`. |
| F-1-6 | Kept the concrete export-task eyebrow and omitted decorative exit labels. | `.factory/copy-audit.md`; live `/`. |
| F-1-7 | Kept `Download the desktop app`. | `.factory/copy-audit.md`; live `/`. |
| F-1-8 | Kept `Review before export`. | `.factory/copy-audit.md`; live `/`. |
| F-1-9 | Kept `How to turn an export into an archive`. | `.factory/copy-audit.md`; live `/#how`. |
| F-1-10 | Kept `Privacy and limits` and `How the app handles your files`. | `.factory/copy-audit.md`; live `/`. |
| F-1-11 | Kept `batch-import license` as the only tier name. | `@claim:batch-import`; live `/terms`. |
| F-1-12 | Kept the short, concrete README opening. | `.factory/copy-audit.md`; clean-clone README check. |
| F-2-1 | Preserved populated unrecognized fields in JSON and named their source in conversion notes. | `@claim:lossy-fields`; `evidence/polish-6/app-desktop.png`; live `/app`. |
| F-2-2 | Kept checkout wording accurate to the Sociobot/Dodo flow. | `@claim:paid-purchase`; live checkout redirect. |
| F-2-3 | Kept the shared semantic navigation and footer on app and demo routes. | `every route uses the same primary navigation destinations and shared footer`; live `/app`, `/demo`. |
| F-2-4 | Kept route-specific title, canonical URL, social URL, and heading focus. | `each client route sets its title, canonical URL, and heading focus`; live `/app`. |
| F-2-5 | Bumped static and rendered footer identifiers together to `0.1.13`. | `keeps the static and rendered footer build identifiers in sync`; live `/not-a-real-route`. |
| F-2-6 | Kept `food tracker` as the public source-product term. | `.factory/copy-audit.md`; live `/`. |
| F-2-7 | Kept `batch-import license` as the public paid-tier term. | `@claim:batch-import`; live `/terms`. |
| F-2-8 | Kept `archive` for exported output and `free app` for the product tier. | `.factory/copy-audit.md`; live `/`. |
| F-2-9 | Kept `website and desktop app` in the README. | `.factory/copy-audit.md`; clean-clone README check. |
| F-2-10 | Kept the plain same-site request boundary. | `@claim:local-only`, `@claim:privacy-no-account`; live `/demo`. |
| F-2-11 | Kept the concrete `YYYY-MM-DD` wording and conversion-note behavior. | `@claim:validation-notes`; live `/app`. |
| F-2-12 | Kept explicit known-route reloads and static unknown-route 404 handling. | `@claim:static-hosting`; live `/app`, `/not-a-real-route`. |
| F-3-1 | Kept `Review conversion notes`. | `keeps review 3 copy plain and links readers to release notes`; live `/#how`. |
| F-3-2 | Kept `Save CSV and JSON`. | Same wording test; live `/#how`. |
| F-3-3 | Kept plain wording for JSON fields and conversion notes. | Same wording test; `.factory/copy-audit.md`. |
| F-3-4 | Kept the explanation that installer verification checks for changes. | `@claim:verified-installer`; README clean-clone check. |
| F-3-5 | Kept the explanation that the installer adds a terminal command. | `@claim:verified-installer`; README clean-clone check. |
| F-3-6 | Kept the release-notes link next to the selected download. | `landing link crawl includes the selected release notes page`; live `/`. |
| F-4-1 | Kept the scoped conversion-note review heading and no universal every-row promise. | `keeps the review promise within the tested conversion-note scope`; live `/`. |
| F-4-2 | Kept the populated export walkthrough and precise alternative text. | `ships a current export walkthrough frame with precise alternative text`; live `/#how`. |
| F-5-1 | Kept one shared navigation list across all routes. | `every route uses the same primary navigation destinations and shared footer`; live all routes. |
| F-5-2 | Kept the tagged release-workflow claim. | `@claim:release-workflow`; published `v0.1.13` release. |
| F-5-3 | Kept the spreadsheet use for CSV. | `keeps review 5 wording concrete and consistent`; live `/#how`. |
| F-5-4 | Kept the plain tracker sign-in boundary. | Same wording test; live `/`. |
| F-5-5 | Kept `Unrecognized fields appear in conversion notes`. | `@claim:lossy-fields`; live `/app`. |
| F-5-6 | Kept `does not recognize` in the README. | Same wording test; clean-clone README check. |
| F-5-7 | Kept `original field values` in the README. | `@claim:lossy-fields`; clean-clone README check. |
| F-5-8 | Kept concrete meal, account, server, and medical-advice boundaries. | `@claim:privacy-no-account`; live `/privacy`. |
| F-5-9 | Kept `steps to open the app on your system`. | `.factory/copy-audit.md`; README release-notes link. |
| F-5-10 | Kept `Rust is needed only to build the desktop app`. | `.factory/copy-audit.md`; clean-clone Tauri test. |
| F-6-1 | Bumped to a new candidate, tagged the clean main commit, and require the published release, manifest, checksums, assets, and deployed site identity to match it. | `@claim:candidate-installers`; release `v0.1.13`; live `/release-identity.json`. |
| F-6-2 | Added two listed release-process claims with isolated tests; rewrote the README release lines below 22 words. | `@claim:site-source-commit`, `@claim:release-preflight`; `.factory/claims.json`; clean-clone README audit. |
| F-6-3 | Regenerated the complete copy audit with the current `0.1.13` build text and README sentences. | `.factory/copy-audit.md`; `evidence/polish-6/landing-desktop-1440.png`; live `/`. |

## Final verification

The final release run records every declared claim from a clean clone, the desktop build, static build, Rust tests, browser/accessibility checks, screenshots, and a cold live audit. The handoff lists the exact rerun commands.
