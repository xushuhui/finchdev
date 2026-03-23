<template>
  <ToolLayout :title="tool.h1">
    <template #lead>
      Generate MD5, SHA-1, SHA-256, and SHA-512 hashes instantly from text in your browser.
    </template>

    <t-space direction="vertical" size="24px" style="width: 100%; display: flex;">
      <t-card title="Source Text" class="panel-card" hover-shadow>
        <t-textarea
          v-model="input"
          placeholder="Type or paste text to hash..."
          :autosize="{ minRows: 8, maxRows: 16 }"
        />
      </t-card>

      <t-row :gutter="[16, 16]">
        <t-col v-for="item in hashItems" :key="item.key" :xs="12" :md="6">
          <t-card class="panel-card" :title="item.label" hover-shadow>
            <t-space direction="vertical" size="12px" style="width: 100%; display: flex;">
              <div class="hash-output">{{ hashes[item.key] || '-' }}</div>
              <t-button variant="outline" :disabled="!hashes[item.key]" @click="copyValue(hashes[item.key], `${item.label} copied`)">
                Copy
              </t-button>
            </t-space>
          </t-card>
        </t-col>
      </t-row>

      <t-alert v-if="error" theme="error" variant="light-outline">{{ error }}</t-alert>
      <t-alert v-else-if="input" theme="success" variant="light-outline">Hashes update in real time as you type.</t-alert>
    </t-space>

    <template #usage>
      <p>Use this hash generator online to create common digests for test payloads, integrity checks, cache keys, or quick comparisons between text inputs. As you type, FinchDev calculates MD5, SHA-1, SHA-256, and SHA-512 outputs directly in the browser. That makes it useful for development workflows where you need a fast checksum without opening a terminal or sending content to an external service. SHA-256 and SHA-512 are strong modern choices for security-oriented tasks, while MD5 and SHA-1 remain helpful for legacy systems and compatibility checks. Because everything runs locally, sensitive text stays on your device. Copy individual results with one click and compare how different algorithms transform the same input into completely different fixed-length digests.</p>
    </template>

    <template #faq>
      <t-collapse-panel header="Is my data sent to a server?">
        No, hashing is done in your browser using local JavaScript and the Web Crypto API where available.
      </t-collapse-panel>
      <t-collapse-panel header="What is the difference between MD5 and SHA-256?">
        MD5 produces a 128-bit hash and is considered insecure for cryptographic use. SHA-256 produces a 256-bit hash and is widely used for modern security-sensitive workflows.
      </t-collapse-panel>
    </template>
  </ToolLayout>
</template>

<script setup>
import { ref, watch } from 'vue'
import { MessagePlugin } from 'tdesign-vue-next'
import { useSeoHead } from '../composables/useSeoHead'
import ToolLayout from '../components/ToolLayout.vue'
import { routeMeta, toolDefinitions } from '../data/tools'
import { generateHashes } from '../utils/hashTools'

const tool = toolDefinitions.find((item) => item.path === '/hash-generator')
useSeoHead(routeMeta['/hash-generator'])

const input = ref('')
const hashes = ref({ md5: '', sha1: '', sha256: '', sha512: '' })
const error = ref('')
let requestId = 0

const hashItems = [
  { key: 'md5', label: 'MD5' },
  { key: 'sha1', label: 'SHA-1' },
  { key: 'sha256', label: 'SHA-256' },
  { key: 'sha512', label: 'SHA-512' },
]

watch(
  input,
  async (value) => {
    const currentId = ++requestId
    if (!value) {
      hashes.value = { md5: '', sha1: '', sha256: '', sha512: '' }
      error.value = ''
      return
    }

    try {
      const result = await generateHashes(value)
      if (currentId === requestId) {
        hashes.value = result
        error.value = ''
      }
    } catch (currentError) {
      if (currentId === requestId) {
        error.value = currentError.message
      }
    }
  },
  { immediate: true },
)

async function copyValue(value, message) {
  await navigator.clipboard.writeText(value)
  MessagePlugin.success(message)
}
</script>

<style scoped>
.panel-card {
  border-radius: var(--td-radius-extraLarge);
}

.hash-output {
  min-height: 68px;
  overflow-wrap: anywhere;
  border-radius: 12px;
  background: var(--td-bg-color-page);
  padding: 14px;
  font-family: var(--font-mono);
  line-height: 1.7;
  color: var(--td-text-color-primary);
}
</style>
