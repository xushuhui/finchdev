interface StringResult {
  output: string
  error: string
}

const encoder = new TextEncoder()
const decoder = new TextDecoder()

function success(output: string): StringResult {
  return { output, error: '' }
}

function failure(error: string): StringResult {
  return { output: '', error }
}

function bytesToBase64(bytes: Uint8Array): string {
  let binary = ''
  for (const byte of bytes) {
    binary += String.fromCharCode(byte)
  }
  return btoa(binary)
}

function base64ToBytes(base64: string): Uint8Array {
  const binary = atob(base64)
  const bytes = new Uint8Array(binary.length)
  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index)
  }
  return bytes
}

function isValidBase64(value: string): boolean {
  return /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(value)
}

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error)
}

export function encodeBase64(input: string): StringResult {
  try {
    return success(bytesToBase64(encoder.encode(input)))
  } catch (error) {
    return failure(`Encode failed: ${getErrorMessage(error)}`)
  }
}

export function decodeBase64(input: string): StringResult {
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
    return failure(`Decode failed: ${getErrorMessage(error)}`)
  }
}
