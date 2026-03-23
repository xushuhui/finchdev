<template>
  <ToolLayout :title="tool.h1">
    <template #lead>
      Encode plain text to Base64 or decode Base64 to readable text instantly.
    </template>

    <t-row :gutter="[24, 24]">
      <t-col :xs="12" :md="6">
        <t-space direction="vertical" style="width: 100%;">
          <label style="font-size: 14px; font-weight: bold;">Input</label>
          <t-textarea
            v-model="input"
            placeholder="Enter text or Base64 here..."
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
            placeholder="Result will appear here..."
            :autosize="{ minRows: 15, maxRows: 25 }"
          />
        </t-space>
      </t-col>
    </t-row>

    <t-space style="margin-top: 32px;" size="16px">
      <t-button theme="primary" @click="onEncode">
        <template #icon><swap-icon /></template>
        Encode Base64
      </t-button>
      <t-button theme="default" variant="base" @click="onDecode">
        <template #icon><swap-icon /></template>
        Decode Base64
      </t-button>
      <t-button theme="default" variant="outline" @click="onClear">
        <template #icon><delete-icon /></template>
        Clear
      </t-button>
    </t-space>

    <t-alert v-if="error" theme="error" style="margin-top: 24px;">
      {{ error }}
    </t-alert>

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

<script setup>
import { useHead } from '@unhead/vue'
import { ref } from 'vue'
import { MessagePlugin } from 'tdesign-vue-next'
import { SwapIcon, DeleteIcon } from 'tdesign-icons-vue-next'
import ToolLayout from '../components/ToolLayout.vue'
import { toolDefinitions } from '../data/tools'
import { decodeBase64, encodeBase64 } from '../utils/base64Tools'

const tool = toolDefinitions.find((item) => item.path === '/base64')
useHead({
  title: tool.title,
  meta: [{ name: 'description', content: tool.description }],
})
const input = ref('')
const output = ref('')
const error = ref('')

function onEncode() {
  const result = encodeBase64(input.value)
  output.value = result.output
  error.value = result.error
  if (!result.error && input.value) {
    MessagePlugin.success('Encoded Successfully')
  }
}

function onDecode() {
  const result = decodeBase64(input.value)
  output.value = result.output
  error.value = result.error
  if (!result.error && input.value) {
    MessagePlugin.success('Decoded Successfully')
  }
}

function onClear() {
  input.value = ''
  output.value = ''
  error.value = ''
}
</script>
