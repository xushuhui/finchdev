import test from 'node:test'
import assert from 'node:assert/strict'
import { dateToTimestamp, timestampToDate } from '../utils/timestampTools.ts'

test('timestampToDate supports seconds input', () => {
  const result = timestampToDate('1710902400')
  assert.equal(result.error, '')
  assert.match(result.utc, /^\d{4}-\d{2}-\d{2}T/)
})

test('timestampToDate reports invalid timestamp', () => {
  const result = timestampToDate('abc')
  assert.notEqual(result.error, '')
})

test('dateToTimestamp converts datetime-local', () => {
  const result = dateToTimestamp('2024-03-20T00:00')
  assert.equal(result.error, '')
  assert.equal(Number.isFinite(Number(result.seconds)), true)
  assert.equal(Number.isFinite(Number(result.milliseconds)), true)
})
