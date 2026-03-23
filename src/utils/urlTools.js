function success(output) {
  return { output, error: '' }
}

function failure(error) {
  return { output: '', error }
}

export function encodeUrl(input) {
  try {
    return success(encodeURIComponent(input))
  } catch (error) {
    return failure(`Encode failed: ${error.message}`)
  }
}

export function decodeUrl(input) {
  if (!input) {
    return success('')
  }

  try {
    return success(decodeURIComponent(input))
  } catch {
    return failure('Invalid encoded URL input.')
  }
}
