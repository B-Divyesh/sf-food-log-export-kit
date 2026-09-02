import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

interface Claim {
  id: string;
  test: string;
}

const read = (path: string) => readFileSync(new URL(`../../${path}`, import.meta.url), 'utf8');

describe('claims manifest', () => {
  it('@regression:F7-1 gives every claim one focused command and one tagged test', () => {
    const claims = JSON.parse(read('.factory/claims.json')) as Claim[];
    const testSource = [
      'tests/e2e/claims.spec.ts',
      'tests/unit/hosting.test.ts',
      'tests/unit/installer.test.ts',
      'tests/unit/published-release.test.ts',
      'tests/unit/release-version.test.ts',
      'tests/unit/tooling.test.ts'
    ].map(read).join('\n');

    expect(claims).toHaveLength(25);
    expect(new Set(claims.map(({ id }) => id)).size).toBe(claims.length);

    for (const { id, test } of claims) {
      const tag = `@claim:${id}`;
      expect(test, `${id} command`).toContain(tag);
      expect(test, `${id} command`).toMatch(/^npm run test:(?:e2e|unit) -- /);
      const escapedTag = tag.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      expect(testSource.match(new RegExp(`(?:test|it)\\([^\\n]*${escapedTag}`, 'g')) ?? []).toHaveLength(1);
    }
  });
});
