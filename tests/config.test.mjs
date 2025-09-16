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

test('package.json has expected scripts and deps', () => {
  const pkg = readJSON('package.json')
  const scripts = pkg.scripts || {}
  for (const scriptName of ['dev', 'build', 'start', 'test']) {
    assert.ok(scripts[scriptName], 'Missing script: ' + scriptName)
  }

  const deps = pkg.dependencies || {}
  assert.ok(deps.next, 'Missing dependency: next')
  assert.ok(deps.react, 'Missing dependency: react')
  assert.ok(deps['react-dom'], 'Missing dependency: react-dom')

  const devDeps = pkg.devDependencies || {}
  assert.ok(devDeps.typescript, 'Missing devDependency: typescript')
})

test('tsconfig is strict and has path alias', () => {
  const tsconfig = readJSON('tsconfig.json')
  const compilerOptions = tsconfig.compilerOptions || {}
  assert.equal(compilerOptions.strict, true, 'TypeScript strict mode should be enabled')
  assert.ok(compilerOptions.paths && compilerOptions.paths['@/*'], 'Expected tsconfig.paths["@/*"]')
})

test('eslint config exists', () => {
  const configPath = path.resolve('eslint.config.mjs')
  assert.ok(fs.existsSync(configPath), 'eslint.config.mjs not found')
})
