<template>
  <ToolLayout :title="tool.h1">
    <template #lead>
      Convert YAML to JSON or JSON to YAML with fast validation and copy-friendly browser output.
    </template>

    <t-space direction="vertical" size="24px" style="width: 100%; display: flex;">
      <t-row :gutter="[16, 16]">
        <t-col :xs="12" :lg="6">
          <t-card title="Input" class="panel-card" hover-shadow>
            <t-textarea v-model="input" :autosize="{ minRows: 16, maxRows: 28 }" placeholder="Paste YAML or JSON here..." />
          </t-card>
        </t-col>
        <t-col :xs="12" :lg="6">
          <t-card title="Output" class="panel-card" hover-shadow>
            <t-textarea :value="output" readonly :autosize="{ minRows: 16, maxRows: 28 }" placeholder="Converted output will appear here..." />
          </t-card>
        </t-col>
      </t-row>

      <t-space wrap size="12px">
        <t-button theme="primary" @click="convertYamlToJson">YAML to JSON</t-button>
        <t-button variant="outline" @click="convertJsonToYaml">JSON to YAML</t-button>
        <t-button variant="outline" :disabled="!output" @click="copyOutput">Copy Result</t-button>
        <t-button variant="text" @click="clearAll">Clear</t-button>
      </t-space>

      <t-alert v-if="error" theme="error" variant="light-outline">{{ error }}</t-alert>
      <t-alert v-else-if="output" theme="success" variant="light-outline">Conversion completed successfully.</t-alert>
    </t-space>

    <template #usage>
      <p>This YAML JSON converter is useful when you need to switch between configuration formats without opening a terminal or writing temporary scripts. Paste YAML on the left to convert it into readable JSON, or paste JSON to turn it into concise YAML. FinchDev validates the input locally and reports parsing problems immediately, which helps when debugging CI configs, infrastructure manifests, API mocks, or app settings. The output is formatted for readability and can be copied directly into your editor or deployment files. Because the entire conversion happens in the browser, your configuration data stays private while still giving you quick feedback during development.</p>
    </template>

    <template #faq>
      <t-collapse-panel header="Can I convert both directions?">
        Yes. This tool supports YAML to JSON and JSON to YAML conversion using separate actions.
      </t-collapse-panel>
      <t-collapse-panel header="Will invalid input show an error?">
        Yes. FinchDev validates the source content and shows a parse error if the YAML or JSON is malformed.
      </t-collapse-panel>
    </template>
  </ToolLayout>
</template>

<script setup>
import { ref } from 'vue'
import { MessagePlugin } from 'tdesign-vue-next'
import { useSeoHead } from '../composables/useSeoHead'
import ToolLayout from '../components/ToolLayout.vue'
import { jsonToYaml, yamlToJson } from '../utils/yamlJsonTools'
import { routeMeta, toolDefinitions } from '../data/tools'

const tool = toolDefinitions.find((item) => item.path === '/yaml-json-converter')
useSeoHead(routeMeta['/yaml-json-converter'])

const input = ref('name: finchdev\ntools:\n  - json\n  - regex')
const output = ref('')
const error = ref('')

function convertYamlToJson() {
  const result = yamlToJson(input.value)
  output.value = result.output
  error.value = result.error
}

function convertJsonToYaml() {
  const result = jsonToYaml(input.value)
  output.value = result.output
  error.value = result.error
}

async function copyOutput() {
  if (!output.value) return
  await navigator.clipboard.writeText(output.value)
  MessagePlugin.success('Converted output copied')
}

function clearAll() {
  input.value = ''
  output.value = ''
  error.value = ''
}
</script>

<style scoped>
.panel-card {
  border-radius: var(--td-radius-extraLarge);
}
</style>
