const VUE_CHUNK_PATTERNS = ['/node_modules/vue/', '/node_modules/@vue/', '/node_modules/vue-router/']
const TDESIGN_CHUNK_PATTERNS = ['/node_modules/tdesign-vue-next/', '/node_modules/tdesign-icons-vue-next/']
const MARKDOWN_CHUNK_PATTERNS = ['/node_modules/marked/', '/node_modules/dompurify/']
const TOOL_LIBRARY_CHUNK_PATTERNS = ['/node_modules/qrcode/', '/node_modules/js-yaml/', '/node_modules/diff/']

function matchesAnyPattern(id: string, patterns: string[]): boolean {
  return patterns.some((pattern) => id.includes(pattern))
}

export function getManualChunkName(id: string): string | undefined {
  if (!id.includes('/node_modules/')) {
    return undefined
  }

  if (matchesAnyPattern(id, VUE_CHUNK_PATTERNS)) {
    return 'vue-core'
  }

  if (matchesAnyPattern(id, TDESIGN_CHUNK_PATTERNS)) {
    return 'tdesign'
  }

  if (matchesAnyPattern(id, MARKDOWN_CHUNK_PATTERNS)) {
    return 'markdown-stack'
  }

  if (matchesAnyPattern(id, TOOL_LIBRARY_CHUNK_PATTERNS)) {
    return 'tool-libs'
  }

  return undefined
}
