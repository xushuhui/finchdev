<template>
  <ToolLayout :title="tool.h1">
    <template #lead>
      Decode JWT header and payload claims, inspect signature bytes, and check token expiration locally.
    </template>

    <t-space direction="vertical" size="24px" style="width: 100%; display: flex;">
      <t-card title="JWT Token" class="panel-card" hover-shadow>
        <t-textarea
          v-model="token"
          placeholder="Paste your JWT token here..."
          :autosize="{ minRows: 6, maxRows: 10 }"
        />
      </t-card>

      <t-alert v-if="error" theme="error" variant="light-outline">{{ error }}</t-alert>

      <t-row v-if="decoded.header || decoded.payload || decoded.signatureHex" :gutter="[16, 16]">
        <t-col :xs="12" :lg="4">
          <t-card title="Header" class="panel-card" hover-shadow>
            <pre class="jwt-output">{{ formatJson(decoded.header) }}</pre>
          </t-card>
        </t-col>
        <t-col :xs="12" :lg="4">
          <t-card class="panel-card" hover-shadow>
            <template #title>
              <t-space align="center">
                <span>Payload</span>
                <t-tag v-if="typeof decoded.payload?.exp === 'number'" :theme="decoded.isExpired ? 'danger' : 'success'" variant="light-outline">
                  {{ decoded.isExpired ? 'Expired' : 'Valid exp' }}
                </t-tag>
              </t-space>
            </template>
            <pre class="jwt-output">{{ formatJson(decoded.payload) }}</pre>
          </t-card>
        </t-col>
        <t-col :xs="12" :lg="4">
          <t-card title="Signature (hex)" class="panel-card" hover-shadow>
            <div class="jwt-output">{{ decoded.signatureHex || '-' }}</div>
          </t-card>
        </t-col>
      </t-row>
    </t-space>

    <template #usage>
      <p>This JWT decoder online lets you inspect token contents quickly without sending secrets or claims to an external API. Paste a JWT and FinchDev decodes the header, payload, and raw signature bytes directly in the browser using Base64URL decoding. The payload panel highlights whether the <code>exp</code> claim is already expired, which makes it useful for debugging auth issues, checking session timeouts, and validating test tokens during development. This tool is intended for inspection only: it does not verify signatures, because secure verification requires a secret or public key that should not be exposed in a browser utility. Use it when troubleshooting authentication flows, reviewing claims, or comparing tokens across environments.</p>
    </template>

    <template #faq>
      <t-collapse-panel header="Does this tool verify the JWT signature?">
        No. It only decodes the token. Signature verification requires the signing secret or public key, which should not be shared in a browser tool.
      </t-collapse-panel>
      <t-collapse-panel header="Is it safe to paste my JWT here?">
        Yes. The token is decoded entirely in your browser and is never sent to a server by FinchDev.
      </t-collapse-panel>
    </template>
  </ToolLayout>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useSeoHead } from '../composables/useSeoHead'
import ToolLayout from '../components/ToolLayout.vue'
import { getRouteMeta, getToolDefinition } from '../data/tools'
import { decodeJwt, type JwtDecodeResult } from '../utils/jwtTools'

const EMPTY_DECODED: JwtDecodeResult = {
  error: '',
  header: null,
  payload: null,
  signatureHex: '',
  isExpired: false,
}

const tool = getToolDefinition('/jwt-decoder')
useSeoHead(getRouteMeta('/jwt-decoder'))

const token = ref('')
const decoded = ref<JwtDecodeResult>({ ...EMPTY_DECODED })
const error = ref('')

watch(
  token,
  (value) => {
    if (!value.trim()) {
      decoded.value = { ...EMPTY_DECODED }
      error.value = ''
      return
    }
    const result = decodeJwt(value)
    decoded.value = result
    error.value = result.error
  },
  { immediate: true },
)

function formatJson(value: unknown): string {
  return value ? JSON.stringify(value, null, 2) : '-'
}
</script>

<style scoped>
.panel-card {
  height: 100%;
  border-radius: var(--td-radius-extraLarge);
}

.jwt-output {
  margin: 0;
  min-height: 180px;
  overflow-wrap: anywhere;
  white-space: pre-wrap;
  border-radius: 12px;
  background: var(--td-bg-color-page);
  padding: 14px;
  font-family: var(--font-mono);
  line-height: 1.7;
}
</style>
