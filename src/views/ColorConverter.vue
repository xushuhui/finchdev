<template>
  <ToolLayout :title="tool.h1">
    <template #lead>
      Convert HEX, RGB, HSL, and CMYK formats with a live preview and one-click copy actions.
    </template>

    <t-space direction="vertical" size="24px" style="width: 100%; display: flex;">
      <t-card title="Input Color" class="panel-card" hover-shadow>
        <t-row :gutter="[16, 16]" align="middle">
          <t-col :xs="12" :md="8">
            <t-input v-model="input" placeholder="Enter HEX, RGB, or HSL, for example #0ea5e9 or rgb(14, 165, 233)" />
          </t-col>
          <t-col :xs="12" :md="4">
            <label class="picker-label">
              <span>Native Picker</span>
              <input type="color" :value="pickerValue" @input="onPickColor" />
            </label>
          </t-col>
        </t-row>
      </t-card>

      <t-alert v-if="error" theme="error" variant="light-outline">{{ error }}</t-alert>
      <div class="preview-block" :style="{ background: previewColor }"></div>

      <t-row :gutter="[16, 16]">
        <t-col v-for="item in formats" :key="item.key" :xs="12" :md="6">
          <t-card :title="item.label" class="panel-card" hover-shadow>
            <t-space direction="vertical" size="12px" style="width: 100%; display: flex;">
              <div class="format-output">{{ values[item.key] || '-' }}</div>
              <t-button variant="outline" :disabled="!values[item.key]" @click="copyValue(values[item.key], `${item.label} copied`)">
                Copy
              </t-button>
            </t-space>
          </t-card>
        </t-col>
      </t-row>
    </t-space>

    <template #usage>
      <p>This color converter online helps you move quickly between design and development formats without opening a separate graphics tool. Enter a HEX, RGB, or HSL value and FinchDev instantly converts it to the other supported formats while also calculating CMYK for print-oriented reference. The live preview block lets you confirm the exact visual result, and the native browser color picker gives you a fast way to experiment with shades. This is useful when turning design tokens into CSS values, matching brand palettes, preparing color documentation, or debugging UI theming issues. Copy any output with one click and paste it directly into stylesheets, component props, design docs, or testing notes. Everything happens locally, so there is no need to send palette data to an external service.</p>
    </template>

    <template #faq>
      <t-collapse-panel header="What color formats are supported?">
        HEX, RGB, HSL, and CMYK are supported. You can input HEX, RGB, or HSL and FinchDev computes the rest.
      </t-collapse-panel>
      <t-collapse-panel header="Can I use a color picker?">
        Yes. Use the native color picker control to choose a color visually and update the conversions instantly.
      </t-collapse-panel>
    </template>
  </ToolLayout>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { MessagePlugin } from 'tdesign-vue-next'
import { useSeoHead } from '../composables/useSeoHead'
import ToolLayout from '../components/ToolLayout.vue'
import { routeMeta, toolDefinitions } from '../data/tools'
import { convertColor } from '../utils/colorTools'

const tool = toolDefinitions.find((item) => item.path === '/color-converter')
useSeoHead(routeMeta['/color-converter'])

const input = ref('#0EA5E9')
const values = ref({ hex: '', rgb: '', hsl: '', cmyk: '' })
const error = ref('')

const formats = [
  { key: 'hex', label: 'HEX' },
  { key: 'rgb', label: 'RGB' },
  { key: 'hsl', label: 'HSL' },
  { key: 'cmyk', label: 'CMYK' },
]

watch(
  input,
  (value) => {
    const result = convertColor(value)
    values.value = result
    error.value = result.error
  },
  { immediate: true },
)

const previewColor = computed(() => values.value.hex || '#E5E7EB')
const pickerValue = computed(() => values.value.hex || '#0EA5E9')

function onPickColor(event) {
  input.value = event.target.value
}

async function copyValue(value, message) {
  await navigator.clipboard.writeText(value)
  MessagePlugin.success(message)
}
</script>

<style scoped>
.panel-card {
  border-radius: var(--td-radius-extraLarge);
}

.preview-block {
  height: 120px;
  border-radius: var(--td-radius-extraLarge);
  border: 1px solid var(--td-component-border);
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.2);
}

.format-output {
  border-radius: 12px;
  background: var(--td-bg-color-page);
  padding: 12px 14px;
  font-family: var(--font-mono);
}

.picker-label {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  border-radius: 12px;
  border: 1px solid var(--td-component-border);
  padding: 10px 12px;
}

.picker-label input {
  height: 40px;
  width: 64px;
  border: 0;
  background: transparent;
}
</style>
