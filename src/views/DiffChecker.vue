<template>
  <ToolLayout :title="tool.h1">
    <template #lead>
      Compare two text blocks line by line and inspect what changed with added and removed counts.
    </template>

    <t-space direction="vertical" size="24px" style="width: 100%; display: flex;">
      <t-row :gutter="[16, 16]">
        <t-col :xs="12" :lg="6">
          <t-card title="Original Text" class="panel-card" hover-shadow>
            <t-textarea v-model="leftText" :autosize="{ minRows: 16, maxRows: 28 }" placeholder="Paste the original text..." />
          </t-card>
        </t-col>
        <t-col :xs="12" :lg="6">
          <t-card title="Updated Text" class="panel-card" hover-shadow>
            <t-textarea v-model="rightText" :autosize="{ minRows: 16, maxRows: 28 }" placeholder="Paste the updated text..." />
          </t-card>
        </t-col>
      </t-row>

      <t-card title="Diff Result" class="panel-card" hover-shadow>
        <template #actions>
          <t-space size="8px">
            <t-tag theme="success" variant="light-outline">+{{ summary.added }}</t-tag>
            <t-tag theme="danger" variant="light-outline">-{{ summary.removed }}</t-tag>
          </t-space>
        </template>

        <div class="diff-output">
          <div v-for="(part, index) in diffParts" :key="index" :class="['diff-line', { added: part.added, removed: part.removed }]">
            <pre>{{ part.value }}</pre>
          </div>
        </div>
      </t-card>
    </t-space>

    <template #usage>
      <p>This diff checker helps you compare two text versions without leaving the browser. Paste the original content on one side and the updated content on the other, and FinchDev highlights added and removed lines in a single result view. This is useful when reviewing configuration changes, comparing API responses, spotting document edits, or validating generated output from scripts and tools. The summary counts make it easy to understand the scale of the change before you inspect individual lines. Since everything runs locally, you can compare private notes, internal config, or sensitive snippets without sending them to an external diff service.</p>
    </template>

    <template #faq>
      <t-collapse-panel header="Does this work line by line?">
        Yes. The checker compares text by lines, which makes it useful for documents, code snippets, logs, and configuration files.
      </t-collapse-panel>
      <t-collapse-panel header="Can I compare large blocks of text?">
        Yes, within normal browser memory limits. Very large texts may still depend on device performance.
      </t-collapse-panel>
    </template>
  </ToolLayout>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useSeoHead } from '../composables/useSeoHead'
import ToolLayout from '../components/ToolLayout.vue'
import { buildDiffSummary, createLineDiff } from '../utils/diffTools'
import { routeMeta, toolDefinitions } from '../data/tools'

const tool = toolDefinitions.find((item) => item.path === '/diff-checker')
useSeoHead(routeMeta['/diff-checker'])

const leftText = ref('line one\nline two\nline three')
const rightText = ref('line one\nline two updated\nline three\nline four')

const diffParts = computed(() => createLineDiff(leftText.value, rightText.value))
const summary = computed(() => buildDiffSummary(diffParts.value))
</script>

<style scoped>
.panel-card {
  border-radius: var(--td-radius-extraLarge);
}

.diff-output {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.diff-line {
  border-radius: 10px;
  background: var(--td-bg-color-page);
  padding: 10px 12px;
}

.diff-line.added {
  background: rgba(46, 213, 115, 0.12);
}

.diff-line.removed {
  background: rgba(245, 34, 45, 0.12);
}

.diff-line pre {
  margin: 0;
  white-space: pre-wrap;
  font-family: var(--font-mono);
}
</style>
