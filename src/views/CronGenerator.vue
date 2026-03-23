<template>
  <ToolLayout :title="tool.h1">
    <template #lead>
      Build cron expressions with common presets and plain-English summaries directly in your browser.
    </template>

    <t-space direction="vertical" size="24px" style="width: 100%; display: flex;">
      <t-space wrap size="12px">
        <t-button v-for="preset in presets" :key="preset.label" variant="outline" @click="applyPreset(preset.value)">
          {{ preset.label }}
        </t-button>
      </t-space>

      <t-card title="Schedule Fields" class="panel-card" hover-shadow>
        <t-row :gutter="[16, 16]">
          <t-col v-for="field in fields" :key="field.key" :xs="12" :sm="6" :lg="2.4">
            <t-input v-model="form[field.key]" :label="field.label" :placeholder="field.placeholder" />
          </t-col>
        </t-row>
      </t-card>

      <t-card title="Generated Expression" class="panel-card" hover-shadow>
        <t-space direction="vertical" size="12px" style="width: 100%; display: flex;">
          <div class="mono-output">{{ expression }}</div>
          <t-alert theme="info" variant="light-outline">{{ summary }}</t-alert>
        </t-space>
      </t-card>
    </t-space>

    <template #usage>
      <p>Use this cron expression generator when you need to build schedules for Linux cron, background jobs, or recurring task runners without memorizing all five fields. Fill in minute, hour, day-of-month, month, and day-of-week values, or start from common presets such as daily, hourly, and weekday runs. FinchDev assembles the final expression instantly and adds a simple human-readable summary so you can verify that the schedule means what you expect. This is especially useful when setting up backups, automated reports, cleanup jobs, or deployment tasks. Because the tool runs locally in the browser, you can experiment freely while keeping the workflow fast and private.</p>
    </template>

    <template #faq>
      <t-collapse-panel header="Does this support standard 5-field cron only?">
        Yes. This generator is focused on the common 5-field cron format used by most Unix-style schedulers.
      </t-collapse-panel>
      <t-collapse-panel header="Can I use special values like ranges or step syntax?">
        Yes. You can type ranges like <code>1-5</code> or step syntax like <code>*/15</code> directly into any field.
      </t-collapse-panel>
    </template>
  </ToolLayout>
</template>

<script setup>
import { computed, reactive } from 'vue'
import { useSeoHead } from '../composables/useSeoHead'
import ToolLayout from '../components/ToolLayout.vue'
import { buildCronExpression, describeCronExpression } from '../utils/cronTools'
import { routeMeta, toolDefinitions } from '../data/tools'

const tool = toolDefinitions.find((item) => item.path === '/cron-generator')
useSeoHead(routeMeta['/cron-generator'])

const form = reactive({
  minute: '0',
  hour: '9',
  dayOfMonth: '*',
  month: '*',
  dayOfWeek: '1-5',
})

const fields = [
  { key: 'minute', label: 'Minute', placeholder: '0' },
  { key: 'hour', label: 'Hour', placeholder: '9' },
  { key: 'dayOfMonth', label: 'Day', placeholder: '*' },
  { key: 'month', label: 'Month', placeholder: '*' },
  { key: 'dayOfWeek', label: 'Weekday', placeholder: '1-5' },
]

const presets = [
  { label: 'Hourly', value: { minute: '0', hour: '*', dayOfMonth: '*', month: '*', dayOfWeek: '*' } },
  { label: 'Daily 09:00', value: { minute: '0', hour: '9', dayOfMonth: '*', month: '*', dayOfWeek: '*' } },
  { label: 'Weekdays 09:00', value: { minute: '0', hour: '9', dayOfMonth: '*', month: '*', dayOfWeek: '1-5' } },
  { label: 'Weekly Monday', value: { minute: '0', hour: '9', dayOfMonth: '*', month: '*', dayOfWeek: '1' } },
]

const expression = computed(() => buildCronExpression(form))
const summary = computed(() => describeCronExpression(expression.value))

function applyPreset(preset) {
  Object.assign(form, preset)
}
</script>

<style scoped>
.panel-card {
  border-radius: var(--td-radius-extraLarge);
}

.mono-output {
  border-radius: 12px;
  background: var(--td-bg-color-page);
  padding: 14px;
  font-family: var(--font-mono);
  font-size: 16px;
}
</style>
