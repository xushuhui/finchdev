import { readdirSync, readFileSync, statSync, existsSync } from 'node:fs'
import path from 'node:path'

const projectRoot = process.cwd()
const frontendRoots = [path.join(projectRoot, 'src')]
const disallowedExtensions = new Set(['.js', '.jsx'])
const rootLevelFrontendFiles = ['vite.config.js', 'vite.config.jsx']
const violations = []

function walk(directory) {
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const fullPath = path.join(directory, entry.name)
    if (entry.isDirectory()) {
      walk(fullPath)
      continue
    }

    const extension = path.extname(entry.name)
    if (disallowedExtensions.has(extension)) {
      violations.push(`Disallowed frontend JavaScript file: ${path.relative(projectRoot, fullPath)}`)
      continue
    }

    if (extension === '.vue') {
      const source = readFileSync(fullPath, 'utf8')
      const scriptTags = [...source.matchAll(/<script\b([^>]*)>/g)]
      for (const match of scriptTags) {
        const attributes = match[1] ?? ''
        const hasTypeScript = /\blang\s*=\s*["']tsx?["']/.test(attributes)
        if (!hasTypeScript) {
          violations.push(`Vue script must use lang=\"ts\": ${path.relative(projectRoot, fullPath)}`)
          break
        }
      }
    }
  }
}

for (const directory of frontendRoots) {
  if (existsSync(directory) && statSync(directory).isDirectory()) {
    walk(directory)
  }
}

for (const relativeFile of rootLevelFrontendFiles) {
  const fullPath = path.join(projectRoot, relativeFile)
  if (existsSync(fullPath)) {
    violations.push(`Disallowed frontend JavaScript file: ${relativeFile}`)
  }
}

if (violations.length > 0) {
  console.error('Frontend TypeScript policy violations found:')
  for (const violation of violations) {
    console.error(`- ${violation}`)
  }
  process.exit(1)
}

console.log('Frontend TypeScript policy check passed.')
