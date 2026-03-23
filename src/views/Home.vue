<template>
  <t-space direction="vertical" size="48px" style="width: 100%; display: flex;">
    <header style="text-align: left;">
      <h1 style="font-size: 40px; font-weight: bold; margin-bottom: 16px;">
        Free Online Developer Tools
      </h1>
      <p style="font-size: 18px; color: var(--td-text-color-secondary); max-width: 800px;">
        Professional, fast and private developer utilities. Everything runs entirely in your browser.
      </p>
    </header>

    <t-row :gutter="[24, 24]">
      <t-col v-for="tool in toolDefinitions" :key="tool.path" :xs="12" :sm="6" :lg="4">
        <t-card
          class="t-card-tool"
          shadow
          @click="router.push(tool.path)"
          style="cursor: pointer; height: 100%; transition: all 0.3s;"
        >
          <template #header>
            <div style="display: flex; align-items: center; gap: 12px;">
              <div class="tool-icon-wrapper" v-html="tool.icon"></div>
              <span style="font-size: 18px; font-weight: bold;">{{ tool.name }}</span>
            </div>
          </template>
          <p style="font-size: 14px; color: var(--td-text-color-secondary); line-height: 1.6;">
            {{ tool.cardDescription }}
          </p>
          <template #footer>
            <div style="color: var(--td-brand-color); font-weight: bold; display: flex; align-items: center; gap: 4px;">
              Open Tool
              <chevron-right-icon size="small" />
            </div>
          </template>
        </t-card>
      </t-col>
    </t-row>
  </t-space>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { ChevronRightIcon } from 'tdesign-icons-vue-next'
import { useSeoHead } from '../composables/useSeoHead'
import { routeMeta, toolDefinitions } from '../data/tools'

const router = useRouter()

useSeoHead(routeMeta['/'])
</script>

<style scoped>
.tool-icon-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 6px;
  background-color: var(--td-bg-color-component-hover);
  color: var(--td-brand-color);
  transition: all 0.3s;
}

.t-card-tool:hover {
  border-color: var(--td-brand-color);
}

.t-card-tool:hover .tool-icon-wrapper {
  background-color: var(--td-brand-color);
  color: #fff;
}
</style>
