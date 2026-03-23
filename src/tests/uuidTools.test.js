import test from 'node:test'
import assert from 'node:assert/strict'
import { generateUuid, generateUuidBatch } from '../utils/uuidTools.js'

const fixedBytes = new Uint8Array([0x12, 0x34, 0x56, 0x78, 0x9a, 0xbc, 0xde, 0xf0, 0x11, 0x22, 0x33, 0x44, 0x55, 0x66, 0x77, 0x88])

test('generateUuid creates lowercase uuid with hyphens', () => {
  const uuid = generateUuid({}, () => fixedBytes)
  assert.equal(uuid, '12345678-9abc-4ef0-9122-334455667788')
})

test('generateUuid supports uppercase compact format', () => {
  const uuid = generateUuid({ uppercase: true, hyphenated: false }, () => fixedBytes)
  assert.equal(uuid, '123456789ABC4EF09122334455667788')
})

test('generateUuidBatch generates requested amount', () => {
  const list = generateUuidBatch(3, {}, () => fixedBytes)
  assert.equal(list.length, 3)
  assert.equal(list[0], '12345678-9abc-4ef0-9122-334455667788')
})
