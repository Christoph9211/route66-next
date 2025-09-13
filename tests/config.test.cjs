const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

function readJSON(file) {
  const p = path.resolve(file);
  assert.ok(fs.existsSync(p), `Expected JSON file to exist: ${file}`);
  const raw = fs.readFileSync(p, 'utf8');
  try {
    return JSON.parse(raw);
  } catch (e) {
    assert.fail(`Invalid JSON in ${file}: ${e.message}`);
  }
}

test('package.json has expected scripts and deps', () => {
  const pkg = readJSON('package.json');
  const scripts = pkg.scripts || {};
  for (const s of ['dev', 'build', 'start', 'test']) {
    assert.ok(scripts[s], `Missing script: ${s}`);
  }

  const deps = pkg.dependencies || {};
  assert.ok(deps.next, 'Missing dependency: next');
  assert.ok(deps.react, 'Missing dependency: react');
  assert.ok(deps['react-dom'], 'Missing dependency: react-dom');

  const devDeps = pkg.devDependencies || {};
  assert.ok(devDeps.typescript, 'Missing devDependency: typescript');
});

test('tsconfig is strict and has path alias', () => {
  const ts = readJSON('tsconfig.json');
  const co = ts.compilerOptions || {};
  assert.equal(co.strict, true, 'TypeScript strict mode should be enabled');
  assert.ok(co.paths && co.paths['@/*'], 'Expected tsconfig.paths["@/*"]');
});

test('eslint config exists', () => {
  const p = path.resolve('eslint.config.mjs');
  assert.ok(fs.existsSync(p), 'eslint.config.mjs not found');
});

