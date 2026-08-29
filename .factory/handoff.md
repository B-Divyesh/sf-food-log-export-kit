# Handoff — perfection-loop round 1

## Result

Repaired every finding in [review 1](review-1.md). The desktop-app artifact class, local-first conversion flow, Tauri shell, and dusk archive visual system remain intact.

## Delivered

- A direct isolated demo at `/?demo=1` and `/demo`, with an above-the-fold 390px sample record, persistent demo banner, reset, and exit to an empty real workspace.
- First-screen, section, pricing, legal, metadata, README, and catalog copy rewritten to the review’s plain-language requirements.
- Complete static 404 metadata and shared navigation/footer treatment.
- Route-change focus on every client-side transition, including browser Back.
- Expanded claims inventory with a recorded, observable license request data-boundary test; unsupported public promises were removed.
- Mobile, accessibility, metadata, offline, installer, import/export, privacy, and claims coverage retained and expanded.

## Local evidence

- `npm ci` — passed, 0 known vulnerabilities.
- `npm run build` — passed; deployable static site is in `dist/site/`.
- `npm run test:unit` — passed: 14 tests.
- `npm run test:e2e -- --project=mobile` — passed: 13 tests.
- `npm run test:e2e -- --project=chromium` — passed: 30 tests.
- `verify-url.sh http://127.0.0.1:4173/` and `verify-url.sh http://127.0.0.1:4173/?demo=1` — passed with no browser-console errors; reports and screenshots are under `.factory/evidence/`.
- Fresh clone evidence: `git clone --no-local`, `npm ci`, all 19 declared claim tests (17 browser claims plus both installer claims) passed.
- `cargo fmt --check`, `cargo test --locked`, `cargo clippy -- -D warnings`, and `CI=false npm run tauri -- build --no-bundle` passed after installing the Linux dependencies declared in the release workflow.
- Deployed through `/opt/fleet/lib/deploy-static.sh food-log-export-kit dist/site`; Azure deployment `5dd01280-6d5d-4de9-8d73-8b48d5b16650` succeeded. Cold live checks for `/` and `/?demo=1` passed with no console errors; live reports are in `.factory/evidence/live-landing/verify.json` and `.factory/evidence/live-demo/verify.json`. The live unknown route returned HTTP 404 with the required static-404 metadata and shared footer.
- The specific finding-to-evidence table is in [`.factory/polish-1.md`](polish-1.md).

## Run and verify

```sh
npm ci
npm test
npm run build
npm run build:app
```

Open `http://127.0.0.1:4173/?demo=1` after `npm run dev` or `npm exec vite preview` to inspect the isolated sample workspace.

## Remaining operator action

No code gaps are known. Push/deploy verification is completed after the repair commit so the live URL can be checked cold against this exact source revision.
