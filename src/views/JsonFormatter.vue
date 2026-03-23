<template>
  <ToolLayout :title="tool.h1">
    <template #lead>
      Paste JSON and format or minify it instantly. All processing happens locally in your browser.
    </template>

    <t-row :gutter="[24, 24]">
      <t-col :xs="12" :md="6">
        <t-space direction="vertical" style="width: 100%;">
          <label style="font-size: 14px; font-weight: bold;">Input JSON</label>
          <t-textarea
            v-model="input"
            placeholder="Paste your JSON here..."
            :autosize="{ minRows: 15, maxRows: 25 }"
          />
        </t-space>
      </t-col>
      <t-col :xs="12" :md="6">
        <t-space direction="vertical" style="width: 100%;">
          <label style="font-size: 14px; font-weight: bold;">Output</label>
          <t-textarea
            :value="output"
            readonly
            placeholder="Formatted output will appear here..."
            :autosize="{ minRows: 15, maxRows: 25 }"
          />
        </t-space>
      </t-col>
    </t-row>

    <t-space style="margin-top: 32px;" size="16px">
      <t-button theme="primary" @click="onFormat">Format JSON</t-button>
      <t-button theme="default" variant="base" @click="onMinify">Minify JSON</t-button>
      <t-button theme="default" variant="outline" @click="onClear">Clear</t-button>
      <t-button theme="default" variant="outline" @click="onCopy">Copy Result</t-button>
    </t-space>

    <t-alert v-if="error" theme="error" style="margin-top: 24px;">
      {{ error }}
    </t-alert>

    <template #usage>
      <p>The JSON Formatter helps you clean up unreadable payloads, validate syntax before API calls, and inspect deeply nested objects quickly. Paste raw JSON in the input panel and click Format to generate a consistent, indented output that is easy to read and debug.</p>
    </template>

    <template #faq>
      <t-collapse-panel header="Does this tool send my JSON to a server?">
        No. Parsing and formatting are done in your browser only using JavaScript. Your data never leaves your device.
      </t-collapse-panel>
      <t-collapse-panel header="What is the difference between format and minify?">
        Format adds indentation (4 spaces) and line breaks for readability. Minify removes all unnecessary whitespace for compact output, reducing payload size.
      </t-collapse-panel>
    </template>
  </ToolLayout>
</template>

<script setup>
import { useSeoHead } from '../composables/useSeoHead'
import { ref } from 'vue'
import { MessagePlugin } from 'tdesign-vue-next'
import ToolLayout from '../components/ToolLayout.vue'
import { toolDefinitions, routeMeta } from '../data/tools'
import { formatJson, minifyJson } from '../utils/jsonTools'

const tool = toolDefinitions.find((item) => item.path === '/json-formatter')
useSeoHead(routeMeta['/json-formatter'])
const input = ref('')
const output = ref('')
const error = ref('')

function onFormat() {
  const result = formatJson(input.value)
  output.value = result.output
  error.value = result.error
  if (!result.error && input.value) {
    MessagePlugin.success('JSON Formatted Successfully')
  }
}

function onMinify() {
  const result = minifyJson(input.value)
  output.value = result.output
  error.value = result.error
  if (!result.error && input.value) {
    MessagePlugin.success('JSON Minified Successfully')
  }
}

function onClear() {
  input.value = ''
  output.value = ''
  error.value = ''
}

function onCopy() {
  if (!output.value) return
  navigator.clipboard.writeText(output.value)
  MessagePlugin.success('Copied to clipboard')
}
</script>
