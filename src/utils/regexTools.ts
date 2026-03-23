export interface RegexMatch {
  value: string
  index: number
}

export interface RegexTestResult {
  matches: RegexMatch[]
  summary: string
  error: string
}

function emptyResult(summary = 'No matches found.'): RegexTestResult {
  return { matches: [], summary, error: '' }
}

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error)
}

export function testRegex(pattern: string, flags: string, text: string): RegexTestResult {
  if (!pattern) {
    return emptyResult('Enter a regex pattern to start testing.')
  }

  try {
    const normalizedFlags = [...new Set((flags || '').split(''))].join('')
    const regex = new RegExp(pattern, normalizedFlags)
    const matches: RegexMatch[] = []

    if (regex.global) {
      for (const match of text.matchAll(regex)) {
        matches.push({ value: match[0] ?? '', index: match.index ?? 0 })
      }
    } else {
      const match = regex.exec(text)
      if (match) {
        matches.push({ value: match[0] ?? '', index: match.index ?? 0 })
      }
    }

    const count = matches.length
    const summary = count === 0 ? 'No matches found.' : `Found ${count} match${count > 1 ? 'es' : ''}.`

    return { matches, summary, error: '' }
  } catch (error) {
    return { matches: [], summary: 'Regex validation failed.', error: `Invalid regex: ${getErrorMessage(error)}` }
  }
}
