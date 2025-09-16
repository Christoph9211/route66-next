import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'

const readJSON = (file) => {
  const resolved = path.resolve(file)
  assert.ok(fs.existsSync(resolved), 'Expected JSON file to exist: ' + file)
  const raw = fs.readFileSync(resolved, 'utf8')
  try {
    return JSON.parse(raw)
  } catch (error) {
    assert.fail('Invalid JSON in ' + file + ': ' + error.message)
  }
}

test('products.json has valid structure and values', () => {
  const data = readJSON('public/products/products.json')
  assert.ok(Array.isArray(data), 'products.json must be an array')
  assert.ok(data.length > 0, 'products.json should not be empty')

  const names = new Set()
  for (const [index, item] of data.entries()) {
    assert.equal(typeof item, 'object', 'Item #' + index + ' must be an object')
    assert.equal(typeof item.name, 'string', 'Item #' + index + ' missing string name')
    assert.ok(item.name.trim().length > 0, 'Item #' + index + ' name empty')
    const nameKey = item.name.trim().toLowerCase()
    assert.ok(!names.has(nameKey), 'Duplicate product name: ' + item.name)
    names.add(nameKey)

    assert.equal(typeof item.category, 'string', 'Item #' + index + ' missing string category')

    assert.ok(Array.isArray(item.size_options), 'Item #' + index + ' size_options must be array')
    assert.ok(item.size_options.length > 0, 'Item #' + index + ' size_options cannot be empty')
    for (const option of item.size_options) {
      assert.equal(typeof option, 'string', 'Item #' + index + ' size option must be string')
    }

    assert.ok(item.prices && typeof item.prices === 'object', 'Item #' + index + ' prices must be object')
    const priceKeys = Object.keys(item.prices)
    assert.ok(priceKeys.length > 0, 'Item #' + index + ' prices cannot be empty')
    for (const key of priceKeys) {
      const value = item.prices[key]
      assert.equal(typeof value, 'number', 'Item #' + index + ' price for ' + key + ' must be number')
      assert.ok(value >= 0, 'Item #' + index + ' price for ' + key + ' must be >= 0')
    }

    if (item.thca_percentage !== undefined) {
      assert.equal(typeof item.thca_percentage, 'number', 'Item #' + index + ' thca_percentage must be number when present')
      assert.ok(item.thca_percentage >= 0, 'Item #' + index + ' thca_percentage must be >= 0')
    }

    if (item.banner !== undefined) {
      assert.equal(typeof item.banner, 'string', 'Item #' + index + ' banner must be string when present')
    }

    if (item.availability !== undefined) {
      assert.equal(typeof item.availability, 'object', 'Item #' + index + ' availability must be object when present')
    }
  }
})
