import test from 'node:test'
import assert from 'node:assert/strict'
import { formatJson, minifyJson } from '../utils/jsonTools.ts'

test('formatJson formats valid json', () => {
  const result = formatJson('{"a":1}')
  assert.equal(result.error, '')
  assert.match(result.output, /\n  "a": 1\n/)
})

test('formatJson returns error for invalid json', () => {
  const result = formatJson('{')
  assert.equal(typeof result.error, 'string')
  assert.equal(result.output, '')
})

test('minifyJson minifies valid json', () => {
  const result = minifyJson('{"a": 1, "b": 2}')
  assert.equal(result.error, '')
  assert.equal(result.output, '{"a":1,"b":2}')
})
