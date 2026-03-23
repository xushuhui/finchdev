import type { RouteRecordRaw } from 'vue-router'

import { ViteSSG } from 'vite-ssg'

import './style.css'

import App from './App.vue'
import { initTheme } from './composables/useTheme'
import { routes } from './router'

export const createApp = ViteSSG(App, { routes: routes as unknown as RouteRecordRaw[] }, ({ isClient }) => {
  if (isClient) {
    initTheme()
  }
})
