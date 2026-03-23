import test from 'node:test'
import assert from 'node:assert/strict'
import { decodeUrl, encodeUrl } from '../utils/urlTools.js'

test('encodeUrl encodes reserved chars', () => {
  const result = encodeUrl('a b&c')
  assert.equal(result.error, '')
  assert.equal(result.output, 'a%20b%26c')
})

test('decodeUrl decodes valid encoded input', () => {
  const result = decodeUrl('a%20b%26c')
  assert.equal(result.error, '')
  assert.equal(result.output, 'a b&c')
})

test('decodeUrl reports invalid encoded input', () => {
  const result = decodeUrl('%E0%A4%A')
  assert.notEqual(result.error, '')
})
