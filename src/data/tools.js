export const toolDefinitions = [
  {
    name: 'JSON Formatter',
    path: '/json-formatter',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-6 h-6"><path d="M4 22h14a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v4"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M10.5 14.5 8 17l2.5 2.5"/><path d="M13.5 14.5 16 17l-2.5 2.5"/></svg>',
    cardDescription: 'Format, validate, and minify JSON in your browser.',
    h1: 'JSON Formatter Online',
    title: 'JSON Formatter - Free Online Tool | FinchDev',
    description:
      'Format, validate, and minify JSON instantly with this free JSON formatter online from FinchDev.',
  },
  {
    name: 'Regex Tester',
    path: '/regex-tester',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-6 h-6"><path d="m22 7-3.5 4.6A2 2 0 0 1 15.3 12h-1.2"/><path d="M22 17v1a2 2 0 0 1-2 2h-1"/><path d="M14 20h-1a2 2 0 0 1-2-2v-1"/><path d="M11 4H2"/><path d="M11 8H2"/><path d="M11 12H2"/><path d="M11 16H2"/><path d="M11 20H2"/></svg>',
    cardDescription: 'Test regular expressions with live match highlighting.',
    h1: 'Regex Tester Online',
    title: 'Regex Tester - Free Online Tool | FinchDev',
    description:
      'Test regex patterns, flags, and live matches quickly with this free regex tester online.',
  },
  {
    name: 'Base64 Encode/Decode',
    path: '/base64',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-6 h-6"><path d="M2 12h20"/><path d="M20 12v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-8"/><path d="M4 12V4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8"/></svg>',
    cardDescription: 'Encode and decode Base64 strings in one click.',
    h1: 'Base64 Encode and Decode Online',
    title: 'Base64 Encode/Decode - Free Online Tool | FinchDev',
    description:
      'Encode text to Base64 or decode Base64 to plain text using this free online Base64 tool.',
  },
  {
    name: 'Unix Timestamp Converter',
    path: '/timestamp',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-6 h-6"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>',
    cardDescription: 'Convert epoch timestamps to readable dates and back.',
    h1: 'Unix Timestamp Converter Online',
    title: 'Unix Timestamp Converter - Free Online Tool | FinchDev',
    description:
      'Convert Unix epoch timestamps to UTC/local datetime and generate timestamps from dates.',
  },
  {
    name: 'URL Encode/Decode',
    path: '/url-encoder',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-6 h-6"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>',
    cardDescription: 'Encode URLs safely or decode percent-encoded text.',
    h1: 'URL Encode and Decode Online',
    title: 'URL Encode/Decode - Free Online Tool | FinchDev',
    description:
      'Encode URL components or decode encoded URLs instantly with this free online URL encoder.',
  },
]

export const routeMeta = Object.fromEntries(
  toolDefinitions.map((tool) => [
    tool.path,
    {
      title: tool.title,
      description: tool.description,
    },
  ]),
)

routeMeta['/'] = {
  title: 'Free Online Developer Tools | FinchDev',
  description:
    'FinchDev provides free online developer tools including JSON formatter, regex tester, Base64, timestamp, and URL encoder.',
}
