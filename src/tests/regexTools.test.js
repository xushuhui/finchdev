import test from 'node:test'
import assert from 'node:assert/strict'
import { testRegex } from '../utils/regexTools.js'

test('testRegex returns all matches', () => {
  const result = testRegex('foo', 'g', 'foo bar foo')
  assert.equal(result.error, '')
  assert.equal(result.matches.length, 2)
  assert.equal(result.matches[1].index, 8)
})

test('testRegex reports invalid pattern', () => {
  const result = testRegex('(', 'g', 'abc')
  assert.notEqual(result.error, '')
  assert.equal(result.matches.length, 0)
})
