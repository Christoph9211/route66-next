const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

function read(file) {
  const p = path.resolve(file);
  assert.ok(fs.existsSync(p), `Expected file to exist: ${file}`);
  return fs.readFileSync(p, 'utf8');
}

test('AgeGate copy present', () => {
  const src = read('components/AgeGate.tsx');
  assert.match(src, /Are you 21 or older\?/i, 'AgeGate prompt missing');
});

test('CookieBanner copy present with actions', () => {
  const src = read('components/CookieBanner.tsx');
  assert.match(src, /We use cookies/i, 'Cookie banner text missing');
  assert.match(src, />\s*Accept\s*<\/button>/i, 'Cookie banner Accept button missing');
  assert.match(src, />\s*Decline\s*<\/button>/i, 'Cookie banner Decline button missing');
});

test('StructuredData component exists', () => {
  const p = path.resolve('components/StructuredData.tsx');
  assert.ok(fs.existsSync(p), 'components/StructuredData.tsx not found');
});

