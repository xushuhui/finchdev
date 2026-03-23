<template>
  <ToolLayout :title="tool.h1">
    <template #lead>
      Convert Unix epoch timestamps to readable UTC or local datetime and back using TDesign form controls.
    </template>

    <t-space direction="vertical" size="24px" style="width: 100%; display: flex;">
      <t-row :gutter="[16, 16]">
        <t-col :xs="12" :lg="6">
          <t-card title="Timestamp to Date" class="panel-card" hover-shadow>
            <t-space direction="vertical" size="16px" style="width: 100%; display: flex;">
              <t-input v-model="timestampInput" placeholder="e.g. 1710902400" @change="convertTimestamp">
                <template #prefix-icon><time-icon /></template>
              </t-input>
              <t-button theme="primary" @click="convertTimestamp">Convert to Date</t-button>
              <t-descriptions :column="1" bordered size="small">
                <t-descriptions-item label="UTC">{{ utcOutput || '-' }}</t-descriptions-item>
                <t-descriptions-item label="Local">{{ localOutput || '-' }}</t-descriptions-item>
              </t-descriptions>
            </t-space>
          </t-card>
        </t-col>

        <t-col :xs="12" :lg="6">
          <t-card title="Date to Timestamp" class="panel-card" hover-shadow>
            <t-space direction="vertical" size="16px" style="width: 100%; display: flex;">
              <t-date-picker
                v-model="dateInput"
                enable-time-picker
                allow-input
                clearable
                format="YYYY-MM-DD HH:mm:ss"
                placeholder="Select date and time"
                style="width: 100%;"
                @change="convertDate"
              />
              <t-button variant="outline" @click="convertDate">Generate Timestamp</t-button>
              <t-descriptions :column="1" bordered size="small">
                <t-descriptions-item label="Seconds">{{ secondsOutput || '-' }}</t-descriptions-item>
                <t-descriptions-item label="Milliseconds">{{ millisecondsOutput || '-' }}</t-descriptions-item>
              </t-descriptions>
            </t-space>
          </t-card>
        </t-col>
      </t-row>

      <t-alert v-if="error" theme="error" variant="light-outline">{{ error }}</t-alert>
    </t-space>

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

<script setup lang="ts">
import { useSeoHead } from '../composables/useSeoHead'
import { ref } from 'vue'
import { TimeIcon } from 'tdesign-icons-vue-next'
import ToolLayout from '../components/ToolLayout.vue'
import { getRouteMeta, getToolDefinition } from '../data/tools'
import { dateToTimestamp, timestampToDate } from '../utils/timestampTools'

const tool = getToolDefinition('/timestamp')
useSeoHead(getRouteMeta('/timestamp'))
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

<style scoped>
.panel-card {
  border-radius: var(--td-radius-extraLarge);
}
</style>
