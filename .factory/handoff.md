# Handoff — polish round 2

## Result

**PASS.** Every finding in `.factory/review-1.md` and `.factory/review-2.md` is repaired, tested, deployed, and cold-checked on 2026-08-29 UTC. The finding-by-finding evidence is in [polish-2.md](polish-2.md).

Live product: <https://food-log-export-kit.sociobot.in>

Direct isolated demo: <https://food-log-export-kit.sociobot.in/?demo=1>

## What changed

- Detects each populated input field that is not mapped to the normalized schema.
- Shows a conversion note with its row, original field name, and source file.
- Preserves the original value in the JSON record under `unmapped_fields`.
- Adds the `lossy-fields` claim and its observable browser test.
- Removes unsupported “complete” and refund wording.
- Correctly says Sociobot opens a Dodo-hosted checkout page.
- Adds shared navigation and footer content to `/app` and `/demo`.
- Gives `/app` its own canonical and OG URL.
- Unifies the live and static 404 build marker.
- Standardizes “food tracker” and “batch-import license” throughout.
- Rewrites the four flagged README phrases in plain words.
- Updates `.factory/catalog-description.txt` to a 69-character, verb-first sentence.
- Preserves the original archive-at-dusk art, forest/apricot palette, clipped labels, ledger layout, and motion policy.

## Exact verification

A clean clone at `/tmp/food-log-polish-2.BDw9rs` ran `npm ci` before all gates.

- All 20 exact commands in `.factory/claims.json`: passed independently.
- Claim tag audit: exactly one `@claim:<id>` occurrence for every manifest id.
- `npm test`: 16 unit tests and 44 browser tests passed; 4 intentional cross-project skips.
- `npm run build`: passed and produced `dist/site/`.
- `npm run build:app`: passed and produced `dist/app/`.
- `cargo test --manifest-path src-tauri/Cargo.toml`: passed with the Linux Tauri libraries used by the release workflow.
- Largest JavaScript chunk: 38.13 kB raw / 13.51 kB gzip. Total initial JavaScript: 48.52 kB raw. CSS: 23.39 kB raw / 6.08 kB gzip.
- Local Lighthouse: 99 performance, 100 accessibility, 100 best practices, 100 SEO; LCP 2.0 s, CLS 0, TBT 0 ms.
- Live Lighthouse: 100 performance, 100 accessibility, 100 best practices, 100 SEO; LCP 1.1 s, CLS 0, TBT 0 ms.
- `/opt/fleet/lib/verify-url.sh` passed live for `/`, `/?demo=1`, `/app`, `/privacy`, and `/terms` with no console errors.
- Live Playwright axe: zero serious or critical violations on `/`, `/demo`, `/app`, `/privacy`, and `/terms`.
- Cold 390 × 844 demo: the oatmeal sample ends at 616 px, above the first viewport edge.
- Live demo privacy: zero cross-origin requests, zero storage keys, Reset restored 12 entries, Start for real opened an empty `/app` workspace.
- Live offline: `/demo` reloaded with its sample and “You are offline” state after the browser was disconnected.
- Live lossy-field check: `Fiber=12` produced a visible source/row note and downloaded as `unmapped_fields.Fiber` with the matching JSON issue.
- Routing: known routes returned 200; `/not-a-real-route` returned a designed HTTP 404 with complete route metadata, legal links, factory attribution, and the shared build marker.
- Link crawl: every same-origin link returned 200; checkout returned the expected 303 to Dodo.
- Release `v0.1.2`: macOS Intel/Apple Silicon, Windows MSI/EXE, Linux AppImage/DEB/RPM, `latest.json`, and `SHA256SUMS` are present. The downloaded AppImage checksum passed.

Evidence is under `.factory/evidence/polish-2/`, including [live demo mobile](evidence/polish-2/live-demo/screenshot-mobile.png), [live lossy-field note](evidence/polish-2/live-lossy-fields-mobile.png), verifier JSON, and [live Lighthouse](evidence/polish-2/lighthouse-live.json).

## Deployment

- Command: `/opt/fleet/lib/deploy-static.sh food-log-export-kit dist/site`
- Azure deployment id: `c85a4034-ae2f-46a4-b4ba-06e67bc597e6`
- Static Web App: `sf-food-log-export-kit` in `centralus`
- Custom domain: <https://food-log-export-kit.sociobot.in> returned HTTPS 200 immediately after deployment.

## Known gaps

None for the researched job, cumulative reviews, claims contract, static site, or published desktop release.

## Needs operator action

None for this release. Published macOS and Windows binaries remain unsigned as stated in their GitHub release notes. Future code signing would require the owner to add certificate handling to the release workflow and provision signing secrets before tagging a new version.
