const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

function read(file) {
  const p = path.resolve(file);
  assert.ok(fs.existsSync(p), `Expected file to exist: ${file}`);
  return fs.readFileSync(p, 'utf8');
}

test('layout exports metadata with title and description', () => {
  const src = read('app/layout.tsx');
  assert.match(src, /export\s+const\s+metadata\s*:/, 'Missing export const metadata');
  assert.match(src, /title\s*:/, 'Missing title in metadata');
  assert.match(src, /description\s*:/, 'Missing description in metadata');
});

test('layout has html lang attribute and canonical link', () => {
  const src = read('app/layout.tsx');
  assert.match(src, /<html\s+lang=(["'])\w+\1/, 'Missing <html lang="…">');
  assert.ok(fs.existsSync(path.resolve('components/CanonicalUrl.tsx')), 'components/CanonicalUrl.tsx not found');
  assert.match(src, /<CanonicalUrl\s*\/?\s*>/, 'CanonicalUrl not included in <head>');
});

test('analytics and consent wiring present in layout', () => {
  const src = read('app/layout.tsx');
  assert.match(src, /<Analytics\s*\/>/, 'Missing <Analytics />');
  assert.match(src, /<SpeedInsights\s*\/>/, 'Missing <SpeedInsights />');
  assert.ok(fs.existsSync(path.resolve('public/analytics-consent.js')), 'public/analytics-consent.js not found');
  assert.match(src, /<Script[^>]+src=(["'])\/analytics-consent\.js\1/, 'Consent script not included');
});

