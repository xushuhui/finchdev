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

export function encodeUrl(input: string): StringResult {
  try {
    return success(encodeURIComponent(input))
  } catch (error) {
    return failure(`Encode failed: ${getErrorMessage(error)}`)
  }
}

export function decodeUrl(input: string): StringResult {
  if (!input) {
    return success('')
  }

  try {
    return success(decodeURIComponent(input))
  } catch {
    return failure('Invalid encoded URL input.')
  }
}
