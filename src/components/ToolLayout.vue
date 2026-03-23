<template>
  <t-space direction="vertical" size="32px" style="width: 100%; display: flex;">
    <t-card class="tool-hero-card" :bordered="false">
      <t-space direction="vertical" size="16px" style="width: 100%; display: flex;">
        <t-space wrap>
          <t-tag theme="primary" variant="light-outline">Browser-based</t-tag>
          <t-tag theme="success" variant="light-outline">Private</t-tag>
          <t-tag theme="warning" variant="light-outline">No signup</t-tag>
        </t-space>

        <div>
          <h1 class="tool-title">{{ title }}</h1>
          <p class="tool-lead">
            <slot name="lead">Fast and private. Everything runs in your browser.</slot>
          </p>
        </div>

        <t-divider style="margin: 0" />

        <p class="tool-caption">
          Built with TDesign components and tokens for a consistent, clean workflow.
        </p>
      </t-space>
    </t-card>

    <t-card class="tool-content-card" hover-shadow>
      <slot />
    </t-card>

    <t-alert theme="info" variant="light-outline" class="tool-alert">
      <template #message>
        <strong>Private by default:</strong> your input stays in the browser and is never uploaded by FinchDev.
      </template>
    </t-alert>

    <t-row :gutter="[24, 24]">
      <t-col :xs="12" :lg="7">
        <t-card class="tool-side-card" title="How to use" hover-shadow>
          <slot name="usage" />
        </t-card>
      </t-col>
      <t-col :xs="12" :lg="5">
        <t-card class="tool-side-card" title="FAQ" hover-shadow>
          <t-collapse>
            <slot name="faq" />
          </t-collapse>
        </t-card>
      </t-col>
    </t-row>
  </t-space>
</template>

<script setup lang="ts">
defineProps<{
  title: string
}>()
</script>

<style scoped>
.tool-hero-card,
.tool-content-card,
.tool-side-card,
.tool-alert {
  border-radius: var(--td-radius-extraLarge);
}

.tool-hero-card {
  background: linear-gradient(180deg, var(--td-bg-color-container), var(--td-bg-color-container-hover));
}

.tool-title {
  margin: 0;
  font-size: clamp(32px, 5vw, 44px);
  font-weight: 700;
  line-height: 1.1;
  color: var(--td-text-color-primary);
}

.tool-lead {
  max-width: 820px;
  margin: 14px 0 0;
  font-size: 16px;
  line-height: 1.8;
  color: var(--td-text-color-secondary);
}

.tool-caption {
  margin: 0;
  color: var(--td-text-color-placeholder);
  font-size: 13px;
}
</style>
