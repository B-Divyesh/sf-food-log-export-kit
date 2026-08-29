# Polish 3 — cumulative review repair map

Every finding in reviews 1–3 is closed below. Test names refer to the final clean-clone run at commit `3ef5e19`. Live checks refer to deployment `78331c2a-eb2f-477c-bf73-2858f49c3cdb` at <https://food-log-export-kit.sociobot.in>.

| Finding | Change made | Evidence |
|---|---|---|
| F-1-1 | Kept a named meal above the stage rail in the direct, isolated demo. The persistent demo banner includes Reset demo and Start for real. | `mobile demo shows a named sample record in the first viewport`; [mobile screenshot](evidence/polish-3/live-demo-final/screenshot-mobile.png); live `/?demo=1` measured the record bottom at 616 px in an 844 px viewport. |
| F-1-2 | Completed `.factory/claims.json` with 20 observable claims and exactly one tagged test per id. Removed untestable public statements and retained privacy, payment, installer, demo, and field-loss coverage. | [clean-clone summary](evidence/polish-3/clean-clone-summary.md); all 20 exact manifest commands passed; `@claim:license-request-data-boundary`; `@claim:lossy-fields`. |
| F-1-3 | History navigation focuses and announces each route heading, including browser Back. | `back navigation restores focus to the landing heading`; [live audit](evidence/polish-3/live-audit.json) records Privacy focus and restored landing focus. |
| F-1-4 | Preserved the designed HTTP 404 with unique title, canonical/social metadata, standard navigation, legal links, attribution, and current footer marker. | `gives the static 404 page the shared metadata, navigation, and footer`; [404 screenshot](evidence/polish-3/live-404-final/screenshot-desktop.png); live `/missing-page` returned 404. |
| F-1-5 | The first action says it reviews 12 sample entries and downloads CSV and JSON. | `keeps review 3 copy plain and links readers to release notes`; [landing screenshot](evidence/polish-3/live-landing-final/screenshot-desktop.png). |
| F-1-6 | Kept the concrete eyebrow “Export food tracker history” and no decorative exit slogan. | `.factory/copy-audit.md`; live `/`. |
| F-1-7 | Kept the direct heading “Download the desktop app”. | `.factory/copy-audit.md`; live `/`. |
| F-1-8 | Kept the descriptive label “Review before export”. | `.factory/copy-audit.md`; live `/`. |
| F-1-9 | Kept “How to turn an export into an archive”. | `.factory/copy-audit.md`; live `/`. |
| F-1-10 | Kept “Privacy and limits” and “How the app handles your files”. | `.factory/copy-audit.md`; live `/`. |
| F-1-11 | Standardized the section and tier name as “batch-import license”. | `.factory/copy-audit.md`; live `/` and `/terms`. |
| F-1-12 | Kept the README opening as short, concrete sentences. | `README.md`; `.factory/copy-audit.md` reports no sentence over 22 words or banned marketing wording. |
| F-2-1 / F-1-2 reopened | Every populated unknown CSV column or JSON key creates a row/source note and is retained in JSON `unmapped_fields`. | `@claim:lossy-fields names and preserves every populated unrecognized field`; `preserves populated unmapped fields and names their source row`; live Fiber check exported `unmapped_fields.Fiber = "12"`. |
| F-2-2 | Payment copy says Sociobot opens a checkout hosted by Dodo. | `@claim:paid-purchase live checkout redirects to Dodo hosted checkout`; exact claim passed against the live endpoint. |
| F-2-3 | `/app` and `/demo` use the shared semantic navigation and footer with Privacy, Terms, attribution, and version. | `app and demo use the shared navigation and footer`; final `verify-url.sh` reports for both routes. |
| F-2-4 | Each client route sets its own title, canonical URL, heading, and focus state. | `each client route sets its title, canonical URL, and heading focus`; live `/app` title is `Archive — Food Log Export Kit`. |
| F-2-5 | Static and rendered footers now both say `Version 0.1.4 · polish 3 · Generated artwork`. | `keeps the static and rendered footer build identifiers in sync`; live app and 404 checks. |
| F-2-6 | Public source-product wording consistently uses “food tracker”. | `.factory/copy-audit.md`; `keeps review 3 copy plain and links readers to release notes`. |
| F-2-7 | Public paid-tier wording consistently uses “batch-import license”. | `.factory/copy-audit.md`; `@claim:batch-import`; `@claim:paid-purchase`. |
| F-2-8 | “Archive” refers to the output; the product tier is “the free app”. | `.factory/copy-audit.md`; live `/`. |
| F-2-9 | README says “website and desktop app” instead of “desktop webview”. | `README.md`; copy regression test. |
| F-2-10 | README says the sample demo “contacts only this website”. | `@claim:local-only`; `@claim:privacy-no-account`; live demo request audit stayed same-origin. |
| F-2-11 | README names `YYYY-MM-DD` directly and explains invalid dates with conversion notes. | `@claim:validation-notes`; `README.md`. |
| F-2-12 | README describes route reload behavior instead of “SPA routing”. | `rewrites only known app routes and lets unknown paths return HTTP 404`; live `/app` returned 200 and `/missing-page` returned 404. |
| F-3-1 | Replaced “Read the notes” with “Review conversion notes”. | `keeps review 3 copy plain and links readers to release notes`; [landing screenshot](evidence/polish-3/live-landing-final/screenshot-desktop.png); cold live copy check. |
| F-3-2 | Replaced “Save both formats” with “Save CSV and JSON”. | Same copy regression test and live screenshot. |
| F-3-3 | Removed unexplained “normalized” from landing copy. It now says CSV is for spreadsheets and JSON keeps consistent fields and conversion notes. | Same copy regression test; cold live check asserted the new sentence and absence of “normalized archive”. |
| F-3-4 | README now says the installer checks that the downloaded file was not changed. | `keeps review 3 copy plain and links readers to release notes`; `README.md`. |
| F-3-5 | README now says the installer adds a command that can be run from a terminal. | Same copy regression test; `README.md`. |
| F-3-6 | Added a visible, 44 px release-notes link beside the detected download. It updates to the exact release returned by GitHub. README links to the same release destination. | `landing link crawl includes the selected release notes page`; `@claim:detected-platform-downloads`; live link resolved to release `v0.1.4` with HTTP 200. |

## Additional live-audit repair

The first deployment’s immediate axe scan caught the review drawer during an opacity animation, which temporarily reduced contrast. The drawer now moves by 8 px without lowering text opacity; reduced-motion mode remains instant. `keeps drawer motion from lowering text contrast` prevents regression. Immediate cold axe scans on `/`, `/demo`, `/app`, `/privacy`, `/terms`, and the HTTP 404 now report zero serious or critical findings.

## Final acceptance evidence

- [Clean-clone results](evidence/polish-3/clean-clone-summary.md)
- [Cold live audit](evidence/polish-3/live-audit.json)
- [Live Lighthouse report](evidence/polish-3/lighthouse-live.json): 100 performance, 100 accessibility, 100 best practices, 100 SEO; LCP 1.7 s, CLS 0, TBT 0 ms.
- `/opt/fleet/lib/verify-url.sh` passed on `/`, `/?demo=1`, `/app`, `/privacy`, and `/terms` with no console errors.
- GitHub release `v0.1.4` exposes macOS, Windows, AppImage, DEB, RPM, `latest.json`, and `SHA256SUMS`. The 80,959,992-byte AppImage matched SHA-256 `78f07207b7837154ee3cb98f4b4a67f2164c633bf450108900a4a2363f2eb003`.
