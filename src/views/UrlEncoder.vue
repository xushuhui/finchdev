<template>
  <ToolLayout :title="tool.h1">
    <template #lead>
      Encode URL components safely or decode encoded text for debugging.
    </template>

    <t-row :gutter="[24, 24]">
      <t-col :xs="12" :md="6">
        <t-space direction="vertical" style="width: 100%;">
          <label style="font-size: 14px; font-weight: bold;">Input</label>
          <t-textarea
            v-model="input"
            placeholder="Enter URL or text..."
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
        <template #icon><link-icon /></template>
        Encode URL
      </t-button>
      <t-button theme="default" variant="base" @click="onDecode">
        <template #icon><link-icon /></template>
        Decode URL
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
      <p>Use this URL encoder and decoder online tool to safely include query values, path fragments, or special characters in URLs. Encoding converts reserved symbols into percent-encoded sequences so links remain valid across browsers and services.</p>
    </template>

    <template #faq>
      <t-collapse-panel header="Should I encode full URLs or components?">
        Usually you should only encode individual query parameters or path components to avoid breaking the URL structure (like protocol and domain).
      </t-collapse-panel>
    </template>
  </ToolLayout>
</template>

<script setup>
import { useSeoHead } from '../composables/useSeoHead'
import { ref } from 'vue'
import { MessagePlugin } from 'tdesign-vue-next'
import { LinkIcon, DeleteIcon } from 'tdesign-icons-vue-next'
import ToolLayout from '../components/ToolLayout.vue'
import { toolDefinitions, routeMeta } from '../data/tools'
import { decodeUrl, encodeUrl } from '../utils/urlTools'

const tool = toolDefinitions.find((item) => item.path === '/url-encoder')
useSeoHead(routeMeta['/url-encoder'])
const input = ref('')
const output = ref('')
const error = ref('')

function onEncode() {
  const result = encodeUrl(input.value)
  output.value = result.output
  error.value = result.error
  if (!result.error && input.value) {
    MessagePlugin.success('URL Encoded Successfully')
  }
}

function onDecode() {
  const result = decodeUrl(input.value)
  output.value = result.output
  error.value = result.error
  if (!result.error && input.value) {
    MessagePlugin.success('URL Decoded Successfully')
  }
}

function onClear() {
  input.value = ''
  output.value = ''
  error.value = ''
}
</script>
