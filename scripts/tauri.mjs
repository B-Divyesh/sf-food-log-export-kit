#!/usr/bin/env node

// Tauri parses CI as a strict boolean. Several CI systems expose the common
// shell values 1 and 0, so normalize them before the native CLI reads it.
if (process.env.CI === '1') process.env.CI = 'true';
if (process.env.CI === '0') process.env.CI = 'false';

const { run } = await import('@tauri-apps/cli');

try {
  await run(process.argv.slice(2), 'npm run tauri');
} catch (error) {
  const message = error instanceof Error ? error.message : String(error);
  console.error(message);
  process.exitCode = 1;
}
