const encodeMap = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
} as const

const decodeMap = {
  '&amp;': '&',
  '&lt;': '<',
  '&gt;': '>',
  '&quot;': '"',
  '&#39;': "'",
} as const

type EncodableCharacter = keyof typeof encodeMap
type DecodableEntity = keyof typeof decodeMap

export function encodeHtmlEntities(input: string): string {
  return input.replace(/[&<>"']/g, (character) => encodeMap[character as EncodableCharacter])
}

export function decodeHtmlEntities(input: string): string {
  return input
    .replace(/&#(\d+);/g, (_match: string, code: string) => String.fromCharCode(Number(code)))
    .replace(/&(amp|lt|gt|quot|#39);/g, (entity) => decodeMap[entity as DecodableEntity])
}
