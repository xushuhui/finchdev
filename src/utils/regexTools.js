function emptyResult(summary = 'No matches found.') {
  return { matches: [], summary, error: '' }
}

export function testRegex(pattern, flags, text) {
  if (!pattern) {
    return emptyResult('Enter a regex pattern to start testing.')
  }

  try {
    const normalizedFlags = [...new Set((flags || '').split(''))].join('')
    const regex = new RegExp(pattern, normalizedFlags)
    const matches = []

    if (regex.global) {
      for (const match of text.matchAll(regex)) {
        matches.push({ value: match[0], index: match.index ?? 0 })
      }
    } else {
      const match = regex.exec(text)
      if (match) {
        matches.push({ value: match[0], index: match.index ?? 0 })
      }
    }

    const count = matches.length
    const summary = count === 0 ? 'No matches found.' : `Found ${count} match${count > 1 ? 'es' : ''}.`

    return { matches, summary, error: '' }
  } catch (error) {
    return { matches: [], summary: 'Regex validation failed.', error: `Invalid regex: ${error.message}` }
  }
}
