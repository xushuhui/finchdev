export interface UuidOptions {
  uppercase?: boolean
  hyphenated?: boolean
}

type RandomBytesGenerator = () => Uint8Array

function defaultRandomBytes(): Uint8Array {
  return crypto.getRandomValues(new Uint8Array(16))
}

function formatUuid(bytes: Uint8Array, options: UuidOptions): string {
  const normalized = Uint8Array.from(bytes)
  normalized[6] = ((normalized[6] ?? 0) & 0x0f) | 0x40
  normalized[8] = ((normalized[8] ?? 0) & 0x3f) | 0x80

  const hex = Array.from(normalized, (byte) => byte.toString(16).padStart(2, '0')).join('')
  const hyphenated = options.hyphenated !== false
  let value = hyphenated
    ? `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`
    : hex

  if (options.uppercase) {
    value = value.toUpperCase()
  }

  return value
}

export function generateUuid(options: UuidOptions = {}, randomBytes: RandomBytesGenerator = defaultRandomBytes): string {
  return formatUuid(randomBytes(), options)
}

export function generateUuidBatch(
  count: string | number,
  options: UuidOptions = {},
  randomBytes: RandomBytesGenerator = defaultRandomBytes,
): string[] {
  const safeCount = Math.min(100, Math.max(1, Number(count) || 1))
  return Array.from({ length: safeCount }, () => generateUuid(options, randomBytes))
}
