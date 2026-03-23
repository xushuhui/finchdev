<template>
  <ToolLayout :title="tool.h1">
    <template #lead>
      Test regular expressions with flags and instantly inspect all matches. All processing happens locally in your browser.
    </template>

    <t-row :gutter="[32, 32]">
      <t-col :xs="12" :lg="8">
        <t-space direction="vertical" style="width: 100%;">
          <label style="font-size: 14px; font-weight: bold;">Test Text</label>
          <t-textarea
            v-model="text"
            placeholder="Enter text to test against your regex..."
            :autosize="{ minRows: 12, maxRows: 20 }"
          />
        </t-space>
      </t-col>

      <t-col :xs="12" :lg="4">
        <t-space direction="vertical" size="24px" style="width: 100%;">
          <t-space direction="vertical" style="width: 100%;">
            <label style="font-size: 14px; font-weight: bold;">Pattern</label>
            <t-input v-model="pattern" placeholder="e.g. \b\w+@\w+\.\w+\b">
              <template #prefix-icon><search-icon /></template>
            </t-input>
          </t-space>

          <t-space direction="vertical" style="width: 100%;">
            <label style="font-size: 14px; font-weight: bold;">Flags</label>
            <t-input v-model="flags" placeholder="gim">
              <template #prefix-icon><setting-icon /></template>
            </t-input>
          </t-space>

          <t-button theme="primary" block @click="onTest">
            <template #icon><play-circle-stroke-icon /></template>
            Run Regex Test
          </t-button>

          <t-alert v-if="error" theme="error">{{ error }}</t-alert>

          <div style="padding: 20px; border-radius: 6px; background-color: var(--td-bg-color-page); border: 1px solid var(--td-border-level-1);">
            <h3 style="font-size: 12px; font-weight: bold; text-transform: uppercase; color: var(--td-text-color-placeholder); margin-bottom: 12px;">Match Summary</h3>
            <p style="font-size: 14px; font-weight: bold; margin-bottom: 16px;">{{ summary }}</p>
            <t-list v-if="matches.length > 0" size="small" style="max-height: 240px; overflow-y: auto;">
              <t-list-item v-for="(item, index) in matches" :key="index">
                <div style="display: flex; width: 100%; justify-content: space-between; align-items: center;">
                  <span style="font-family: var(--font-mono); font-weight: bold; color: var(--td-brand-color)">{{ item.value }}</span>
                  <t-tag size="small" variant="light-enclosure">index: {{ item.index }}</t-tag>
                </div>
              </t-list-item>
            </t-list>
          </div>
        </t-space>
      </t-col>
    </t-row>

    <template #usage>
      <p>This regex tester online is built for fast experimentation when you need to validate pattern behavior before shipping code. Enter your pattern, choose flags like global, case-insensitive, or multiline, then run the test to inspect every match and its index in the source text.</p>
    </template>

    <template #faq>
      <t-collapse-panel header="Which regex engine does this tool use?">
        It uses JavaScript RegExp behavior from your browser runtime. This ensures that the results you see here will match what you get in your web applications.
      </t-collapse-panel>
    </template>
  </ToolLayout>
</template>

<script setup>
import { useSeoHead } from '../composables/useSeoHead'
import { ref } from 'vue'
import { MessagePlugin } from 'tdesign-vue-next'
import { SearchIcon, SettingIcon, PlayCircleStrokeIcon } from 'tdesign-icons-vue-next'
import ToolLayout from '../components/ToolLayout.vue'
import { toolDefinitions, routeMeta } from '../data/tools'
import { testRegex } from '../utils/regexTools'

const tool = toolDefinitions.find((item) => item.path === '/regex-tester')
useSeoHead(routeMeta['/regex-tester'])
const text = ref('')
const pattern = ref('')
const flags = ref('g')
const matches = ref([])
const summary = ref('No regex test executed yet.')
const error = ref('')

function onTest() {
  const result = testRegex(pattern.value, flags.value, text.value)
  matches.value = result.matches
  summary.value = result.summary
  error.value = result.error
  if (!result.error) {
    MessagePlugin.success('Test completed')
  }
}
</script>
