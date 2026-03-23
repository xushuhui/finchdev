import test from 'node:test'
import assert from 'node:assert/strict'
import { DEFAULT_MARKDOWN, renderMarkdown } from '../utils/markdownTools.ts'

test('renderMarkdown uses parser and sanitizer', () => {
  const result = renderMarkdown('# Title', {
    parseMarkdown: (value) => `<h1>${value}</h1><script>bad()</script>`,
    sanitizeHtml: (value) => value.replace('<script>bad()</script>', ''),
  })
  assert.equal(result, '<h1># Title</h1>')
})

test('DEFAULT_MARKDOWN provides sample content', () => {
  assert.match(DEFAULT_MARKDOWN, /^# /)
})
