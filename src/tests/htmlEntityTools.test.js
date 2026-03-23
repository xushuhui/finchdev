import test from 'node:test'
import assert from 'node:assert/strict'
import { decodeHtmlEntities, encodeHtmlEntities } from '../utils/htmlEntityTools.js'

test('encodeHtmlEntities encodes reserved characters', () => {
  const result = encodeHtmlEntities('<div class="x">&</div>')
  assert.equal(result, '&lt;div class=&quot;x&quot;&gt;&amp;&lt;/div&gt;')
})

test('decodeHtmlEntities decodes numeric and named entities', () => {
  const result = decodeHtmlEntities('&lt;span&gt;&#39;Hi&#39;&lt;/span&gt;')
  assert.equal(result, '<span>\'Hi\'</span>')
})
