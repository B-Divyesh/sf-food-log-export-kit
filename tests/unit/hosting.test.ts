import { readFileSync } from 'node:fs';
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
    for (const marker of ['rel="canonical"', 'property="og:title"', 'property="og:url"', 'name="twitter:card"', 'apple-touch-icon', 'Main navigation', 'href="/terms"', 'Built by Param Factory', 'Version 0.1.3 · repair 4']) {
      expect(page).toContain(marker);
    }
  });

  it('keeps the static and rendered footer build identifiers in sync', () => {
    const page = readFileSync(new URL('../../public/404.html', import.meta.url), 'utf8');
    const shell = readFileSync(new URL('../../src/shell.ts', import.meta.url), 'utf8');
    const build = 'Version 0.1.3 · repair 4 · Generated artwork';
    expect(page).toContain(build);
    expect(shell).toContain(build);
  });
});
