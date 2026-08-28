# Food Log Export Kit

Turn food tracker exports into a local archive.

Food Log Export Kit is for people leaving a calorie tracker. It reads user-provided CSV and JSON files, normalizes meal, recipe, nutrition, and weight fields, then exports a readable CSV and a versioned JSON archive. Files and rows it cannot use appear in conversion notes.

All food-data conversion happens in the browser or desktop webview. The project has no tracker, account system, food-data server, or medical advice. The sample demo makes no cross-origin requests.

Live site: <https://food-log-export-kit.sociobot.in>

Demo: <https://food-log-export-kit.sociobot.in/demo>

## Supported input

- CSV files separated by commas, semicolons, or tabs
- JSON arrays and objects with `entries`, `records`, `meals`, `foods`, `items`, or `data` lists
- Common column names used for dates, meals, foods, recipes, amounts, energy, macros, and weights
- ISO dates in `YYYY-MM-DD` order; impossible and ambiguous numeric dates are noted
- Dot decimals, grouped commas such as `1,234`, and decimal commas such as `1,5`; comma interpretations are noted

The free app imports one file at a time. A $19 one-time personal license adds multi-file selection. Paste its token to restore it on another device. CSV and JSON export stay free. Purchases and license checks use the Sociobot billing API.

## Run locally

Requires Node.js 22. Rust is needed only for the desktop shell.

```sh
npm install
npm run dev
```

Open `http://127.0.0.1:4173/demo` for the isolated sample workspace.

## Test and build

```sh
npm test
npm run build:site
npm run build:app
npm run tauri build
```

`npm run build:site` writes the deployable website to `dist/site/`, with `index.html` at that root. `npm run build:app` writes the Tauri frontend to `dist/app/`. The release workflow builds unsigned macOS, Windows, and Linux installers after a `v*` tag is pushed.

Each product statement and its browser test is listed in [`.factory/claims.json`](.factory/claims.json). Demo behavior is documented in [`.factory/demo.md`](.factory/demo.md).

## Project map

- `src/importer.ts` — format detection and normalization
- `src/exporter.ts` — CSV and portable JSON output
- `src/app.ts` — local workspace and demo
- `src-tauri/` — Tauri 2 desktop shell
- `.github/workflows/release.yml` — cross-platform release builds

## Deploy

Publish `dist/site/` as a static site. The included Static Web Apps config sets SPA routing, security headers, caching behavior, and the 404 response. The factory handles DNS and deployment.

## Privacy and license

The MIT license covers the source code. Product terms for the paid batch license are available at `/terms`; data handling details are at `/privacy`.
