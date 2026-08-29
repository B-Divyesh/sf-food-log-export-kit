# Handoff — adversarial review 2

## Result

**FAIL** for commit `ad419455d79abbeb8f00befb0d82114ee2400bf7` and the live site on 2026-08-29 UTC. The full review is in [review-2.md](review-2.md).

No product code was changed. Pre-existing modified files under `graphify-out/` were preserved and excluded from the review commit.

## What was checked

- Cold 390 × 844 and 1440 × 900 landing-page reads.
- One-click demo, visible sample, reset, exit, storage isolation, request log, and offline claim.
- Every exact command in all 19 `.factory/claims.json` entries from a fresh `git clone --no-local` after `npm ci`.
- Full `npm test` and `npm run build` in that clean clone.
- Landing and README sentence/heading/action audit with word counts.
- Every finding in review 1 against the live site and current code.
- Route status, metadata, canonical, one-h1/main/lang, Back focus, links, 404, axe, console, responsive layout, and visual identity.

## Verification results

- All 19 declared claim commands: passed.
- `npm test`: 39 passed, 4 intentional skips.
- `npm run build`: passed; `dist/site/` produced.
- Live `/` and `/demo` verifier: passed with no console errors or missing alt text.
- Live serious/critical axe violations on `/`, `/demo`, `/app`, `/privacy`, `/terms`: none.
- Live demo requests: same-origin only; local storage, session storage, and cookies remained empty in a fresh direct context.
- Link crawl: no dead destination found.

## Blocking gaps

1. A populated unknown field such as `Fiber` is silently omitted from JSON with zero conversion notes, contradicting the brief and the live “complete”, “no silent drops”, “preserves supplied values”, and “every imported row was explained” wording.
2. The landing says checkout is hosted by Sociobot, while the tested redirect opens Dodo-hosted checkout.

The review also records missing shared app/demo footer navigation, the `/app` canonical conflict, a stale 404 build marker, terminology drift, and four plain-language README issues.

## Next verification

After repair, add a lossy-field claim and fixture, add or remove the refunded-license claim, rerun every manifest command from a fresh clone, then repeat the live demo/privacy, route, copy, and prior-finding checks from scratch.
