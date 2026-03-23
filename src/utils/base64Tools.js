const encoder = new TextEncoder()
const decoder = new TextDecoder()

function success(output) {
  return { output, error: '' }
}

function failure(error) {
  return { output: '', error }
}

function bytesToBase64(bytes) {
  let binary = ''
  for (const byte of bytes) {
    binary += String.fromCharCode(byte)
  }
  return btoa(binary)
}

function base64ToBytes(base64) {
  const binary = atob(base64)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i)
  }
  return bytes
}

function isValidBase64(value) {
  return /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(value)
}

export function encodeBase64(input) {
  try {
    return success(bytesToBase64(encoder.encode(input)))
  } catch (error) {
    return failure(`Encode failed: ${error.message}`)
  }
}

export function decodeBase64(input) {
  if (!input.trim()) {
    return success('')
  }

  const normalized = input.replace(/\s+/g, '')
  if (!isValidBase64(normalized)) {
    return failure('Invalid Base64 input.')
  }

  try {
    return success(decoder.decode(base64ToBytes(normalized)))
  } catch (error) {
    return failure(`Decode failed: ${error.message}`)
  }
}
