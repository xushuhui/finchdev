<template>
  <ToolLayout :title="tool.h1">
    <template #lead>
      Encode reserved HTML characters into entities or decode entities back into plain text instantly.
    </template>

    <t-space direction="vertical" size="24px" style="width: 100%; display: flex;">
      <t-row :gutter="[16, 16]">
        <t-col :xs="12" :lg="6">
          <t-card title="Input" class="panel-card" hover-shadow>
            <t-textarea v-model="input" :autosize="{ minRows: 14, maxRows: 24 }" placeholder="Enter HTML or encoded text..." />
          </t-card>
        </t-col>
        <t-col :xs="12" :lg="6">
          <t-card title="Output" class="panel-card" hover-shadow>
            <t-textarea :value="output" readonly :autosize="{ minRows: 14, maxRows: 24 }" placeholder="Encoded or decoded output will appear here..." />
          </t-card>
        </t-col>
      </t-row>

      <t-space wrap size="12px">
        <t-button theme="primary" @click="encodeInput">Encode Entities</t-button>
        <t-button variant="outline" @click="decodeInput">Decode Entities</t-button>
        <t-button variant="outline" :disabled="!output" @click="copyOutput">Copy Result</t-button>
        <t-button variant="text" @click="clearAll">Clear</t-button>
      </t-space>
    </t-space>

    <template #usage>
      <p>This HTML entity encoder helps you safely convert reserved HTML characters like angle brackets, ampersands, quotes, and apostrophes into entity form for markup, CMS input, or documentation examples. It can also decode named and numeric entities back into readable text when you need to inspect escaped content. Use it while building templates, writing blog posts with code snippets, handling user-generated content, or debugging encoded strings from APIs and databases. FinchDev performs the conversion instantly in the browser, which keeps the process private and convenient for day-to-day frontend work.</p>
    </template>

    <template #faq>
      <t-collapse-panel header="What characters are encoded?">
        The tool focuses on common reserved HTML characters such as ampersands, angle brackets, quotes, and apostrophes.
      </t-collapse-panel>
      <t-collapse-panel header="Can it decode numeric entities too?">
        Yes. Numeric entities like <code>&amp;#39;</code> are decoded alongside the common named entities supported by the tool.
      </t-collapse-panel>
    </template>
  </ToolLayout>
</template>

<script setup>
import { ref } from 'vue'
import { MessagePlugin } from 'tdesign-vue-next'
import { useSeoHead } from '../composables/useSeoHead'
import ToolLayout from '../components/ToolLayout.vue'
import { decodeHtmlEntities, encodeHtmlEntities } from '../utils/htmlEntityTools'
import { routeMeta, toolDefinitions } from '../data/tools'

const tool = toolDefinitions.find((item) => item.path === '/html-entity-encoder')
useSeoHead(routeMeta['/html-entity-encoder'])

const input = ref('<div class="demo">& FinchDev</div>')
const output = ref('')

function encodeInput() {
  output.value = encodeHtmlEntities(input.value)
}

function decodeInput() {
  output.value = decodeHtmlEntities(input.value)
}

async function copyOutput() {
  if (!output.value) return
  await navigator.clipboard.writeText(output.value)
  MessagePlugin.success('Result copied')
}

function clearAll() {
  input.value = ''
  output.value = ''
}
</script>

<style scoped>
.panel-card {
  border-radius: var(--td-radius-extraLarge);
}
</style>
