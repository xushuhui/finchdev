import test from 'node:test'
import assert from 'node:assert/strict'
import { buildDiffSummary, createLineDiff } from '../utils/diffTools.js'

test('createLineDiff marks additions and removals', () => {
  const parts = createLineDiff('a\nb', 'a\nc', (left, right) => [
    { value: 'a\n' },
    { removed: true, value: 'b\n' },
    { added: true, value: 'c\n' },
  ])
  assert.equal(parts[1].removed, true)
  assert.equal(parts[2].added, true)
})

test('buildDiffSummary counts changes', () => {
  const summary = buildDiffSummary([
    { value: 'a\n' },
    { removed: true, value: 'b\n' },
    { added: true, value: 'c\n' },
  ])
  assert.equal(summary.added, 1)
  assert.equal(summary.removed, 1)
})
