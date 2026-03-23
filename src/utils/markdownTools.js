export const DEFAULT_MARKDOWN = `# Markdown Preview\n\nWrite **Markdown** on the left and inspect the rendered HTML on the right.\n\n- Lists\n- Links\n- Code blocks\n\n> Safe preview with sanitization enabled.\n`

export function renderMarkdown(markdown, overrides = {}) {
  const parseMarkdown = overrides.parseMarkdown || ((value) => value)
  const sanitizeHtml = overrides.sanitizeHtml || ((value) => value)
  return sanitizeHtml(parseMarkdown(markdown))
}
