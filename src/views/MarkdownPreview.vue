<template>
  <ToolLayout :title="tool.h1">
    <template #lead>
      Write Markdown on the left and inspect sanitized HTML output on the right in real time.
    </template>

    <t-space direction="vertical" size="24px" style="width: 100%; display: flex;">
      <t-space size="12px" wrap>
        <t-button theme="primary" @click="copyHtml">Copy HTML</t-button>
        <t-button variant="outline" @click="resetSample">Reset Sample</t-button>
      </t-space>

      <t-row :gutter="[16, 16]">
        <t-col :xs="12" :lg="6">
          <t-card title="Markdown" class="panel-card" hover-shadow>
            <t-textarea
              v-model="markdown"
              :autosize="{ minRows: 18, maxRows: 30 }"
              placeholder="Write Markdown here..."
            />
          </t-card>
        </t-col>
        <t-col :xs="12" :lg="6">
          <t-card title="Preview" class="panel-card" hover-shadow>
            <div class="markdown-preview" v-html="renderedHtml"></div>
          </t-card>
        </t-col>
      </t-row>

      <t-alert theme="success" variant="light-outline">Rendered HTML is sanitized before preview and copy.</t-alert>
    </t-space>

    <template #usage>
      <p>This Markdown preview online tool is built for fast writing and safe rendering when you need to test documentation, README snippets, issue templates, or CMS content. Type Markdown on the left and FinchDev renders sanitized HTML on the right instantly, so you can validate structure, spacing, lists, tables, links, and code blocks without switching tools. The HTML output is filtered before display to reduce XSS risk, which is especially important when previewing copied content from external sources. Use Copy HTML when you need the rendered markup for content systems, templates, or quick handoff to another application. The prefilled example helps you verify headings, emphasis, quotes, and lists immediately. Everything runs in the browser, keeping your drafts private and responsive.</p>
    </template>

    <template #faq>
      <t-collapse-panel header="What Markdown syntax is supported?">
        Standard Markdown is supported, including headings, lists, links, images, code blocks, tables, and blockquotes.
      </t-collapse-panel>
      <t-collapse-panel header="Can I export the result?">
        Yes. Use the Copy HTML button to copy the sanitized rendered HTML output.
      </t-collapse-panel>
    </template>
  </ToolLayout>
</template>

<script setup>
import { computed, ref } from 'vue'
import { marked } from 'marked'
import createDOMPurify from 'dompurify'
import { MessagePlugin } from 'tdesign-vue-next'
import { useSeoHead } from '../composables/useSeoHead'
import ToolLayout from '../components/ToolLayout.vue'
import { routeMeta, toolDefinitions } from '../data/tools'
import { DEFAULT_MARKDOWN, renderMarkdown } from '../utils/markdownTools'

const tool = toolDefinitions.find((item) => item.path === '/markdown-preview')
useSeoHead(routeMeta['/markdown-preview'])

const markdown = ref(DEFAULT_MARKDOWN)
const purifier = typeof window === 'undefined'
  ? { sanitize: (value) => value }
  : createDOMPurify(window)

const renderedHtml = computed(() =>
  renderMarkdown(markdown.value, {
    parseMarkdown: (value) => marked.parse(value),
    sanitizeHtml: (value) => purifier.sanitize(value),
  }),
)

async function copyHtml() {
  await navigator.clipboard.writeText(renderedHtml.value)
  MessagePlugin.success('Rendered HTML copied')
}

function resetSample() {
  markdown.value = DEFAULT_MARKDOWN
  MessagePlugin.success('Sample content restored')
}
</script>

<style scoped>
.panel-card {
  height: 100%;
  border-radius: var(--td-radius-extraLarge);
}

.markdown-preview {
  min-height: 380px;
  line-height: 1.8;
  overflow-wrap: anywhere;
}

.markdown-preview :deep(pre) {
  overflow-x: auto;
  border-radius: 12px;
  background: var(--td-bg-color-page);
  padding: 12px 14px;
}

.markdown-preview :deep(code) {
  font-family: var(--font-mono);
}
</style>
