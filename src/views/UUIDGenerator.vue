<template>
  <ToolLayout :title="tool.h1">
    <template #lead>
      Generate random UUID v4 identifiers with bulk output, copy support, and format controls.
    </template>

    <t-space direction="vertical" size="24px" style="width: 100%; display: flex;">
      <t-card title="Generation Options" class="panel-card" hover-shadow>
        <t-row :gutter="[16, 16]" align="middle">
          <t-col :xs="12" :md="4">
            <t-input v-model="countInput" type="number" label="Quantity" placeholder="1-100" />
          </t-col>
          <t-col :xs="6" :md="4">
            <t-space>
              <span>Uppercase</span>
              <t-switch v-model="uppercase" />
            </t-space>
          </t-col>
          <t-col :xs="6" :md="4">
            <t-space>
              <span>Hyphenated</span>
              <t-switch v-model="hyphenated" />
            </t-space>
          </t-col>
        </t-row>
      </t-card>

      <t-space size="12px" wrap>
        <t-button theme="primary" @click="generateOne">Generate</t-button>
        <t-button variant="outline" @click="generateBulk">Bulk Generate</t-button>
        <t-button variant="outline" :disabled="!uuids.length" @click="copyAll">Copy All</t-button>
      </t-space>

      <t-card title="Generated UUIDs" class="panel-card" hover-shadow>
        <t-space direction="vertical" size="12px" style="width: 100%; display: flex;">
          <div v-for="item in uuids" :key="item" class="uuid-row">{{ item }}</div>
          <t-alert v-if="!uuids.length" theme="info" variant="light-outline">No UUIDs generated yet.</t-alert>
        </t-space>
      </t-card>
    </t-space>

    <template #usage>
      <p>This UUID generator online creates version 4 identifiers for database keys, API objects, distributed systems, and test fixtures. Generate a single UUID instantly or request a bulk batch when you need many unique values at once. FinchDev also lets you switch between lowercase and uppercase output, and between hyphenated and compact forms, so you can match the exact format your application expects. The generator uses your browser’s cryptographic random source, which makes it suitable for normal application development and production-style testing. Since it runs locally, there is no server dependency and no waiting for round trips. Use the Copy All action to move a full batch into seed files, spreadsheets, fixtures, or QA test data quickly.</p>
    </template>

    <template #faq>
      <t-collapse-panel header="What is a UUID?">
        A UUID is a 128-bit identifier designed to be unique across systems and time, commonly used as a primary key or external identifier.
      </t-collapse-panel>
      <t-collapse-panel header="Are these UUIDs truly random?">
        Yes. They are generated using your browser's cryptographically secure random number generator.
      </t-collapse-panel>
    </template>
  </ToolLayout>
</template>

<script setup>
import { ref } from 'vue'
import { MessagePlugin } from 'tdesign-vue-next'
import { useSeoHead } from '../composables/useSeoHead'
import ToolLayout from '../components/ToolLayout.vue'
import { routeMeta, toolDefinitions } from '../data/tools'
import { generateUuid, generateUuidBatch } from '../utils/uuidTools'

const tool = toolDefinitions.find((item) => item.path === '/uuid-generator')
useSeoHead(routeMeta['/uuid-generator'])

const countInput = ref('10')
const uppercase = ref(false)
const hyphenated = ref(true)
const uuids = ref([])

function options() {
  return {
    uppercase: uppercase.value,
    hyphenated: hyphenated.value,
  }
}

function generateOne() {
  uuids.value = [generateUuid(options())]
  MessagePlugin.success('UUID generated')
}

function generateBulk() {
  uuids.value = generateUuidBatch(countInput.value, options())
  MessagePlugin.success(`${uuids.value.length} UUIDs generated`)
}

async function copyAll() {
  await navigator.clipboard.writeText(uuids.value.join('\n'))
  MessagePlugin.success('UUID list copied')
}
</script>

<style scoped>
.panel-card {
  border-radius: var(--td-radius-extraLarge);
}

.uuid-row {
  border-radius: 12px;
  background: var(--td-bg-color-page);
  padding: 12px 14px;
  font-family: var(--font-mono);
  overflow-wrap: anywhere;
}
</style>
