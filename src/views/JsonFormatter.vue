<template>
  <ToolLayout :title="tool.h1">
    <template #lead>
      Paste JSON and format or minify it instantly. All processing happens locally in your browser.
    </template>

    <t-space direction="vertical" size="24px" style="width: 100%; display: flex;">
      <t-row :gutter="[16, 16]">
        <t-col :xs="12" :lg="6">
          <t-card title="Input JSON" class="panel-card" hover-shadow>
            <t-textarea
              v-model="input"
              placeholder="Paste your JSON here..."
              :autosize="{ minRows: 15, maxRows: 25 }"
            />
          </t-card>
        </t-col>
        <t-col :xs="12" :lg="6">
          <t-card title="Output" class="panel-card" hover-shadow>
            <t-textarea
              :value="output"
              readonly
              placeholder="Formatted output will appear here..."
              :autosize="{ minRows: 15, maxRows: 25 }"
            />
          </t-card>
        </t-col>
      </t-row>

      <t-space wrap size="12px">
        <t-button theme="primary" @click="onFormat">Format JSON</t-button>
        <t-button variant="outline" @click="onMinify">Minify JSON</t-button>
        <t-button variant="outline" @click="onCopy" :disabled="!output">Copy Result</t-button>
        <t-button variant="text" @click="onClear">Clear</t-button>
      </t-space>

      <t-alert v-if="error" theme="error" variant="light-outline">{{ error }}</t-alert>
      <t-alert v-else-if="output" theme="success" variant="light-outline">JSON processed successfully.</t-alert>
    </t-space>

    <template #usage>
      <p>The JSON Formatter helps you clean up unreadable payloads, validate syntax before API calls, and inspect deeply nested objects quickly. Paste raw JSON in the input panel and click Format to generate a consistent, indented output that is easy to read and debug.</p>
    </template>

    <template #faq>
      <t-collapse-panel header="Does this tool send my JSON to a server?">
        No. Parsing and formatting are done in your browser only using JavaScript. Your data never leaves your device.
      </t-collapse-panel>
      <t-collapse-panel header="What is the difference between format and minify?">
        Format adds indentation and line breaks for readability. Minify removes unnecessary whitespace for compact output.
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
    MessagePlugin.success('JSON formatted successfully')
  }
}

function onMinify() {
  const result = minifyJson(input.value)
  output.value = result.output
  error.value = result.error
  if (!result.error && input.value) {
    MessagePlugin.success('JSON minified successfully')
  }
}

function onClear() {
  input.value = ''
  output.value = ''
  error.value = ''
}

async function onCopy() {
  if (!output.value) return
  await navigator.clipboard.writeText(output.value)
  MessagePlugin.success('Copied to clipboard')
}
</script>

<style scoped>
.panel-card {
  border-radius: var(--td-radius-extraLarge);
}
</style>
