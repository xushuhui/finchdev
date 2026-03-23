import test from 'node:test'
import assert from 'node:assert/strict'
import { createQrCode, normalizeQrOptions } from '../utils/qrTools.js'

test('normalizeQrOptions clamps width and margin', () => {
  const result = normalizeQrOptions({ width: 9999, margin: -1 })
  assert.equal(result.width, 1024)
  assert.equal(result.margin, 0)
})

test('createQrCode delegates to generator', async () => {
  const result = await createQrCode('hello', { width: 200 }, async (value, options) => `${value}:${options.width}`)
  assert.equal(result, 'hello:200')
})
