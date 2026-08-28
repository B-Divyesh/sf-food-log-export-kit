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
});
