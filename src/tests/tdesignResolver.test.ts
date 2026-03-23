import test from 'node:test'
import assert from 'node:assert/strict'

import { resolveTDesignComponent } from '../build/tdesignResolver.ts'

test('resolveTDesignComponent maps core layout and navigation components to es subpaths', () => {
  assert.deepEqual(resolveTDesignComponent('TLayout'), { name: 'Layout', from: 'tdesign-vue-next/es/layout' })
  assert.deepEqual(resolveTDesignComponent('TContent'), { name: 'Content', from: 'tdesign-vue-next/es/layout' })
  assert.deepEqual(resolveTDesignComponent('THeadMenu'), { name: 'HeadMenu', from: 'tdesign-vue-next/es/menu' })
  assert.deepEqual(resolveTDesignComponent('TMenuItem'), { name: 'MenuItem', from: 'tdesign-vue-next/es/menu' })
})

test('resolveTDesignComponent maps form and feedback components to es subpaths', () => {
  assert.deepEqual(resolveTDesignComponent('TButton'), { name: 'Button', from: 'tdesign-vue-next/es/button' })
  assert.deepEqual(resolveTDesignComponent('TTextarea'), { name: 'Textarea', from: 'tdesign-vue-next/es/textarea' })
  assert.deepEqual(resolveTDesignComponent('TSlider'), { name: 'Slider', from: 'tdesign-vue-next/es/slider' })
  assert.deepEqual(resolveTDesignComponent('TAlert'), { name: 'Alert', from: 'tdesign-vue-next/es/alert' })
})

test('resolveTDesignComponent keeps grouped components on shared module entries', () => {
  assert.deepEqual(resolveTDesignComponent('TRow'), { name: 'Row', from: 'tdesign-vue-next/es/grid' })
  assert.deepEqual(resolveTDesignComponent('TCol'), { name: 'Col', from: 'tdesign-vue-next/es/grid' })
  assert.deepEqual(resolveTDesignComponent('TCollapsePanel'), { name: 'CollapsePanel', from: 'tdesign-vue-next/es/collapse' })
})

test('resolveTDesignComponent ignores unknown or non-TDesign names', () => {
  assert.equal(resolveTDesignComponent('RouterLink'), undefined)
  assert.equal(resolveTDesignComponent('TImaginaryWidget'), undefined)
})
