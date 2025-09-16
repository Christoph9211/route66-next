import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'

const exists = (p) => fs.existsSync(path.resolve(p))

test('essential public assets exist', () => {
  const assets = [
    'public/favicon.ico',
    'public/favicon-16x16.png',
    'public/favicon-32x32.png',
    'public/apple-touch-icon.png',
    'public/android-chrome-192x192.png',
    'public/android-chrome-512x512.png',
    'public/site.webmanifest',
    'public/robots.txt',
    'public/sitemap.xml',
  ]
  const missing = assets.filter((asset) => !exists(asset))
  assert.equal(missing.length, 0, 'Missing assets: ' + missing.join(', '))
})
