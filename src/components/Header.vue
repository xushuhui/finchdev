<template>
  <t-head-menu
    class="site-head-menu"
    :theme="isDark ? 'dark' : 'light'"
    :value="currentValue"
    height="64px"
  >
    <template #logo>
      <RouterLink class="brand-link" to="/">
        <div class="brand-mark">
          <terminal-rectangle-icon size="18px" />
        </div>
        <span class="brand-title">FinchDev</span>
      </RouterLink>
    </template>

    <t-menu-item value="/" @click="router.push('/')">Home</t-menu-item>
    <t-menu-item
      v-for="tool in featuredTools"
      :key="tool.path"
      :value="tool.path"
      @click="router.push(tool.path)"
    >
      {{ tool.name }}
    </t-menu-item>

    <template #operations>
      <t-space align="center" size="8px">
        <t-dropdown :options="moreToolOptions" trigger="click" @click="handleToolJump">
          <t-button variant="outline" size="small">
            <template #icon>
              <menu-fold-icon />
            </template>
            More
          </t-button>
        </t-dropdown>

        <t-button class="theme-toggle" variant="text" shape="square" @click="toggleTheme">
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
import { TerminalRectangleIcon, ModeLightIcon, ModeDarkIcon, MenuFoldIcon } from 'tdesign-icons-vue-next'
import { toolDefinitions } from '../data/tools'
import { useTheme } from '../composables/useTheme'

const router = useRouter()
const route = useRoute()
const { isDark, toggleTheme } = useTheme()
const currentValue = computed(() => route.path)
const featuredTools = toolDefinitions.slice(0, 3)
const moreToolOptions = toolDefinitions.slice(3).map((tool) => ({ content: tool.name, value: tool.path }))

function handleToolJump(option) {
  if (option?.value) {
    router.push(option.value)
  }
}
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
  gap: 10px;
  text-decoration: none;
}

.brand-mark {
  display: inline-flex;
  height: 36px;
  width: 36px;
  align-items: center;
  justify-content: center;
  border-radius: var(--td-radius-large);
  background: var(--td-brand-color-light);
  color: var(--td-brand-color);
  flex-shrink: 0;
}

.brand-title {
  color: var(--td-text-color-primary);
  font-size: 17px;
  font-weight: 700;
  line-height: 1.2;
  white-space: nowrap;
}

.theme-toggle {
  height: 32px;
  width: 32px;
}

@media (max-width: 768px) {
  .brand-link {
    gap: 8px;
  }

  .brand-mark {
    height: 32px;
    width: 32px;
  }

  .brand-title {
    font-size: 16px;
  }

  :deep(.t-menu__item:nth-child(n + 4)) {
    display: none;
  }
}
</style>
