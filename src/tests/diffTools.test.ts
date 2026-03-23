import test from 'node:test'
import assert from 'node:assert/strict'
import { buildDiffSummary, createLineDiff, type DiffPart } from '../utils/diffTools.ts'

test('createLineDiff marks additions and removals', () => {
  const parts = createLineDiff('a\nb', 'a\nc', () => [
    { added: false, removed: false, count: 1, value: 'a\n' },
    { added: false, removed: true, count: 1, value: 'b\n' },
    { added: true, removed: false, count: 1, value: 'c\n' },
  ] as DiffPart[])

  assert.equal(parts[1]?.removed, true)
  assert.equal(parts[2]?.added, true)
})

test('buildDiffSummary counts changes', () => {
  const summary = buildDiffSummary([
    { added: false, removed: false, count: 1, value: 'a\n' },
    { added: false, removed: true, count: 1, value: 'b\n' },
    { added: true, removed: false, count: 1, value: 'c\n' },
  ])
  assert.equal(summary.added, 1)
  assert.equal(summary.removed, 1)
})
