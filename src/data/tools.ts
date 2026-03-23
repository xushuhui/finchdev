import type { RouteMetaDefinition, ToolDefinition } from '../types/tools'

export const SITE_URL = 'https://www.finchdev.com'
export const SITE_NAME = 'FinchDev'

export const toolDefinitions: ToolDefinition[] = [
  {
    name: 'JSON Formatter',
    path: '/json-formatter',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 22h14a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v4"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M10.5 14.5 8 17l2.5 2.5"/><path d="M13.5 14.5 16 17l-2.5 2.5"/></svg>',
    cardDescription: 'Format, validate, and minify JSON in your browser.',
    h1: 'JSON Formatter Online',
    title: 'JSON Formatter - Free Online Tool | FinchDev',
    description: 'Format, validate, and minify JSON instantly with this free JSON formatter online from FinchDev.',
  },
  {
    name: 'Regex Tester',
    path: '/regex-tester',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m22 7-3.5 4.6A2 2 0 0 1 15.3 12h-1.2"/><path d="M22 17v1a2 2 0 0 1-2 2h-1"/><path d="M14 20h-1a2 2 0 0 1-2-2v-1"/><path d="M11 4H2"/><path d="M11 8H2"/><path d="M11 12H2"/><path d="M11 16H2"/><path d="M11 20H2"/></svg>',
    cardDescription: 'Test regular expressions with live match highlighting.',
    h1: 'Regex Tester Online',
    title: 'Regex Tester - Free Online Tool | FinchDev',
    description: 'Test regex patterns, flags, and live matches quickly with this free regex tester online.',
  },
  {
    name: 'Base64 Encode/Decode',
    path: '/base64',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12h20"/><path d="M20 12v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-8"/><path d="M4 12V4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8"/></svg>',
    cardDescription: 'Encode and decode Base64 strings in one click.',
    h1: 'Base64 Encode and Decode Online',
    title: 'Base64 Encode/Decode - Free Online Tool | FinchDev',
    description: 'Encode text to Base64 or decode Base64 to plain text using this free online Base64 tool.',
  },
  {
    name: 'Unix Timestamp Converter',
    path: '/timestamp',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>',
    cardDescription: 'Convert epoch timestamps to readable dates and back.',
    h1: 'Unix Timestamp Converter Online',
    title: 'Unix Timestamp Converter - Free Online Tool | FinchDev',
    description: 'Convert Unix epoch timestamps to UTC/local datetime and generate timestamps from dates.',
  },
  {
    name: 'URL Encode/Decode',
    path: '/url-encoder',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>',
    cardDescription: 'Encode URLs safely or decode percent-encoded text.',
    h1: 'URL Encode and Decode Online',
    title: 'URL Encode/Decode - Free Online Tool | FinchDev',
    description: 'Encode URL components or decode encoded URLs instantly with this free online URL encoder.',
  },
  {
    name: 'Hash Generator',
    path: '/hash-generator',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 9h16"/><path d="M4 15h16"/><path d="M10 3 8 21"/><path d="M16 3l-2 18"/></svg>',
    cardDescription: 'Generate MD5, SHA-1, SHA-256 and SHA-512 hashes from text.',
    h1: 'Hash Generator Online',
    title: 'Hash Generator - Free Online Tool | FinchDev',
    description: 'Generate MD5, SHA-1, SHA-256 and SHA-512 hashes from text instantly with this free online hash generator.',
  },
  {
    name: 'UUID Generator',
    path: '/uuid-generator',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/></svg>',
    cardDescription: 'Generate random UUID v4 identifiers instantly.',
    h1: 'UUID Generator Online',
    title: 'UUID Generator - Free Online Tool | FinchDev',
    description: 'Generate random UUID v4 identifiers instantly with this free online UUID generator.',
  },
  {
    name: 'Color Converter',
    path: '/color-converter',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="13.5" cy="6.5" r="2.5"/><circle cx="17.5" cy="10.5" r="2.5"/><circle cx="8.5" cy="7.5" r="2.5"/><circle cx="6.5" cy="13.5" r="2.5"/><path d="M12 22a10 10 0 1 1 10-10c0 1.3-.84 2.15-2 2.15h-1.4c-1.27 0-2.1.94-2.1 2.1 0 1.16.94 2.1 2.1 2.1.85 0 1.4.55 1.4 1.4A2.25 2.25 0 0 1 17.75 22Z"/></svg>',
    cardDescription: 'Convert colors between HEX, RGB, HSL and CMYK.',
    h1: 'Color Converter Online',
    title: 'Color Converter - Free Online Tool | FinchDev',
    description: 'Convert colors between HEX, RGB, HSL and CMYK formats with this free online color converter.',
  },
  {
    name: 'JWT Decoder',
    path: '/jwt-decoder',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3 4 7v6c0 5 3.5 7.5 8 8 4.5-.5 8-3 8-8V7l-8-4Z"/><path d="M9 12h6"/><path d="M12 9v6"/></svg>',
    cardDescription: 'Decode and inspect JWT token header and payload.',
    h1: 'JWT Decoder Online',
    title: 'JWT Decoder - Free Online Tool | FinchDev',
    description: 'Decode and inspect JWT tokens, view header and payload claims with this free online JWT decoder.',
  },
  {
    name: 'Markdown Preview',
    path: '/markdown-preview',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 4h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z"/><path d="M7 15V9l3 3 3-3v6"/><path d="M17 15h-2"/></svg>',
    cardDescription: 'Write and preview Markdown with live rendering.',
    h1: 'Markdown Preview Online',
    title: 'Markdown Preview - Free Online Tool | FinchDev',
    description: 'Write and preview Markdown with live rendering, syntax highlighting and export support.',
  },
  {
    name: 'Cron Expression Generator',
    path: '/cron-generator',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 8v4l3 3"/><circle cx="12" cy="12" r="9"/></svg>',
    cardDescription: 'Build cron expressions with quick presets and readable summaries.',
    h1: 'Cron Expression Generator Online',
    title: 'Cron Expression Generator - Free Online Tool | FinchDev',
    description: 'Generate cron expressions with presets, field controls, and plain-English summaries using this free online cron generator.',
  },
  {
    name: 'QR Code Generator',
    path: '/qr-code-generator',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><path d="M14 14h3v3h-3z"/><path d="M20 14v7"/><path d="M14 20h3"/></svg>',
    cardDescription: 'Generate downloadable QR codes from text or URLs instantly.',
    h1: 'QR Code Generator Online',
    title: 'QR Code Generator - Free Online Tool | FinchDev',
    description: 'Create QR codes for URLs, text, and other content with this free online QR code generator.',
  },
  {
    name: 'YAML JSON Converter',
    path: '/yaml-json-converter',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 6h8"/><path d="M8 12h8"/><path d="M8 18h5"/><path d="m16 15 3 3-3 3"/></svg>',
    cardDescription: 'Convert YAML to JSON or JSON to YAML with validation.',
    h1: 'YAML JSON Converter Online',
    title: 'YAML JSON Converter - Free Online Tool | FinchDev',
    description: 'Convert YAML to JSON or JSON to YAML instantly with this free online YAML and JSON converter.',
  },
  {
    name: 'Diff Checker',
    path: '/diff-checker',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v18"/><path d="M5 8h4"/><path d="M5 16h4"/><path d="M15 8h4"/><path d="M15 16h4"/></svg>',
    cardDescription: 'Compare two texts line by line and inspect additions or removals.',
    h1: 'Diff Checker Online',
    title: 'Diff Checker - Free Online Tool | FinchDev',
    description: 'Compare two texts with line-by-line highlighting using this free online diff checker.',
  },
  {
    name: 'HTML Entity Encoder',
    path: '/html-entity-encoder',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 8 4 12l4 4"/><path d="M16 8l4 4-4 4"/><path d="M13 5 11 19"/></svg>',
    cardDescription: 'Encode or decode HTML entities for safe markup output.',
    h1: 'HTML Entity Encoder Online',
    title: 'HTML Entity Encoder - Free Online Tool | FinchDev',
    description: 'Encode and decode HTML entities instantly with this free online HTML entity encoder.',
  },
]

export const routeMeta: Record<string, RouteMetaDefinition> = Object.fromEntries(
  toolDefinitions.map((tool) => [
    tool.path,
    {
      title: tool.title,
      description: tool.description,
      url: `${SITE_URL}${tool.path}`,
    },
  ]),
)

routeMeta['/'] = {
  title: 'Free Online Developer Tools | FinchDev',
  description: 'FinchDev provides free online developer tools including JSON formatter, regex tester, Base64, timestamp, URL encoder, hash generator, UUID generator, color converter, JWT decoder, markdown preview, cron generator, QR code generator, YAML JSON converter, diff checker, and HTML entity encoder.',
  url: SITE_URL,
}

export function getToolDefinition(path: ToolDefinition['path']): ToolDefinition {
  const tool = toolDefinitions.find((item) => item.path === path)
  if (!tool) {
    throw new Error(`Missing tool definition: ${path}`)
  }
  return tool
}

export function getRouteMeta(path: string): RouteMetaDefinition {
  const meta = routeMeta[path]
  if (!meta) {
    throw new Error(`Missing route meta: ${path}`)
  }
  return meta
}
