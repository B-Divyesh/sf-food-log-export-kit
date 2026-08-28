const slug = 'food-log-export-kit';
const key = `sb_license:${slug}`;
const verdictKey = `${key}:verdict`;
const base = 'https://api.sociobot.in/api/v1';

export interface LicenseState { licensed: boolean; checking: boolean; notice: string; }

export function checkoutUrl(): string {
  return `${base}/products/${slug}/checkout`;
}

export function storedLicense(): string {
  return localStorage.getItem(key) ?? '';
}

export function acceptLicenseFromUrl(): void {
  const url = new URL(location.href);
  const token = url.searchParams.get('license');
  if (!token) return;
  localStorage.setItem(key, token);
  url.searchParams.delete('license');
  history.replaceState({}, '', `${url.pathname}${url.search}${url.hash}`);
}

export function optimisticLicense(): boolean {
  const cached = localStorage.getItem(verdictKey);
  if (!cached) return false;
  try { return JSON.parse(cached).valid === true; } catch { return false; }
}

export async function verifyLicense(token = storedLicense()): Promise<LicenseState> {
  if (!token) return { licensed: false, checking: false, notice: '' };
  localStorage.setItem(key, token.trim());
  const cachedRaw = localStorage.getItem(verdictKey);
  if (cachedRaw) {
    try {
      const cached = JSON.parse(cachedRaw) as { valid: boolean; checked: number };
      if (Date.now() - cached.checked < 86_400_000) return { licensed: cached.valid, checking: false, notice: cached.valid ? '' : 'This license is no longer active.' };
    } catch { /* verify below */ }
  }
  try {
    const response = await fetch(`${base}/products/${slug}/verify?license=${encodeURIComponent(token.trim())}`);
    if (!response.ok) throw new Error('verify unavailable');
    const result = await response.json() as { valid: boolean };
    localStorage.setItem(verdictKey, JSON.stringify({ valid: result.valid, checked: Date.now() }));
    return { licensed: result.valid, checking: false, notice: result.valid ? '' : 'This license is no longer active.' };
  } catch {
    return { licensed: optimisticLicense(), checking: false, notice: 'License check is offline. The last saved status is in use.' };
  }
}

export function removeLicense(): void {
  localStorage.removeItem(key);
  localStorage.removeItem(verdictKey);
}
