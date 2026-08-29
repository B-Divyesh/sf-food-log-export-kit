# Polish 1 — review repair map

Candidate repaired from `d37c582574f2e9984cd1b487dda125ca7131e727`; review source: `629a180189fb367458c84d0cf6a8c8060372b284`.

| Finding | Change made | Evidence |
|---|---|---|
| F-1-1 | Added a compact, real sample record above the stage rail in demo mode. `/?demo=1` now opens the same isolated demo, with the persistent banner, reset, and exit controls. | `mobile demo shows a named sample record in the first viewport`; [390px screenshot](evidence/demo-mobile-390.png) |
| F-1-2 | Removed untestable “open anywhere,” “readable,” signing, and refund statements. Added the token-only verification claim and test; narrowed remaining copy to declared claims. | `npm test -- --grep @claim:license-request-data-boundary`; `.factory/claims.json` parses and has one tagged test per entry |
| F-1-3 | Every client-side route change, including browser Back, now focuses and announces the new page heading. | `back navigation restores focus to the landing heading` |
| F-1-4 | Completed the static HTTP 404 page with canonical, OG, Twitter, Apple-touch metadata, standard navigation, Param Factory footer link, and build marker. | `static hosting routes › gives the static 404 page the shared metadata, navigation, and footer` |
| F-1-5 | Named both download formats beside the first action. | `Review 12 sample entries, then download a CSV and JSON archive.` in [desktop screenshot](evidence/landing-desktop-1440.png) |
| F-1-6 | Replaced the slogan eyebrow and deleted the decorative exit label. | `Export food tracker history` on the landing page |
| F-1-7 | Renamed the download section to `Download the desktop app`. | Landing copy audit |
| F-1-8 | Renamed the preview eyebrow to `Review before export`. | Landing copy audit |
| F-1-9 | Renamed the workflow heading to `How to turn an export into an archive`. | Landing copy audit |
| F-1-10 | Renamed the boundaries section to `Privacy and limits` / `How the app handles your files`. | Landing copy audit |
| F-1-11 | Renamed the pricing eyebrow to `Batch-import license`. | Landing copy audit |
| F-1-12 | Rewrote the README opening as four short concrete sentences. | README and `.factory/copy-audit.md` |

## Verification

- `npm ci`, `npm run build`, `npm run test:unit`, `npm run test:e2e -- --project=mobile`, and `npm run test:e2e -- --project=chromium` passed locally.
- `/opt/fleet/lib/verify-url.sh` found no console errors and confirmed title, language, one heading, main landmark, and image alt text for `/` and `/?demo=1`; reports are in `evidence/local-landing/verify.json` and `evidence/local-demo/verify.json`.
- A fresh `git clone --no-local` plus `npm ci` ran all 19 declared tagged claim tests: 17 browser claims and both installer claims passed.
