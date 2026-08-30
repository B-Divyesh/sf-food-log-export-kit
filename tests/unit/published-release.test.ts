import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const repository = 'B-Divyesh/sf-food-log-export-kit';
const version = (JSON.parse(readFileSync(new URL('../../package.json', import.meta.url), 'utf8')) as { version: string }).version;
const releaseTag = `v${version}`;
const requiredSourceCommit = execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim();

interface Asset {
  name: string;
  browser_download_url: string;
  size: number;
}

interface PublishedRelease {
  tag_name: string;
  target_commitish: string;
  assets: Asset[];
}

interface ReleaseManifest {
  version: string;
  release_tag: string;
  source_commit: string;
  platforms: Record<'macos' | 'windows' | 'linux', string[]>;
  checksums: Record<string, string>;
}

const apiHeaders: Record<string, string> = {
  Accept: 'application/vnd.github+json',
  'User-Agent': 'food-log-export-kit-release-regression'
};
if (process.env.GITHUB_TOKEN) apiHeaders.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;

async function requireResponse(url: string, init?: RequestInit): Promise<Response> {
  const response = await fetch(url, init);
  if (!response.ok) throw new Error(`${url} returned ${response.status}`);
  return response;
}

describe('published candidate release', () => {
  it('@regression:V14-release-identity @claim:candidate-installers binds every installer URL and checksum to the checked-out candidate', async () => {
    const release = await requireResponse(`https://api.github.com/repos/${repository}/releases/latest`, { headers: apiHeaders })
      .then((response) => response.json()) as PublishedRelease;
    expect(release.tag_name).toBe(releaseTag);
    expect(release.target_commitish).toBe(requiredSourceCommit);

    const tagRef = await requireResponse(`https://api.github.com/repos/${repository}/git/ref/tags/${releaseTag}`, { headers: apiHeaders })
      .then((response) => response.json()) as { object: { type: string; sha: string; url: string } };
    const tagCommit = tagRef.object.type === 'tag'
      ? await requireResponse(tagRef.object.url, { headers: apiHeaders }).then((response) => response.json()).then((tag: { object: { sha: string } }) => tag.object.sha)
      : tagRef.object.sha;
    expect(tagCommit).toBe(requiredSourceCommit);

    const byName = new Map(release.assets.map((asset) => [asset.name, asset]));
    const manifestAsset = byName.get('latest.json');
    const sumsAsset = byName.get('SHA256SUMS');
    expect(manifestAsset).toBeDefined();
    expect(sumsAsset).toBeDefined();

    const manifest = await requireResponse(manifestAsset!.browser_download_url).then((response) => response.json()) as ReleaseManifest;
    const sumsText = await requireResponse(sumsAsset!.browser_download_url).then((response) => response.text());
    expect(manifest).toMatchObject({ version, release_tag: releaseTag, source_commit: requiredSourceCommit });
    expect(sumsText.split(/\r?\n/)[0]).toBe(`# source_commit=${requiredSourceCommit}`);

    const publishedSums = new Map(sumsText.split(/\r?\n/).flatMap((line) => {
      const match = line.match(/^([0-9a-f]{64})\s+\*?(.+)$/i);
      return match ? [[match[2], match[1].toLowerCase()] as const] : [];
    }));
    const installerPattern = /(?:\.dmg|\.msi|\.exe|\.AppImage|\.deb|\.rpm)$/i;
    const installerAssets = release.assets.filter((asset) => installerPattern.test(asset.name));
    const manifestUrls = Object.values(manifest.platforms).flat();
    expect(manifest.platforms.macos.filter((url) => url.endsWith('.dmg'))).toHaveLength(2);
    expect(manifest.platforms.windows.some((url) => url.endsWith('.msi'))).toBe(true);
    expect(manifest.platforms.windows.some((url) => url.endsWith('.exe'))).toBe(true);
    for (const extension of ['.AppImage', '.deb', '.rpm']) {
      expect(manifest.platforms.linux.some((url) => url.endsWith(extension))).toBe(true);
    }

    expect(new Set(manifestUrls.map((url) => decodeURIComponent(new URL(url).pathname.split('/').at(-1)!))))
      .toEqual(new Set(installerAssets.map((asset) => asset.name)));
    for (const asset of installerAssets) {
      expect(asset.browser_download_url).toContain(`/releases/download/${releaseTag}/`);
      expect(publishedSums.get(asset.name)).toMatch(/^[0-9a-f]{64}$/);
      expect(manifest.checksums[asset.name]).toBe(publishedSums.get(asset.name));
      const link = await fetch(asset.browser_download_url, { redirect: 'manual', headers: { Range: 'bytes=0-0' } });
      expect(link.status, asset.name).toBeGreaterThanOrEqual(200);
      expect(link.status, asset.name).toBeLessThan(400);
    }

    const sampledAsset = [...installerAssets].sort((left, right) => left.size - right.size)[0];
    const sampledResponse = await requireResponse(sampledAsset.browser_download_url);
    const sampledBuffer = await sampledResponse.arrayBuffer();
    const sampledBytes = new Uint8Array(sampledBuffer as ArrayBuffer);
    expect(createHash('sha256').update(sampledBytes).digest('hex')).toBe(publishedSums.get(sampledAsset.name));
  }, 60_000);
});
