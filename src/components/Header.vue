<template>
  <t-head-menu :theme="isDark ? 'dark' : 'light'" height="64px">
    <template #logo>
      <RouterLink to="/" style="display: flex; align-items: center; gap: 8px; text-decoration: none;">
        <terminal-rectangle-icon size="large" style="color: var(--td-brand-color)" />
        <span style="font-size: 20px; font-weight: bold; color: var(--td-text-color-primary)">FinchDev</span>
      </RouterLink>
    </template>

    <t-menu-item
      v-for="tool in toolDefinitions"
      :key="tool.path"
      :value="tool.path"
      @click="router.push(tool.path)"
    >
      {{ tool.name }}
    </t-menu-item>

    <template #operations>
      <t-button variant="text" shape="square" @click="toggleTheme">
        <template #icon>
          <mode-light-icon v-if="isDark" />
          <mode-dark-icon v-else />
        </template>
      </t-button>
    </template>
  </t-head-menu>
</template>

<script setup>
import { useRouter, RouterLink } from 'vue-router'
import { TerminalRectangleIcon, ModeLightIcon, ModeDarkIcon } from 'tdesign-icons-vue-next'
import { toolDefinitions } from '../data/tools'
import { useTheme } from '../composables/useTheme'

const router = useRouter()
const { isDark, toggleTheme } = useTheme()
</script>
