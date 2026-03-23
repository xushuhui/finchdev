import { ViteSSG } from 'vite-ssg'
import TDesign from 'tdesign-vue-next'

// Import TDesign standard styles
import 'tdesign-vue-next/es/style/index.css'
import './style.css'

import App from './App.vue'
import { initTheme } from './composables/useTheme'
import { routes } from './router'

export const createApp = ViteSSG(App, { routes }, ({ app, isClient }) => {
  app.use(TDesign)

  if (isClient) {
    initTheme()
  }
})
