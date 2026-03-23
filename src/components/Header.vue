<template>
  <t-head-menu
    class="site-head-menu"
    :theme="isDark ? 'dark' : 'light'"
    height="72px"
    :value="currentValue"
  >
    <template #logo>
      <RouterLink class="brand-link" to="/">
        <div class="brand-mark">
          <terminal-rectangle-icon size="20px" />
        </div>
        <t-space direction="vertical" size="2px">
          <span class="brand-title">FinchDev</span>
          <span class="brand-subtitle">Online developer tools</span>
        </t-space>
      </RouterLink>
    </template>

    <t-menu-item value="/" @click="router.push('/')">Home</t-menu-item>
    <t-menu-item
      v-for="tool in toolDefinitions"
      :key="tool.path"
      :value="tool.path"
      @click="router.push(tool.path)"
    >
      {{ tool.name }}
    </t-menu-item>

    <template #operations>
      <t-space align="center" size="12px">
        <t-tag theme="primary" variant="light-outline">{{ toolDefinitions.length }} tools</t-tag>
        <t-button variant="text" shape="square" @click="toggleTheme">
          <template #icon>
            <mode-light-icon v-if="isDark" />
            <mode-dark-icon v-else />
          </template>
        </t-button>
      </t-space>
    </template>
  </t-head-menu>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter, useRoute, RouterLink } from 'vue-router'
import { TerminalRectangleIcon, ModeLightIcon, ModeDarkIcon } from 'tdesign-icons-vue-next'
import { toolDefinitions } from '../data/tools'
import { useTheme } from '../composables/useTheme'

const router = useRouter()
const route = useRoute()
const { isDark, toggleTheme } = useTheme()
const currentValue = computed(() => route.path)
</script>

<style scoped>
.site-head-menu {
  border-bottom: 1px solid var(--td-component-border);
  background: color-mix(in srgb, var(--td-bg-color-container) 92%, transparent);
  backdrop-filter: blur(10px);
}

.brand-link {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  text-decoration: none;
}

.brand-mark {
  display: inline-flex;
  height: 40px;
  width: 40px;
  align-items: center;
  justify-content: center;
  border-radius: var(--td-radius-large);
  background: var(--td-brand-color-light);
  color: var(--td-brand-color);
}

.brand-title {
  color: var(--td-text-color-primary);
  font-size: 18px;
  font-weight: 700;
  line-height: 1.2;
}

.brand-subtitle {
  color: var(--td-text-color-placeholder);
  font-size: 12px;
  line-height: 1.2;
}
</style>
