import { readFileSync, statSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

describe('static hosting routes', () => {
  it('@claim:static-hosting defines reload routes, security headers, cache rules, and a 404 response', () => {
    const config = JSON.parse(readFileSync(new URL('../../public/staticwebapp.config.json', import.meta.url), 'utf8')) as {
      navigationFallback?: unknown;
      routes: Array<{ route: string; rewrite?: string; headers?: Record<string, string> }>;
      responseOverrides: Record<string, { rewrite: string }>;
      globalHeaders: Record<string, string>;
    };
    expect(config.navigationFallback).toBeUndefined();
    for (const route of ['/app', '/demo', '/privacy', '/terms']) {
      expect(config.routes).toContainEqual(expect.objectContaining({ route, rewrite: '/index.html' }));
    }
    expect(config.responseOverrides['404']).toEqual({ rewrite: '/404.html' });
    for (const route of ['/assets/*', '/art/*', '/screens/*']) {
      expect(config.routes).toContainEqual(expect.objectContaining({ route, headers: { 'Cache-Control': 'public, max-age=31536000, immutable' } }));
    }
    expect(config.globalHeaders['Content-Security-Policy']).toContain("frame-ancestors 'none'");
    expect(config.globalHeaders['X-Content-Type-Options']).toBe('nosniff');
    expect(config.globalHeaders['Referrer-Policy']).toBe('strict-origin-when-cross-origin');
    expect(config.globalHeaders['Permissions-Policy']).toBe('camera=(), microphone=(), geolocation=()');
  });

  it('gives the static 404 page the shared metadata, navigation, and footer', () => {
    const page = readFileSync(new URL('../../public/404.html', import.meta.url), 'utf8');
    for (const marker of ['rel="canonical"', 'property="og:title"', 'property="og:url"', 'name="twitter:card"', 'apple-touch-icon', 'Main navigation', 'href="/terms"', 'Built by Param Factory', 'Version 0.1.10 · release repair']) {
      expect(page).toContain(marker);
    }
  });

  it('keeps the static and rendered footer build identifiers in sync', () => {
    const page = readFileSync(new URL('../../public/404.html', import.meta.url), 'utf8');
    const shell = readFileSync(new URL('../../src/shell.ts', import.meta.url), 'utf8');
    const build = 'Version ${appVersion} · release repair · Generated artwork';
    expect(page).toContain(build.replace('${appVersion}', '0.1.10'));
    expect(shell).toContain(build);
  });

  it('keeps review 3 copy plain and links readers to release notes', () => {
    const pages = readFileSync(new URL('../../src/pages.ts', import.meta.url), 'utf8');
    const readme = readFileSync(new URL('../../README.md', import.meta.url), 'utf8');
    for (const oldCopy of ['Read the notes', 'Save both formats', 'normalized local record', 'normalized archive']) {
      expect(pages).not.toContain(oldCopy);
    }
    for (const replacement of ['Review conversion notes', 'Save CSV and JSON', 'JSON keeps consistent fields and conversion notes', 'id="release-notes"']) {
      expect(pages).toContain(replacement);
    }
    expect(readme).toContain('checks that the downloaded file was not changed');
    expect(readme).toContain('command so you can run it from a terminal');
    expect(readme).toContain('[release notes](https://github.com/B-Divyesh/sf-food-log-export-kit/releases/latest)');
  });

  it('keeps review 5 wording concrete and consistent', () => {
    const pages = readFileSync(new URL('../../src/pages.ts', import.meta.url), 'utf8');
    const readme = readFileSync(new URL('../../README.md', import.meta.url), 'utf8');
    for (const oldCopy of ['Use CSV now', 'No account scraping', 'Unmapped fields are reported']) {
      expect(pages).not.toContain(oldCopy);
    }
    for (const replacement of ['Use the CSV in a spreadsheet', 'does not sign in to your tracker', 'Unrecognized fields appear in conversion notes']) {
      expect(pages).toContain(replacement);
    }
    for (const oldCopy of ['it cannot map', 'unmapped field values', 'has no tracker, account system', 'platform-specific open step', 'desktop shell']) {
      expect(readme).not.toContain(oldCopy);
    }
  });

  it('keeps the review promise within the tested conversion-note scope', () => {
    const pages = readFileSync(new URL('../../src/pages.ts', import.meta.url), 'utf8');
    const app = readFileSync(new URL('../../src/app.ts', import.meta.url), 'utf8');
    expect(pages).toContain('Review entries and conversion notes');
    expect(pages).not.toContain('See every row before you export');
    expect(app).toContain('Check entries and notes');
    expect(app).not.toContain('Check every row');
    expect(app).not.toContain('Try every export');
  });

  it('ships a current export walkthrough frame with precise alternative text', () => {
    const pages = readFileSync(new URL('../../src/pages.ts', import.meta.url), 'utf8');
    expect(pages).toContain('src="/screens/03-export.webp"');
    expect(pages).toContain('Two filled food-log rows above Export CSV and Export JSON buttons.');
    for (const screen of ['01-import.webp', '02-review.webp', '03-export.webp']) {
      expect(statSync(new URL(`../../public/screens/${screen}`, import.meta.url)).size).toBeGreaterThan(10_000);
    }
  });

  it('keeps drawer motion from lowering text contrast', () => {
    const styles = readFileSync(new URL('../../src/styles.css', import.meta.url), 'utf8');
    const drawer = styles.match(/@keyframes drawer \{([^}]+\}[^}]+)\}/)?.[1] ?? '';
    expect(drawer).toContain('transform: translateY(8px)');
    expect(drawer).not.toContain('opacity');
  });

  it('@regression:V14-payment-copy names the merchant of record and refund effect', () => {
    const pages = readFileSync(new URL('../../src/pages.ts', import.meta.url), 'utf8');
    const readme = readFileSync(new URL('../../README.md', import.meta.url), 'utf8');
    for (const copy of ['Sociobot/Dodo is the merchant of record', 'handles refunds', 'refund revokes']) {
      expect(pages).toContain(copy);
      expect(readme).toContain(copy);
    }
  });
});
