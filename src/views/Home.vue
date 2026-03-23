<template>
  <t-space direction="vertical" size="32px" style="width: 100%; display: flex; padding-top: 8px;">
    <t-card class="home-hero" :bordered="false">
      <t-space direction="vertical" size="16px" style="width: 100%; display: flex;">
        <div>
          <h1 class="home-title">Developer Toolbelt</h1>
          <p class="home-subtitle">
            Practical frontend-first utilities for formatting, decoding, hashing,
            previewing, and validating developer data.
          </p>
        </div>

        <t-space wrap size="12px">
          <t-button theme="primary" size="large" @click="scrollToTools">Browse Tools</t-button>
          <t-button variant="outline" size="large" @click="router.push('/markdown-preview')">Try Markdown</t-button>
        </t-space>
      </t-space>
    </t-card>

    <t-card id="tool-grid" class="tool-grid-card" title="All Tools" hover-shadow>
      <template #actions>
        <t-tag theme="primary" variant="light-outline">{{ toolDefinitions.length }} available</t-tag>
      </template>

      <t-row :gutter="[20, 20]">
        <t-col v-for="tool in toolDefinitions" :key="tool.path" :xs="12" :sm="6" :xl="4">
          <t-card class="tool-card" hover-shadow @click="router.push(tool.path)">
            <t-space direction="vertical" size="16px" style="width: 100%; display: flex;">
              <div class="tool-card-icon" v-html="tool.icon"></div>

              <div>
                <h2 class="tool-card-title">{{ tool.name }}</h2>
                <p class="tool-card-text">{{ tool.cardDescription }}</p>
              </div>

              <t-divider style="margin: 0" />

              <t-button theme="primary" variant="text" class="tool-card-action">
                Open Tool
              </t-button>
            </t-space>
          </t-card>
        </t-col>
      </t-row>
    </t-card>
  </t-space>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useSeoHead } from '../composables/useSeoHead'
import { routeMeta, toolDefinitions } from '../data/tools'

const router = useRouter()
useSeoHead(routeMeta['/'])

function scrollToTools() {
  document.getElementById('tool-grid')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}
</script>

<style scoped>
.home-hero,
.tool-grid-card,
.tool-card {
  border-radius: var(--td-radius-extraLarge);
}

.home-hero {
  background: linear-gradient(180deg, var(--td-bg-color-container), var(--td-bg-color-container-hover));
}

.home-title {
  margin: 0;
  font-size: clamp(40px, 6vw, 56px);
  line-height: 1.05;
  font-weight: 700;
  color: var(--td-text-color-primary);
}

.home-subtitle,
.tool-card-text {
  color: var(--td-text-color-secondary);
  line-height: 1.75;
}

.home-subtitle {
  max-width: 720px;
  margin: 16px 0 0;
  font-size: 18px;
}

.tool-card {
  height: 100%;
  cursor: pointer;
  transition: transform 0.2s ease;
}

.tool-card:hover {
  transform: translateY(-4px);
}

.tool-card-title {
  margin: 0 0 10px;
  color: var(--td-text-color-primary);
  font-size: 20px;
  font-weight: 700;
}

.tool-card-icon {
  display: inline-flex;
  height: 52px;
  width: 52px;
  align-items: center;
  justify-content: center;
  border-radius: var(--td-radius-large);
  background: var(--td-brand-color-light);
  color: var(--td-brand-color);
}

.tool-card-action {
  padding-left: 0;
}

@media (max-width: 768px) {
  .home-subtitle {
    font-size: 16px;
  }
}
</style>
