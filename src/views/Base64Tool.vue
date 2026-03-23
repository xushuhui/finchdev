<template>
  <ToolLayout :title="tool.h1">
    <template #lead>
      Encode plain text to Base64 or decode Base64 to readable text instantly.
    </template>

    <t-space direction="vertical" size="24px" style="width: 100%; display: flex;">
      <t-row :gutter="[16, 16]">
        <t-col :xs="12" :lg="6">
          <t-card title="Input" class="panel-card" hover-shadow>
            <t-textarea
              v-model="input"
              placeholder="Enter text or Base64 here..."
              :autosize="{ minRows: 15, maxRows: 25 }"
            />
          </t-card>
        </t-col>
        <t-col :xs="12" :lg="6">
          <t-card title="Output" class="panel-card" hover-shadow>
            <t-textarea
              :value="output"
              readonly
              placeholder="Result will appear here..."
              :autosize="{ minRows: 15, maxRows: 25 }"
            />
          </t-card>
        </t-col>
      </t-row>

      <t-space wrap size="12px">
        <t-button theme="primary" @click="onEncode">
          <template #icon><swap-icon /></template>
          Encode Base64
        </t-button>
        <t-button variant="outline" @click="onDecode">
          <template #icon><swap-icon /></template>
          Decode Base64
        </t-button>
        <t-button variant="outline" @click="onCopy" :disabled="!output">Copy Result</t-button>
        <t-button variant="text" @click="onClear">
          <template #icon><delete-icon /></template>
          Clear
        </t-button>
      </t-space>

      <t-alert v-if="error" theme="error" variant="light-outline">{{ error }}</t-alert>
      <t-alert v-else-if="output" theme="success" variant="light-outline">Base64 conversion completed.</t-alert>
    </t-space>

    <template #usage>
      <p>Use this Base64 encode and decode online tool when you need to safely transform text for transport through APIs, headers, or compact config payloads. Paste plain text and click Encode to generate a Base64 string. Paste a Base64 string and click Decode to recover the original content.</p>
    </template>

    <template #faq>
      <t-collapse-panel header="Is Base64 encryption?">
        No. Base64 is an encoding format, not encryption. It is designed to represent binary data in an ASCII string format. Anyone can easily decode it.
      </t-collapse-panel>
    </template>
  </ToolLayout>
</template>

<script setup lang="ts">
import { useSeoHead } from '../composables/useSeoHead'
import { ref } from 'vue'
import { MessagePlugin } from 'tdesign-vue-next'
import { SwapIcon, DeleteIcon } from 'tdesign-icons-vue-next'
import ToolLayout from '../components/ToolLayout.vue'
import { getRouteMeta, getToolDefinition } from '../data/tools'
import { decodeBase64, encodeBase64 } from '../utils/base64Tools'

const tool = getToolDefinition('/base64')
useSeoHead(getRouteMeta('/base64'))
const input = ref('')
const output = ref('')
const error = ref('')

function onEncode() {
  const result = encodeBase64(input.value)
  output.value = result.output
  error.value = result.error
  if (!result.error && input.value) {
    MessagePlugin.success('Base64 encoded successfully')
  }
}

function onDecode() {
  const result = decodeBase64(input.value)
  output.value = result.output
  error.value = result.error
  if (!result.error && input.value) {
    MessagePlugin.success('Base64 decoded successfully')
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
