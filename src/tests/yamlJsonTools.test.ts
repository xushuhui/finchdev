import test from 'node:test'
import assert from 'node:assert/strict'
import { jsonToYaml, yamlToJson } from '../utils/yamlJsonTools.ts'

test('yamlToJson converts yaml into formatted json', () => {
  const result = yamlToJson('name: finch\ncount: 2')
  assert.equal(result.error, '')
  assert.match(result.output, /"name": "finch"/)
})

test('jsonToYaml converts json into yaml', () => {
  const result = jsonToYaml('{"name":"finch","count":2}')
  assert.equal(result.error, '')
  assert.match(result.output, /name: finch/)
})

test('yamlToJson reports invalid yaml', () => {
  const result = yamlToJson('name: [')
  assert.notEqual(result.error, '')
})
