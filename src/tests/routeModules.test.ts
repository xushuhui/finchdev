import test from 'node:test'
import assert from 'node:assert/strict'

import { homeRouteModule, toolRouteModules } from '../router/routeModules.ts'

test('homeRouteModule stays synchronously loaded for the landing page', () => {
  assert.equal(homeRouteModule.name, 'home')
  assert.equal(homeRouteModule.path, '/')
  assert.equal(homeRouteModule.importMode, 'sync')
  assert.match(homeRouteModule.file, /Home\.vue$/)
})

test('toolRouteModules are all lazy-loaded route definitions', () => {
  assert.equal(toolRouteModules.length, 15)
  assert.ok(toolRouteModules.every((route) => route.importMode === 'async'))
  assert.ok(toolRouteModules.every((route) => route.path.startsWith('/')))
  assert.ok(toolRouteModules.every((route) => route.file.endsWith('.vue')))
})

test('toolRouteModules keep markdown and qr pages behind async loading', () => {
  const markdown = toolRouteModules.find((route) => route.name === 'markdown-preview')
  const qrCode = toolRouteModules.find((route) => route.name === 'qr-code-generator')

  assert.equal(markdown?.file, '../views/MarkdownPreview.vue')
  assert.equal(qrCode?.file, '../views/QrCodeGenerator.vue')
})
