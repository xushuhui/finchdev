function normalizeBase64Url(value) {
  const normalized = value.replace(/-/g, '+').replace(/_/g, '/')
  const padding = normalized.length % 4
  return padding === 0 ? normalized : normalized.padEnd(normalized.length + (4 - padding), '=')
}

function decodeBase64Url(value) {
  const binary = atob(normalizeBase64Url(value))
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0))
  return {
    bytes,
    text: new TextDecoder().decode(bytes),
  }
}

function bytesToHex(bytes) {
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('')
}

export function decodeJwt(token, currentTime = Math.floor(Date.now() / 1000)) {
  const parts = token.trim().split('.')
  if (parts.length !== 3) {
    return {
      error: 'Invalid JWT format. Expected header.payload.signature.',
      header: null,
      payload: null,
      signatureHex: '',
      isExpired: false,
    }
  }

  try {
    const header = JSON.parse(decodeBase64Url(parts[0]).text)
    const payload = JSON.parse(decodeBase64Url(parts[1]).text)
    const signatureHex = bytesToHex(decodeBase64Url(parts[2]).bytes)
    const isExpired = typeof payload.exp === 'number' ? payload.exp < currentTime : false

    return {
      error: '',
      header,
      payload,
      signatureHex,
      isExpired,
    }
  } catch (error) {
    return {
      error: `Failed to decode JWT: ${error.message}`,
      header: null,
      payload: null,
      signatureHex: '',
      isExpired: false,
    }
  }
}
