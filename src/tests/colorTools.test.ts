import test from 'node:test'
import assert from 'node:assert/strict'
import { convertColor } from '../utils/colorTools.ts'

test('convertColor converts hex to all formats', () => {
  const result = convertColor('#ff0000')
  assert.equal(result.error, '')
  assert.equal(result.hex, '#FF0000')
  assert.equal(result.rgb, 'rgb(255, 0, 0)')
  assert.equal(result.hsl, 'hsl(0, 100%, 50%)')
  assert.equal(result.cmyk, 'cmyk(0%, 100%, 100%, 0%)')
})

test('convertColor accepts rgb input', () => {
  const result = convertColor('rgb(0, 128, 255)')
  assert.equal(result.error, '')
  assert.equal(result.hex, '#0080FF')
})

test('convertColor rejects invalid input', () => {
  const result = convertColor('not-a-color')
  assert.notEqual(result.error, '')
})
