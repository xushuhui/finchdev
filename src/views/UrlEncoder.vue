<template>
  <ToolLayout :title="tool.h1">
    <template #lead>
      Encode URL components safely or decode encoded text for debugging.
    </template>

    <t-space direction="vertical" size="24px" style="width: 100%; display: flex;">
      <t-row :gutter="[16, 16]">
        <t-col :xs="12" :lg="6">
          <t-card title="Input" class="panel-card" hover-shadow>
            <t-textarea
              v-model="input"
              placeholder="Enter URL or text..."
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
          <template #icon><link-icon /></template>
          Encode URL
        </t-button>
        <t-button variant="outline" @click="onDecode">
          <template #icon><link-icon /></template>
          Decode URL
        </t-button>
        <t-button variant="outline" @click="onCopy" :disabled="!output">Copy Result</t-button>
        <t-button variant="text" @click="onClear">
          <template #icon><delete-icon /></template>
          Clear
        </t-button>
      </t-space>

      <t-alert v-if="error" theme="error" variant="light-outline">{{ error }}</t-alert>
      <t-alert v-else-if="output" theme="success" variant="light-outline">URL conversion completed.</t-alert>
    </t-space>

    <template #usage>
      <p>Use this URL encoder and decoder online tool to safely include query values, path fragments, or special characters in URLs. Encoding converts reserved symbols into percent-encoded sequences so links remain valid across browsers and services.</p>
    </template>

    <template #faq>
      <t-collapse-panel header="Should I encode full URLs or components?">
        Usually you should only encode individual query parameters or path components to avoid breaking the URL structure like protocol and domain separators.
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
    MessagePlugin.success('URL encoded successfully')
  }
}

function onDecode() {
  const result = decodeUrl(input.value)
  output.value = result.output
  error.value = result.error
  if (!result.error && input.value) {
    MessagePlugin.success('URL decoded successfully')
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
