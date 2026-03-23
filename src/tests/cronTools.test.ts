import test from 'node:test'
import assert from 'node:assert/strict'
import { buildCronExpression, describeCronExpression } from '../utils/cronTools.ts'

test('buildCronExpression joins schedule parts', () => {
  const result = buildCronExpression({ minute: '0', hour: '12', dayOfMonth: '*', month: '*', dayOfWeek: '1-5' })
  assert.equal(result, '0 12 * * 1-5')
})

test('describeCronExpression explains simple daily cron', () => {
  const result = describeCronExpression('0 9 * * *')
  assert.match(result, /Every day/)
  assert.match(result, /09:00/)
})

test('describeCronExpression rejects invalid cron', () => {
  const result = describeCronExpression('* * *')
  assert.match(result, /Invalid/)
})
