import { computed, ref, type ComputedRef } from 'vue'

type ThemeMode = 'light' | 'dark'

interface ThemeController {
  isDark: ComputedRef<boolean>
  toggleTheme: () => void
}

const THEME_KEY = 'finchdev-theme'
const currentTheme = ref<ThemeMode>('light')

function applyTheme(value: ThemeMode): void {
  const root = document.documentElement
  root.classList.toggle('dark', value === 'dark')
  if (value === 'dark') {
    root.setAttribute('theme-mode', 'dark')
  } else {
    root.removeAttribute('theme-mode')
  }
}

export function initTheme(): void {
  const savedTheme = localStorage.getItem(THEME_KEY)
  const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  currentTheme.value = savedTheme === 'dark' || savedTheme === 'light' ? savedTheme : systemDark ? 'dark' : 'light'
  applyTheme(currentTheme.value)
}

export function useTheme(): ThemeController {
  const isDark = computed(() => currentTheme.value === 'dark')

  function toggleTheme(): void {
    currentTheme.value = isDark.value ? 'light' : 'dark'
    localStorage.setItem(THEME_KEY, currentTheme.value)
    applyTheme(currentTheme.value)
  }

  return {
    isDark,
    toggleTheme,
  }
}
