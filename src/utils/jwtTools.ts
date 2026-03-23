interface JwtDecodeChunk {
  bytes: Uint8Array
  text: string
}

export interface JwtPayload {
  exp?: number
  [key: string]: unknown
}

export interface JwtDecodeResult {
  error: string
  header: Record<string, unknown> | null
  payload: JwtPayload | null
  signatureHex: string
  isExpired: boolean
}

function normalizeBase64Url(value: string): string {
  const normalized = value.replace(/-/g, '+').replace(/_/g, '/')
  const padding = normalized.length % 4
  return padding === 0 ? normalized : normalized.padEnd(normalized.length + (4 - padding), '=')
}

function decodeBase64Url(value: string): JwtDecodeChunk {
  const binary = atob(normalizeBase64Url(value))
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0))
  return {
    bytes,
    text: new TextDecoder().decode(bytes),
  }
}

function bytesToHex(bytes: Uint8Array): string {
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('')
}

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error)
}

export function decodeJwt(token: string, currentTime = Math.floor(Date.now() / 1000)): JwtDecodeResult {
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
    const header = JSON.parse(decodeBase64Url(parts[0]!).text) as Record<string, unknown>
    const payload = JSON.parse(decodeBase64Url(parts[1]!).text) as JwtPayload
    const signatureHex = bytesToHex(decodeBase64Url(parts[2]!).bytes)
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
      error: `Failed to decode JWT: ${getErrorMessage(error)}`,
      header: null,
      payload: null,
      signatureHex: '',
      isExpired: false,
    }
  }
}
