const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

function existsAny(paths) {
  return paths.some((p) => fs.existsSync(path.resolve(p)));
}

test('has a homepage file', () => {
  const candidates = [
    'app/page.tsx',
    'app/page.ts',
    'app/page.jsx',
    'app/page.js',
    'src/app/page.tsx',
    'src/app/page.ts',
    'src/app/page.jsx',
    'src/app/page.js',
    'pages/index.tsx',
    'pages/index.ts',
    'pages/index.jsx',
    'pages/index.js',
    'src/pages/index.tsx',
    'src/pages/index.ts',
    'src/pages/index.jsx',
    'src/pages/index.js',
  ];
  assert.ok(
    existsAny(candidates),
    'Expected a Next.js homepage at app/page.* or pages/index.*'
  );
});

test('has a Next.js app structure', () => {
  const hasAppDir = existsAny(['app', 'src/app']) &&
    (fs.existsSync(path.resolve('app')) || fs.existsSync(path.resolve('src/app')));
  const hasPagesDir = existsAny(['pages', 'src/pages']) &&
    (fs.existsSync(path.resolve('pages')) || fs.existsSync(path.resolve('src/pages')));
  assert.ok(
    hasAppDir || hasPagesDir,
    'Expected a Next.js directory: app/ or pages/'
  );
});

