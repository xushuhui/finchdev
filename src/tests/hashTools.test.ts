import test from 'node:test'
import assert from 'node:assert/strict'
import { generateHashes, md5 } from '../utils/hashTools.ts'

test('md5 hashes plain text correctly', () => {
  assert.equal(md5('hello'), '5d41402abc4b2a76b9719d911017c592')
})

test('generateHashes returns all hash variants', async () => {
  const result = await generateHashes('hello', {
    digest: async (algorithm, text) => `${algorithm}:${text}`,
    md5: () => 'custom-md5',
  })

  assert.deepEqual(result, {
    md5: 'custom-md5',
    sha1: 'SHA-1:hello',
    sha256: 'SHA-256:hello',
    sha512: 'SHA-512:hello',
  })
})
