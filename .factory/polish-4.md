# Polish 4 — cumulative review repair map

Repair scope: released candidate `925af4dd15e6cf9e44d0274299a826f53398337c`,
review source `066f3e02305c245d7af3808348b492ff0fc1ad07`. This round also
releases the repaired desktop shell as `v0.1.6`, because the prior published
desktop installers were built before the repaired source.

Evidence paths below are committed under `.factory/evidence/polish-4/`. Live
checks use <https://food-log-export-kit.sociobot.in> in a new browser context.

| Finding ID | Change made | Evidence |
|---|---|---|
| F-1-1 | Kept the direct `?demo=1` / `/demo` sandbox, persistent banner, reset, exit action, and named first-viewport sample record. | `mobile demo shows a named sample record in the first viewport`; `live-demo/screenshot-mobile.png`; cold live demo check. |
| F-1-2 | Kept the complete 20-item claims manifest, one exact tagged test per ID, and only declared, observable public promises. | clean-clone manifest gate; `claims manifest: 20 ids, one tagged test each`; live landing check. |
| F-1-3 | Kept History navigation heading focus and polite route announcement, including browser Back. | `back navigation restores focus to the landing heading`; cold live focus check. |
| F-1-4 | Kept the designed HTTP 404 with unique metadata, shared navigation, legal links, attribution, and build marker. | `gives the static 404 page the shared metadata, navigation, and footer`; live `/not-a-real-route` returned HTTP 404. |
| F-1-5 | Kept the first action outcome explicit about the CSV and JSON archive. | `live-landing/screenshot-desktop.png`; cold live landing check. |
| F-1-6 | Kept the plain `Export food tracker history` eyebrow and removed decorative exit copy. | `.factory/copy-audit.md`; cold live landing check. |
| F-1-7 | Kept the direct `Download the desktop app` section title. | `.factory/copy-audit.md`; `live-landing/screenshot-desktop.png`. |
| F-1-8 | Kept the descriptive `Review before export` label. | `.factory/copy-audit.md`; cold live landing check. |
| F-1-9 | Kept `How to turn an export into an archive` as the task-specific workflow heading. | `.factory/copy-audit.md`; cold live landing check. |
| F-1-10 | Kept `Privacy and limits` / `How the app handles your files`. | `.factory/copy-audit.md`; cold live landing check. |
| F-1-11 | Kept `batch-import license` as the one paid-tier name. | `.factory/copy-audit.md`; `@claim:batch-import`; live `/terms` check. |
| F-1-12 | Kept the short, concrete README opening and the complete copy audit. | `.factory/copy-audit.md`; copy unit regression. |
| F-2-1 | Kept populated unknown fields in JSON `unmapped_fields` and named their source in conversion notes. | `@claim:lossy-fields names and preserves every populated unrecognized field`; clean-clone claims gate. |
| F-2-2 | Kept payment copy accurate: Sociobot opens the Dodo-hosted checkout. | `@claim:paid-purchase live checkout redirects to Dodo hosted checkout`; live endpoint assertion. |
| F-2-3 | Kept shared semantic navigation and footer on `/app` and `/demo`. | `app and demo use the shared navigation and footer`; `live-app/screenshot-desktop.png`; `live-demo/screenshot-desktop.png`. |
| F-2-4 | Kept route-specific title, canonical URL, heading focus, and social metadata. | `each client route sets its title, canonical URL, and heading focus`; cold live `/app` canonical check. |
| F-2-5 | Moved the static and rendered footer marker together to `0.1.6`. | `keeps the static and rendered footer build identifiers in sync`; live 404 source check. |
| F-2-6 | Kept `food tracker` as the public source-product term. | `.factory/copy-audit.md`; copy unit regression. |
| F-2-7 | Kept `batch-import license` as the public paid-tier term. | `.factory/copy-audit.md`; `@claim:batch-import`. |
| F-2-8 | Kept `archive` for the exported result, never the free app. | `.factory/copy-audit.md`; cold live landing check. |
| F-2-9 | Kept `website and desktop app` in README instead of unexplained webview jargon. | `.factory/copy-audit.md`; copy unit regression. |
| F-2-10 | Kept the readable `contacts only this website` privacy boundary. | `@claim:local-only`; `@claim:privacy-no-account`. |
| F-2-11 | Kept `YYYY-MM-DD` rather than an unexplained date acronym. | `@claim:validation-notes`; `.factory/copy-audit.md`. |
| F-2-12 | Kept concrete reload behavior instead of routing jargon. | `rewrites only known app routes and lets unknown paths return HTTP 404`; live `/app` and 404 checks. |
| F-3-1 | Kept `Review conversion notes` instead of ambiguous note copy. | `keeps review 3 copy plain and links readers to release notes`; cold live landing check. |
| F-3-2 | Kept `Save CSV and JSON` instead of an unnamed antecedent. | same copy regression; `live-walkthrough-export.png`. |
| F-3-3 | Kept plain wording for consistent JSON fields and conversion notes. | same copy regression; `.factory/copy-audit.md`. |
| F-3-4 | Kept the README explanation that installer verification checks the file was not changed. | `.factory/copy-audit.md`; `@claim:verified-installer`. |
| F-3-5 | Kept the README explanation that the installer adds a terminal command. | `.factory/copy-audit.md`; `@claim:verified-installer`. |
| F-3-6 | Kept the visible release-notes destination beside the selected download. | `landing link crawl includes the selected release notes page`; `@claim:detected-platform-downloads`. |
| F-4-1 | Replaced the unlisted absolute `See every row before you export` with `Review entries and conversion notes`; removed the same absolute wording from the app rail and demo banner. | `keeps the review promise within the tested conversion-note scope`; cold live heading check confirms the old phrase is absent. |
| F-4-2 | Recaptured all three 760 × 489 walkthrough frames from the current shared-shell app. The export frame now visibly contains two populated rows and both export buttons; its alt text now states exactly that. | `ships a current export walkthrough frame with precise alternative text`; `live-walkthrough-export.png`; live image check reports `naturalWidth=760`, `naturalHeight=489`. |

## Final verification

- `npm test` — 23 unit tests and 52 browser tests passed; four Chromium
  project skips are intentional because the same mobile checks run in the
  mobile project.
- `npm run build` and `npm run build:app` passed. The largest initial script is
  38.71 kB raw / 13.67 kB gzip.
- The clean-clone claims gate ran every exact command in `.factory/claims.json`.
  All 20 claims passed independently.
- `/opt/fleet/lib/verify-url.sh` reported no console errors and confirmed title,
  language, one heading, main landmark, image alternatives, and named buttons
  on the landing, demo, app, privacy, and terms pages.
- Fresh live axe checks found zero serious or critical violations on `/`,
  `/demo`, `/app`, `/privacy`, `/terms`, and the HTTP 404. The cold live demo
  reset, exit, request-boundary, offline reload, and route-focus checks passed.
- Static deployment used `/opt/fleet/lib/deploy-static.sh food-log-export-kit
  dist/site`; its final Azure deployment id was
  `f6864bf4-3deb-45b2-b8de-4e7df6736c38`.
- GitHub Actions release run `33278683092` passed for both macOS targets,
  Windows, and Linux, then published `v0.1.6`, `SHA256SUMS`, and `latest.json`.
  A downloaded `Food.Log.Export.Kit_0.1.6_amd64.AppImage` passed its published
  SHA-256 check.
