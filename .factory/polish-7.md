# Polish round 7 — finding map

Candidate: `v0.1.17` at `15156f04a39104211d95ff0e965712d9c4732333`. Evidence paths are relative to `.factory/`; production checks use <https://food-log-export-kit.sociobot.in>.

| Finding | Change made | Evidence |
|---|---|---|
| F-1-1 | Kept `/demo` and `?demo=1` as one-click, in-memory sample workspaces with a persistent notice, reset, exit, and a named entry above the mobile fold. | `mobile demo shows a named sample record in the first viewport`; `evidence/polish-7/live-demo-mobile-390.png`; live `/?demo=1`. |
| F-1-2 | Kept every public promise in the 25-entry claim inventory and added a manifest regression that requires one focused command and one tagged test per claim. | `@regression:F7-1`; all exact `.factory/claims.json` commands from a clean clone. |
| F-1-3 | Kept History API navigation, Back/Forward heading focus, and the polite route announcement. | `back navigation restores focus to the landing heading`; live `/` → `/privacy` → Back. |
| F-1-4 | Kept the designed HTTP 404 with route metadata, shared navigation, legal links, attribution, and the current build marker. | `gives the static 404 page the shared metadata, navigation, and footer`; `evidence/polish-7/live-not-found-desktop.png`; live `/not-a-real-route`. |
| F-1-5 | Kept the primary-action result explicit: review 12 sample entries, then download CSV and JSON. | `evidence/polish-7/live-landing-desktop-1440.png`; live `/`. |
| F-1-6 | Kept the concrete `Export food tracker history` eyebrow and removed decorative exit language. | `.factory/copy-audit.md`; live `/`. |
| F-1-7 | Kept `Download the desktop app`. | `.factory/copy-audit.md`; live `/`. |
| F-1-8 | Kept `Review before export`. | `.factory/copy-audit.md`; live `/`. |
| F-1-9 | Kept `How to turn an export into an archive`. | `.factory/copy-audit.md`; live `/#how`. |
| F-1-10 | Kept `Privacy and limits` and `How the app handles your files`. | `.factory/copy-audit.md`; live `/`. |
| F-1-11 | Kept `batch-import license` as the only paid-tier term. | `@claim:batch-import`; live `/terms`. |
| F-1-12 | Kept the short, concrete README opening. | `.factory/copy-audit.md`; clean-clone README. |
| F-2-1 / F-1-2 | Preserved every populated unrecognized field in JSON and named its source in conversion notes; kept that product promise in the claim inventory. | `@claim:lossy-fields`; `evidence/polish-7/live-app-desktop.png`; live `/app`. |
| F-2-2 | Kept checkout wording accurate to the Sociobot/Dodo hosted flow. | `@claim:paid-purchase`; live checkout redirect. |
| F-2-3 | Kept the shared semantic navigation and footer on app and demo routes. | `every route uses the same primary navigation destinations and shared footer`; live `/app` and `/demo`. |
| F-2-4 | Kept route-specific titles, canonical URLs, social URLs, heading focus, and announcements. | `each client route sets its title, canonical URL, and heading focus`; live `/app`. |
| F-2-5 | Bumped static and rendered build markers together to `0.1.17`. | `keeps the static and rendered footer build identifiers in sync`; live `/not-a-real-route`. |
| F-2-6 | Kept `food tracker` as the source-product term. | `.factory/copy-audit.md`; live `/`. |
| F-2-7 | Kept `batch-import license` as the paid-tier term. | `@claim:batch-import`; live `/terms`. |
| F-2-8 | Kept `archive` for the output and `free app` for the product tier. | `.factory/copy-audit.md`; live `/`. |
| F-2-9 | Kept `website and desktop app` in the README. | `.factory/copy-audit.md`; clean-clone README. |
| F-2-10 | Kept the same-site demo request boundary. | `@claim:local-only`; `@claim:privacy-no-account`; live `/demo`. |
| F-2-11 | Kept concrete `YYYY-MM-DD` wording and conversion-note behavior. | `@claim:validation-notes`; live `/app`. |
| F-2-12 | Kept explicit known-route reloads and static unknown-route 404 handling. | `@claim:static-hosting`; live `/app` and `/not-a-real-route`. |
| F-3-1 | Kept `Review conversion notes`. | `keeps review 3 copy plain and links readers to release notes`; live `/#how`. |
| F-3-2 | Kept `Save CSV and JSON`. | Same wording regression; live `/#how`. |
| F-3-3 | Kept plain wording for JSON fields and conversion notes. | Same wording regression; `.factory/copy-audit.md`. |
| F-3-4 | Kept the explanation that installer verification checks whether a download changed. | `@claim:verified-installer`; clean-clone README. |
| F-3-5 | Kept the explanation that the installer adds a terminal command. | `@claim:verified-installer`; clean-clone README. |
| F-3-6 | Kept the selected release-notes link beside the download. | `landing link crawl includes the selected release notes page`; live `/`. |
| F-4-1 | Kept the conversion-note promise within its tested scope. | `keeps the review promise within the tested conversion-note scope`; live `/`. |
| F-4-2 | Kept the populated export walkthrough and precise alternative text. | `ships a current export walkthrough frame with precise alternative text`; live `/#how`. |
| F-5-1 | Kept one shared navigation list on every route. | `every route uses the same primary navigation destinations and shared footer`; all live routes. |
| F-5-2 | Kept the tagged multi-platform release-workflow claim. | `@claim:release-workflow`; `v0.1.17` workflow run `33575608828`. |
| F-5-3 | Kept the concrete spreadsheet use for CSV. | `keeps review 5 wording concrete and consistent`; live `/#how`. |
| F-5-4 | Kept the plain tracker sign-in boundary. | Same wording regression; live `/`. |
| F-5-5 | Kept `Unrecognized fields appear in conversion notes`. | `@claim:lossy-fields`; live `/app`. |
| F-5-6 | Kept `does not recognize` in the README. | Same wording regression; clean-clone README. |
| F-5-7 | Kept `original field values` in the README. | `@claim:lossy-fields`; clean-clone README. |
| F-5-8 | Kept concrete meal, account, server, and medical-advice boundaries. | `@claim:privacy-no-account`; live `/privacy`. |
| F-5-9 | Kept `steps to open the app on your system`. | `.factory/copy-audit.md`; clean-clone README. |
| F-5-10 | Kept `Rust is needed only to build the desktop app`. | Native prerequisite check and Cargo test from a clean clone. |
| F-6-1 | Replaced mutable-HEAD provenance with an immutable version-tag contract. The release test derives the peeled `v0.1.17` commit and requires the GitHub target, `latest.json`, checksum header, installer URLs, downloaded installer checksum, and deployed identity to match it. | `@claim:candidate-installers`; release `v0.1.17`; live `/release-identity.json`. |
| F-6-2 | Kept separate tests for site source identity and release preflight, with short README wording. | `@claim:site-source-commit`; `@claim:release-preflight`; `.factory/claims.json`. |
| F-6-3 | Regenerated the copy audit for version `0.1.17` and the final catalog sentence. | `.factory/copy-audit.md`; `.factory/catalog-description.txt`; live `/`. |
| F-7-1 / F-6-1 | Published `v0.1.17` from the reviewed candidate, deployed the exact tagged site, and changed browser claim commands to focused Playwright runs so an unrelated Vitest phase cannot stop the named claim. Added a manifest test that enforces this shape. | `@regression:F7-1`; `@claim:candidate-installers`; all 25 exact claim commands from a fresh clone; `evidence/polish-7/release-verification.md`; live `/release-identity.json`. |

## Final verification

- The immutable release candidate is annotated tag `v0.1.17` at `15156f04a39104211d95ff0e965712d9c4732333`.
- GitHub Actions run `33575608828` builds both macOS architectures, Windows, and Linux before publishing checksums and `latest.json`.
- The clean-clone suite and each exact claim command are recorded in `evidence/polish-7/clean-clone-verification.md`.
- Cold production structure and console checks are under `evidence/polish-7/live-*`; Lighthouse output is `evidence/polish-7/lighthouse-live.json`.
- Desktop and mobile production screenshots are `evidence/polish-7/live-landing-desktop-1440.png`, `live-demo-mobile-390.png`, `live-app-desktop.png`, and `live-not-found-desktop.png`.
