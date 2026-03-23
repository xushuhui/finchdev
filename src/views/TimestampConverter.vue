<template>
  <ToolLayout :title="tool.h1">
    <template #lead>
      Convert Unix epoch timestamps to readable UTC/local datetime and back.
    </template>

    <t-row :gutter="[24, 24]">
      <t-col :xs="12" :md="6">
        <t-space direction="vertical" style="width: 100%; padding: 24px; border: 1px solid var(--td-border-level-1); border-radius: 6px; background-color: var(--td-bg-color-container);">
          <h3 style="font-size: 12px; font-weight: bold; text-transform: uppercase; color: var(--td-text-color-placeholder);">Timestamp to Date</h3>
          <t-input
            v-model="timestampInput"
            placeholder="e.g. 1710902400"
            @change="convertTimestamp"
          >
            <template #prefix-icon><time-icon /></template>
          </t-input>
          <t-button theme="primary" block @click="convertTimestamp">Convert to Date</t-button>
          
          <t-divider style="margin: 12px 0;" />
          
          <t-space direction="vertical" size="12px" style="width: 100%;">
            <div style="display: flex; justify-content: space-between; font-size: 14px;">
              <span style="color: var(--td-text-color-secondary)">UTC:</span>
              <span style="font-family: var(--font-mono); font-weight: bold;">{{ utcOutput || '-' }}</span>
            </div>
            <div style="display: flex; justify-content: space-between; font-size: 14px;">
              <span style="color: var(--td-text-color-secondary)">Local:</span>
              <span style="font-family: var(--font-mono); font-weight: bold;">{{ localOutput || '-' }}</span>
            </div>
          </t-space>
        </t-space>
      </t-col>

      <t-col :xs="12" :md="6">
        <t-space direction="vertical" style="width: 100%; padding: 24px; border: 1px solid var(--td-border-level-1); border-radius: 6px; background-color: var(--td-bg-color-container);">
          <h3 style="font-size: 12px; font-weight: bold; text-transform: uppercase; color: var(--td-text-color-placeholder);">Date to Timestamp</h3>
          <t-date-picker
            v-model="dateInput"
            enable-time-picker
            allow-input
            clearable
            format="YYYY-MM-DD HH:mm:ss"
            placeholder="Select Date and Time"
            style="width: 100%;"
            @change="convertDate"
          />
          <t-button theme="default" variant="base" block @click="convertDate">Generate Timestamp</t-button>
          
          <t-divider style="margin: 12px 0;" />
          
          <t-space direction="vertical" size="12px" style="width: 100%;">
            <div style="display: flex; justify-content: space-between; font-size: 14px;">
              <span style="color: var(--td-text-color-secondary)">Seconds:</span>
              <span style="font-family: var(--font-mono); font-weight: bold;">{{ secondsOutput || '-' }}</span>
            </div>
            <div style="display: flex; justify-content: space-between; font-size: 14px;">
              <span style="color: var(--td-text-color-secondary)">Milliseconds:</span>
              <span style="font-family: var(--font-mono); font-weight: bold;">{{ millisecondsOutput || '-' }}</span>
            </div>
          </t-space>
        </t-space>
      </t-col>
    </t-row>

    <t-alert v-if="error" theme="error" style="margin-top: 24px;">
      {{ error }}
    </t-alert>

    <template #usage>
      <p>This Unix timestamp converter helps you switch between epoch values and human-readable datetime formats during API debugging, database checks, and log analysis.</p>
    </template>

    <template #faq>
      <t-collapse-panel header="Should I use seconds or milliseconds?">
        It depends on your system. Unix systems often use seconds, while JavaScript and many web APIs use milliseconds. This tool provides both for convenience.
      </t-collapse-panel>
    </template>
  </ToolLayout>
</template>

<script setup>
import { useHead } from '@unhead/vue'
import { ref } from 'vue'
import { TimeIcon } from 'tdesign-icons-vue-next'
import ToolLayout from '../components/ToolLayout.vue'
import { toolDefinitions } from '../data/tools'
import { dateToTimestamp, timestampToDate } from '../utils/timestampTools'

const tool = toolDefinitions.find((item) => item.path === '/timestamp')
useHead({
  title: tool.title,
  meta: [{ name: 'description', content: tool.description }],
})
const timestampInput = ref('')
const dateInput = ref('')
const utcOutput = ref('')
const localOutput = ref('')
const secondsOutput = ref('')
const millisecondsOutput = ref('')
const error = ref('')

function convertTimestamp() {
  const result = timestampToDate(timestampInput.value)
  error.value = result.error
  utcOutput.value = result.utc
  localOutput.value = result.local
}

function convertDate() {
  const result = dateToTimestamp(dateInput.value)
  error.value = result.error
  secondsOutput.value = result.seconds
  millisecondsOutput.value = result.milliseconds
}
</script>
