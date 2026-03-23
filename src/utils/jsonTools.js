function success(output) {
  return { output, error: '' }
}

function failure(error) {
  return { output: '', error }
}

export function formatJson(input) {
  if (!input.trim()) {
    return success('')
  }

  try {
    const parsed = JSON.parse(input)
    return success(JSON.stringify(parsed, null, 2))
  } catch (error) {
    return failure(`Invalid JSON: ${error.message}`)
  }
}

export function minifyJson(input) {
  if (!input.trim()) {
    return success('')
  }

  try {
    const parsed = JSON.parse(input)
    return success(JSON.stringify(parsed))
  } catch (error) {
    return failure(`Invalid JSON: ${error.message}`)
  }
}
