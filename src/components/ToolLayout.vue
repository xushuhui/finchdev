<template>
  <t-space direction="vertical" size="32px" style="width: 100%; display: flex;">
    <header>
      <h1 style="font-size: 32px; font-weight: bold; margin-bottom: 8px;">{{ title }}</h1>
      <p style="color: var(--td-text-color-secondary); font-size: 16px;">
        <slot name="lead">Fast and private. Everything runs in your browser.</slot>
      </p>
    </header>

    <t-card :bordered="true" shadow style="padding: 16px;">
      <slot />
    </t-card>

    <!-- AdSense slot placeholder -->

    <t-row :gutter="[32, 32]">
      <t-col :xs="12" :md="6">
        <t-space direction="vertical" size="16px">
          <h2 style="font-size: 20px; font-weight: bold; display: flex; align-items: center; gap: 8px;">
            <info-circle-icon style="color: var(--td-brand-color)" />
            How to use
          </h2>
          <div style="font-size: 14px; line-height: 1.6; color: var(--td-text-color-secondary)">
            <slot name="usage" />
          </div>
        </t-space>
      </t-col>

      <t-col :xs="12" :md="6">
        <t-space direction="vertical" size="16px">
          <h2 style="font-size: 20px; font-weight: bold; display: flex; align-items: center; gap: 8px;">
            <help-circle-icon style="color: var(--td-brand-color)" />
            FAQ
          </h2>
          <t-collapse :borderless="true">
            <slot name="faq" />
          </t-collapse>
        </t-space>
      </t-col>
    </t-row>
  </t-space>
</template>

<script setup>
import { InfoCircleIcon, HelpCircleIcon } from 'tdesign-icons-vue-next'

defineProps({
  title: {
    type: String,
    required: true,
  },
})
</script>
