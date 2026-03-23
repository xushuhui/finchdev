<template>
  <ToolLayout :title="tool.h1">
    <template #lead>
      Test regular expressions with flags and instantly inspect all matches. All processing happens locally in your browser.
    </template>

    <t-row :gutter="[16, 16]">
      <t-col :xs="12" :lg="7">
        <t-card title="Test Text" class="panel-card" hover-shadow>
          <t-textarea
            v-model="text"
            placeholder="Enter text to test against your regex..."
            :autosize="{ minRows: 12, maxRows: 20 }"
          />
        </t-card>
      </t-col>

      <t-col :xs="12" :lg="5">
        <t-space direction="vertical" size="16px" style="width: 100%; display: flex;">
          <t-card title="Pattern Settings" class="panel-card" hover-shadow>
            <t-space direction="vertical" size="16px" style="width: 100%; display: flex;">
              <t-input v-model="pattern" placeholder="e.g. \\b\\w+@\\w+\\.\\w+\\b">
                <template #prefix-icon><search-icon /></template>
              </t-input>
              <t-input v-model="flags" placeholder="gim">
                <template #prefix-icon><setting-icon /></template>
              </t-input>
              <t-space wrap size="12px">
                <t-button theme="primary" @click="onTest">
                  <template #icon><play-circle-stroke-icon /></template>
                  Run Regex Test
                </t-button>
                <t-tag theme="primary" variant="light-outline">JavaScript RegExp</t-tag>
              </t-space>
            </t-space>
          </t-card>

          <t-alert v-if="error" theme="error" variant="light-outline">{{ error }}</t-alert>

          <t-card title="Match Summary" class="panel-card" hover-shadow>
            <t-space direction="vertical" size="12px" style="width: 100%; display: flex;">
              <t-alert theme="info" variant="light-outline">{{ summary }}</t-alert>
              <t-list v-if="matches.length > 0" size="small" split>
                <t-list-item v-for="(item, index) in matches" :key="index">
                  <t-space justify="between" style="width: 100%; display: flex;">
                    <span class="match-value">{{ item.value }}</span>
                    <t-tag size="small" variant="light-outline">index: {{ item.index }}</t-tag>
                  </t-space>
                </t-list-item>
              </t-list>
            </t-space>
          </t-card>
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

<script setup lang="ts">
import { useSeoHead } from '../composables/useSeoHead'
import { ref } from 'vue'
import { MessagePlugin } from 'tdesign-vue-next'
import { SearchIcon, SettingIcon, PlayCircleStrokeIcon } from 'tdesign-icons-vue-next'
import ToolLayout from '../components/ToolLayout.vue'
import { getRouteMeta, getToolDefinition } from '../data/tools'
import { testRegex, type RegexMatch } from '../utils/regexTools'

const tool = getToolDefinition('/regex-tester')
useSeoHead(getRouteMeta('/regex-tester'))
const text = ref('')
const pattern = ref('')
const flags = ref('g')
const matches = ref<RegexMatch[]>([])
const summary = ref('No regex test executed yet.')
const error = ref('')

function onTest(): void {
  const result = testRegex(pattern.value, flags.value, text.value)
  matches.value = result.matches
  summary.value = result.summary
  error.value = result.error
  if (!result.error) {
    MessagePlugin.success('Regex test completed')
  }
}
</script>

<style scoped>
.panel-card {
  border-radius: var(--td-radius-extraLarge);
}

.match-value {
  color: var(--td-brand-color);
  font-family: var(--font-mono);
  font-weight: 700;
}
</style>
