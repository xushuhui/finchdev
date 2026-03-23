import test from 'node:test'
import assert from 'node:assert/strict'

import { getManualChunkName } from '../build/chunking.ts'

test('getManualChunkName groups vue runtime into vue-core chunk', () => {
  assert.equal(getManualChunkName('/workspace/node_modules/vue/dist/vue.runtime.esm-bundler.js'), 'vue-core')
  assert.equal(getManualChunkName('/workspace/node_modules/vue-router/dist/index.mjs'), 'vue-core')
})

test('getManualChunkName groups tdesign packages into tdesign chunk', () => {
  assert.equal(getManualChunkName('/workspace/node_modules/tdesign-vue-next/es/button/index.js'), 'tdesign')
  assert.equal(getManualChunkName('/workspace/node_modules/tdesign-icons-vue-next/es/index.js'), 'tdesign')
})

test('getManualChunkName groups heavy tool libraries separately', () => {
  assert.equal(getManualChunkName('/workspace/node_modules/marked/lib/marked.esm.js'), 'markdown-stack')
  assert.equal(getManualChunkName('/workspace/node_modules/dompurify/dist/purify.es.mjs'), 'markdown-stack')
  assert.equal(getManualChunkName('/workspace/node_modules/qrcode/lib/browser.js'), 'tool-libs')
  assert.equal(getManualChunkName('/workspace/node_modules/js-yaml/dist/js-yaml.mjs'), 'tool-libs')
  assert.equal(getManualChunkName('/workspace/node_modules/diff/lib/index.es6.js'), 'tool-libs')
})

test('getManualChunkName leaves unrelated modules untouched', () => {
  assert.equal(getManualChunkName('/workspace/src/views/Home.vue'), undefined)
  assert.equal(getManualChunkName('/workspace/node_modules/nanoid/index.js'), undefined)
})
