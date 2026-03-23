import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Components from 'unplugin-vue-components/vite'
import { getManualChunkName } from './src/build/chunking'
import { createTDesignResolver } from './src/build/tdesignResolver'

export default defineConfig({
  ssr: {
    noExternal: ['tdesign-vue-next', 'tdesign-icons-vue-next'],
  },
  plugins: [
    vue(),
    Components({
      resolvers: [createTDesignResolver()],
    }),
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          return getManualChunkName(id)
        },
      },
    },
  },
})
