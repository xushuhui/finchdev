<template>
  <t-space direction="vertical" size="32px" style="width: 100%; display: flex; padding-top: 8px;">
    <t-card class="home-hero" :bordered="false">
      <t-row :gutter="[24, 24]" align="middle">
        <t-col :xs="12" :lg="8">
          <t-space direction="vertical" size="16px" style="width: 100%; display: flex;">
            <t-space wrap>
              <t-tag theme="primary" variant="light-outline">TDesign UI</t-tag>
              <t-tag theme="success" variant="light-outline">Browser only</t-tag>
              <t-tag theme="warning" variant="light-outline">Fast daily tools</t-tag>
            </t-space>

            <div>
              <h1 class="home-title">Developer Toolbelt</h1>
              <p class="home-subtitle">
                Practical frontend-first utilities for formatting, decoding, hashing,
                previewing, and validating developer data.
              </p>
            </div>

            <t-space wrap size="12px">
              <t-button theme="primary" size="large" @click="scrollToTools">Explore Tools</t-button>
              <t-button variant="outline" size="large" @click="router.push('/markdown-preview')">Open Markdown Preview</t-button>
            </t-space>
          </t-space>
        </t-col>

        <t-col :xs="12" :lg="4">
          <t-space direction="vertical" size="12px" style="width: 100%; display: flex;">
            <t-card v-for="stat in stats" :key="stat.label" class="stat-card" hover-shadow>
              <t-space justify="between" style="width: 100%; display: flex;">
                <span class="stat-value">{{ stat.value }}</span>
                <t-tag theme="primary" variant="light">{{ stat.label }}</t-tag>
              </t-space>
            </t-card>
          </t-space>
        </t-col>
      </t-row>
    </t-card>

    <t-row :gutter="[16, 16]">
      <t-col v-for="feature in features" :key="feature.title" :xs="12" :md="4">
        <t-card class="feature-card" :title="feature.title" hover-shadow>
          <p class="feature-text">{{ feature.text }}</p>
        </t-card>
      </t-col>
    </t-row>

    <t-card id="tool-grid" class="tool-grid-card" title="All Tools" hover-shadow>
      <template #actions>
        <t-tag theme="primary" variant="light-outline">{{ toolDefinitions.length }} available</t-tag>
      </template>

      <t-row :gutter="[20, 20]">
        <t-col v-for="tool in toolDefinitions" :key="tool.path" :xs="12" :sm="6" :xl="4">
          <t-card class="tool-card" hover-shadow @click="router.push(tool.path)">
            <t-space direction="vertical" size="16px" style="width: 100%; display: flex;">
              <t-space align="center" size="12px">
                <div class="tool-card-icon" v-html="tool.icon"></div>
                <t-tag theme="primary" variant="light-outline">Tool</t-tag>
              </t-space>

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

const stats = [
  { value: toolDefinitions.length, label: 'Tools' },
  { value: '100%', label: 'In browser' },
  { value: '0', label: 'Accounts' },
  { value: 'SSG', label: 'Deployment' },
]

const features = [
  {
    title: 'Consistent TDesign UI',
    text: 'Cards, buttons, alerts, menus, tags, and layout tokens stay visually aligned across the site.',
  },
  {
    title: 'Private local processing',
    text: 'Data conversion and decoding happen in the browser, which keeps the workflow simple and safer.',
  },
  {
    title: 'Responsive card layout',
    text: 'Desktop and mobile both keep a clear visual hierarchy without custom-heavy one-off sections.',
  },
]

function scrollToTools() {
  document.getElementById('tool-grid')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}
</script>

<style scoped>
.home-hero,
.feature-card,
.tool-grid-card,
.tool-card,
.stat-card {
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

.home-subtitle {
  max-width: 720px;
  margin: 16px 0 0;
  font-size: 18px;
  line-height: 1.8;
  color: var(--td-text-color-secondary);
}

.stat-card {
  background: var(--td-bg-color-container);
}

.stat-value {
  color: var(--td-brand-color);
  font-size: 28px;
  font-weight: 700;
}

.feature-text,
.tool-card-text {
  margin: 0;
  color: var(--td-text-color-secondary);
  line-height: 1.75;
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
