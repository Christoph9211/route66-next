import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'

const readFile = (file) => {
  const resolved = path.resolve(file)
  assert.ok(fs.existsSync(resolved), 'Expected file to exist: ' + file)
  return fs.readFileSync(resolved, 'utf8')
}

test('layout exports metadata with title and description', () => {
  const source = readFile('app/layout.tsx')
  assert.match(source, /export\s+const\s+metadata\s*:/, 'Missing export const metadata')
  assert.match(source, /title\s*:/, 'Missing title in metadata')
  assert.match(source, /description\s*:/, 'Missing description in metadata')
})

test('layout has html lang attribute and canonical link', () => {
  const source = readFile('app/layout.tsx')
  assert.match(source, /<html\s+lang=(["'])\w+\1/, 'Missing <html lang="…">')
  assert.ok(fs.existsSync(path.resolve('components/CanonicalUrl.tsx')), 'components/CanonicalUrl.tsx not found')
  assert.match(source, /<CanonicalUrl\s*\/?\s*>/, 'CanonicalUrl not included in <head>')
})

test('consent gating wiring present in layout', () => {
  const source = readFile('app/layout.tsx')
  assert.match(source, /<AgeGate\s*\/?\s*>/, 'Missing <AgeGate />')
  assert.match(source, /<AnalyticsConsentGate\s*\/?\s*>/, 'Missing <AnalyticsConsentGate />')
  assert.ok(fs.existsSync(path.resolve('public/analytics-consent.js')), 'public/analytics-consent.js not found')
  assert.match(source, /<Script[^>]+src=(["'])\/analytics-consent\.js\1/, 'Consent script not included')
})
