interface StringResult {
  output: string
  error: string
}

function success(output: string): StringResult {
  return { output, error: '' }
}

function failure(error: string): StringResult {
  return { output: '', error }
}

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error)
}

export function formatJson(input: string): StringResult {
  if (!input.trim()) {
    return success('')
  }

  try {
    const parsed = JSON.parse(input) as unknown
    return success(JSON.stringify(parsed, null, 2))
  } catch (error) {
    return failure(`Invalid JSON: ${getErrorMessage(error)}`)
  }
}

export function minifyJson(input: string): StringResult {
  if (!input.trim()) {
    return success('')
  }

  try {
    const parsed = JSON.parse(input) as unknown
    return success(JSON.stringify(parsed))
  } catch (error) {
    return failure(`Invalid JSON: ${getErrorMessage(error)}`)
  }
}
