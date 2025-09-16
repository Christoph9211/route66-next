import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'

const readFile = (file) => {
  const resolved = path.resolve(file)
  assert.ok(fs.existsSync(resolved), 'Expected file to exist: ' + file)
  return fs.readFileSync(resolved, 'utf8')
}

test('AgeGate copy present', () => {
  const source = readFile('components/AgeGate.tsx')
  assert.match(source, /Are you 21 or older\?/i, 'AgeGate prompt missing')
})

test('AgeGate includes consent messaging', () => {
  const source = readFile('components/AgeGate.tsx')
  assert.match(source, /Manage Cookie Consent/i, 'Consent modal copy missing')
  assert.match(source, /Accept all cookies/i, 'Accept button copy missing')
  assert.match(source, /Decline non-essential/i, 'Decline button copy missing')
})

test('StructuredData component exists', () => {
  const componentPath = path.resolve('components/StructuredData.tsx')
  assert.ok(fs.existsSync(componentPath), 'components/StructuredData.tsx not found')
})
