<template>
  <ToolLayout :title="tool.h1">
    <template #lead>
      Generate downloadable QR codes for URLs, text, and other content with adjustable size controls.
    </template>

    <t-space direction="vertical" size="24px" style="width: 100%; display: flex;">
      <t-card title="QR Content" class="panel-card" hover-shadow>
        <t-space direction="vertical" size="16px" style="width: 100%; display: flex;">
          <t-textarea v-model="input" :autosize="{ minRows: 6, maxRows: 12 }" placeholder="Enter text or a URL to encode..." />
          <t-row :gutter="[16, 16]">
            <t-col :xs="12" :md="6">
              <t-space direction="vertical" size="8px" style="width: 100%; display: flex;">
                <span class="slider-label">Width: {{ width }}px</span>
                <t-slider v-model="width" :min="128" :max="512" :step="32" />
              </t-space>
            </t-col>
            <t-col :xs="12" :md="6">
              <t-space direction="vertical" size="8px" style="width: 100%; display: flex;">
                <span class="slider-label">Margin: {{ margin }}</span>
                <t-slider v-model="margin" :min="0" :max="8" :step="1" />
              </t-space>
            </t-col>
          </t-row>
        </t-space>
      </t-card>

      <t-alert v-if="error" theme="error" variant="light-outline">{{ error }}</t-alert>

      <t-card title="Preview" class="panel-card" hover-shadow>
        <t-space direction="vertical" size="16px" align="center" style="width: 100%; display: flex;">
          <img v-if="dataUrl" :src="dataUrl" alt="Generated QR code" class="qr-preview" />
          <t-alert v-else theme="info" variant="light-outline">Enter content to generate a QR code.</t-alert>
          <t-space wrap size="12px">
            <t-button theme="primary" :disabled="!dataUrl" @click="downloadQr">Download PNG</t-button>
            <t-button variant="outline" :disabled="!dataUrl" @click="copyDataUrl">Copy Data URL</t-button>
          </t-space>
        </t-space>
      </t-card>
    </t-space>

    <template #usage>
      <p>This QR code generator helps you create scannable codes for URLs, text snippets, contact details, Wi-Fi strings, or other short payloads without using an external service. Paste the content you want to encode, then adjust width and margin to fit your preferred output size. FinchDev renders the QR code directly in the browser and lets you download the result as a PNG image or copy the generated data URL. This is useful for event materials, landing pages, app installs, printed labels, or internal tooling where a quick machine-readable bridge is helpful. Because the generation happens locally, your source content remains private while still giving you a fast visual preview.</p>
    </template>

    <template #faq>
      <t-collapse-panel header="Can I generate QR codes for plain text and URLs?">
        Yes. The tool accepts plain text, URLs, and most short strings that fit comfortably inside a QR code.
      </t-collapse-panel>
      <t-collapse-panel header="Is the QR code generated in the browser?">
        Yes. FinchDev creates the image locally and does not send the content to a server.
      </t-collapse-panel>
    </template>
  </ToolLayout>
</template>

<script setup>
import { ref, watch } from 'vue'
import { MessagePlugin } from 'tdesign-vue-next'
import { useSeoHead } from '../composables/useSeoHead'
import ToolLayout from '../components/ToolLayout.vue'
import { createQrCode } from '../utils/qrTools'
import { routeMeta, toolDefinitions } from '../data/tools'

const tool = toolDefinitions.find((item) => item.path === '/qr-code-generator')
useSeoHead(routeMeta['/qr-code-generator'])

const input = ref('https://www.finchdev.com')
const width = ref(256)
const margin = ref(2)
const dataUrl = ref('')
const error = ref('')
let requestId = 0

watch([input, width, margin], async ([value, widthValue, marginValue]) => {
  const currentId = ++requestId
  if (!value.trim()) {
    dataUrl.value = ''
    error.value = ''
    return
  }

  try {
    const result = await createQrCode(value, { width: widthValue, margin: marginValue })
    if (currentId === requestId) {
      dataUrl.value = result
      error.value = ''
    }
  } catch (currentError) {
    if (currentId === requestId) {
      error.value = currentError.message
    }
  }
}, { immediate: true })

function downloadQr() {
  if (!dataUrl.value) return
  const anchor = document.createElement('a')
  anchor.href = dataUrl.value
  anchor.download = 'finchdev-qr-code.png'
  anchor.click()
  MessagePlugin.success('QR code download started')
}

async function copyDataUrl() {
  if (!dataUrl.value) return
  await navigator.clipboard.writeText(dataUrl.value)
  MessagePlugin.success('Data URL copied')
}
</script>

<style scoped>
.panel-card {
  border-radius: var(--td-radius-extraLarge);
}

.slider-label {
  color: var(--td-text-color-secondary);
  font-size: 14px;
}

.qr-preview {
  max-width: 100%;
  border-radius: 16px;
  border: 1px solid var(--td-component-border);
  background: white;
  padding: 16px;
}
</style>
