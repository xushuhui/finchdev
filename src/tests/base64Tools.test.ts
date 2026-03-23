import test from 'node:test'
import assert from 'node:assert/strict'
import { decodeBase64, encodeBase64 } from '../utils/base64Tools.ts'

test('encodeBase64 encodes utf8 text', () => {
  const result = encodeBase64('hello')
  assert.equal(result.error, '')
  assert.equal(result.output, 'aGVsbG8=')
})

test('decodeBase64 decodes valid base64', () => {
  const result = decodeBase64('aGVsbG8=')
  assert.equal(result.error, '')
  assert.equal(result.output, 'hello')
})

test('decodeBase64 reports invalid base64', () => {
  const result = decodeBase64('%$#')
  assert.notEqual(result.error, '')
})
