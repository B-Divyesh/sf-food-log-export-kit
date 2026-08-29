import { readFileSync, statSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

describe('static hosting routes', () => {
  it('rewrites only known app routes and lets unknown paths return HTTP 404', () => {
    const config = JSON.parse(readFileSync(new URL('../../public/staticwebapp.config.json', import.meta.url), 'utf8')) as {
      navigationFallback?: unknown;
      routes: Array<{ route: string; rewrite?: string }>;
      responseOverrides: Record<string, { rewrite: string }>;
    };
    expect(config.navigationFallback).toBeUndefined();
    for (const route of ['/app', '/demo', '/privacy', '/terms']) {
      expect(config.routes).toContainEqual(expect.objectContaining({ route, rewrite: '/index.html' }));
    }
    expect(config.responseOverrides['404']).toEqual({ rewrite: '/404.html' });
  });

  it('gives the static 404 page the shared metadata, navigation, and footer', () => {
    const page = readFileSync(new URL('../../public/404.html', import.meta.url), 'utf8');
    for (const marker of ['rel="canonical"', 'property="og:title"', 'property="og:url"', 'name="twitter:card"', 'apple-touch-icon', 'Main navigation', 'href="/terms"', 'Built by Param Factory', 'Version 0.1.6 · release repair']) {
      expect(page).toContain(marker);
    }
  });

  it('keeps the static and rendered footer build identifiers in sync', () => {
    const page = readFileSync(new URL('../../public/404.html', import.meta.url), 'utf8');
    const shell = readFileSync(new URL('../../src/shell.ts', import.meta.url), 'utf8');
    const build = 'Version ${appVersion} · release repair · Generated artwork';
    expect(page).toContain(build.replace('${appVersion}', '0.1.6'));
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
});
