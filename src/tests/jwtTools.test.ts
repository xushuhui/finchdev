import test from 'node:test'
import assert from 'node:assert/strict'
import { decodeJwt } from '../utils/jwtTools.ts'

const validToken = [
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
  'eyJzdWIiOiIxMjMiLCJleHAiOjQxMDAwMDAwMDB9',
  'c2lnbmF0dXJl',
].join('.')

test('decodeJwt decodes header payload and signature', () => {
  const result = decodeJwt(validToken, 1700000000)
  assert.equal(result.error, '')
  assert.equal(result.header?.alg, 'HS256')
  assert.equal(result.payload?.sub, '123')
  assert.equal(result.signatureHex, '7369676e6174757265')
  assert.equal(result.isExpired, false)
})

test('decodeJwt marks expired tokens', () => {
  const token = [
    'eyJhbGciOiJIUzI1NiJ9',
    'eyJleHAiOjEwMH0',
    'c2ln',
  ].join('.')
  const result = decodeJwt(token, 101)
  assert.equal(result.isExpired, true)
})

test('decodeJwt rejects invalid token shape', () => {
  const result = decodeJwt('abc.def', 0)
  assert.notEqual(result.error, '')
})
