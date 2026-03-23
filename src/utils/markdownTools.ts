interface MarkdownOverrides {
  parseMarkdown?: (value: string) => string
  sanitizeHtml?: (value: string) => string
}

export const DEFAULT_MARKDOWN = `# Markdown Preview\n\nWrite **Markdown** on the left and inspect the rendered HTML on the right.\n\n- Lists\n- Links\n- Code blocks\n\n> Safe preview with sanitization enabled.\n`

export function renderMarkdown(markdown: string, overrides: MarkdownOverrides = {}): string {
  const parseMarkdown = overrides.parseMarkdown ?? ((value: string) => value)
  const sanitizeHtml = overrides.sanitizeHtml ?? ((value: string) => value)
  return sanitizeHtml(parseMarkdown(markdown))
}
