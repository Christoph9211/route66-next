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

test('products.json has valid structure and values', () => {
  const data = readJSON('public/products/products.json');
  assert.ok(Array.isArray(data), 'products.json must be an array');
  assert.ok(data.length > 0, 'products.json should not be empty');

  const names = new Set();
  for (const [i, item] of data.entries()) {
    assert.equal(typeof item, 'object', `Item #${i} must be an object`);
    assert.equal(typeof item.name, 'string', `Item #${i} missing string name`);
    assert.ok(item.name.trim().length > 0, `Item #${i} name empty`);
    const nameKey = item.name.trim().toLowerCase();
    assert.ok(!names.has(nameKey), `Duplicate product name: ${item.name}`);
    names.add(nameKey);

    assert.equal(typeof item.category, 'string', `Item #${i} missing string category`);

    assert.ok(Array.isArray(item.size_options), `Item #${i} size_options must be array`);
    assert.ok(item.size_options.length > 0, `Item #${i} size_options cannot be empty`);
    for (const opt of item.size_options) {
      assert.equal(typeof opt, 'string', `Item #${i} size option must be string`);
    }

    assert.ok(item.prices && typeof item.prices === 'object', `Item #${i} prices must be object`);
    const priceKeys = Object.keys(item.prices);
    assert.ok(priceKeys.length > 0, `Item #${i} prices cannot be empty`);
    for (const k of priceKeys) {
      const v = item.prices[k];
      assert.equal(typeof v, 'number', `Item #${i} price for ${k} must be number`);
      assert.ok(v >= 0, `Item #${i} price for ${k} must be >= 0`);
    }

    if (item.thca_percentage !== undefined) {
      assert.equal(typeof item.thca_percentage, 'number', `Item #${i} thca_percentage must be number when present`);
      assert.ok(item.thca_percentage >= 0, `Item #${i} thca_percentage must be >= 0`);
    }

    if (item.banner !== undefined) {
      assert.equal(typeof item.banner, 'string', `Item #${i} banner must be string when present`);
    }

    if (item.availability !== undefined) {
      assert.equal(typeof item.availability, 'object', `Item #${i} availability must be object when present`);
    }
  }
});

