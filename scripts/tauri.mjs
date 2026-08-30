#!/usr/bin/env node

import { ensureLinuxNativePrerequisites } from './linux-native-prereqs.mjs';

// Tauri parses CI as a strict boolean. Several CI systems expose the common
// shell values 1 and 0, so normalize them before the native CLI reads it.
if (process.env.CI === '1') process.env.CI = 'true';
if (process.env.CI === '0') process.env.CI = 'false';

const { run } = await import('@tauri-apps/cli');

try {
  // Fail with the exact setup command before Cargo emits an opaque glib-sys
  // error in a clean Linux checkout. Help remains available without GTK.
  if (process.platform === 'linux' && process.argv.includes('build') && !process.argv.includes('--help')) {
    ensureLinuxNativePrerequisites();
  }
  await run(process.argv.slice(2), 'npm run tauri');
} catch (error) {
  const message = error instanceof Error ? error.message : String(error);
  console.error(message);
  process.exitCode = 1;
}
