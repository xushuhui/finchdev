import { writeFileSync } from 'node:fs'
import { toolDefinitions } from '../src/data/tools.js'

const baseUrl = 'https://finchdev.com'
const urls = ['/', ...toolDefinitions.map((tool) => tool.path)]

const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls
  .map((path) => {
    const priority = path === '/' ? '1.0' : '0.9'
    return `  <url>\n    <loc>${baseUrl}${path}</loc>\n    <priority>${priority}</priority>\n  </url>`
  })
  .join('\n')}\n</urlset>\n`

writeFileSync('public/sitemap.xml', xml)
console.log('sitemap generated for', urls.length, 'pages')
