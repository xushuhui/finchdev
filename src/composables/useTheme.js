import { computed, ref } from 'vue'

const THEME_KEY = 'finchdev-theme'
const currentTheme = ref('light')

function applyTheme(value) {
  const root = document.documentElement
  root.classList.toggle('dark', value === 'dark')
  if (value === 'dark') {
    root.setAttribute('theme-mode', 'dark')
  } else {
    root.removeAttribute('theme-mode')
  }
}

export function initTheme() {
  const savedTheme = localStorage.getItem(THEME_KEY)
  const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  currentTheme.value = savedTheme || (systemDark ? 'dark' : 'light')
  applyTheme(currentTheme.value)
}

export function useTheme() {
  const isDark = computed(() => currentTheme.value === 'dark')

  function toggleTheme() {
    currentTheme.value = isDark.value ? 'light' : 'dark'
    localStorage.setItem(THEME_KEY, currentTheme.value)
    applyTheme(currentTheme.value)
  }

  return {
    isDark,
    toggleTheme,
  }
}
