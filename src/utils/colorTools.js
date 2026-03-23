function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value))
}

function normalizeHex(value) {
  const match = value.trim().match(/^#?([0-9a-f]{3}|[0-9a-f]{6})$/i)
  if (!match) return null
  const raw = match[1]
  const full = raw.length === 3 ? raw.split('').map((char) => char + char).join('') : raw
  return full.toUpperCase()
}

function parseRgb(value) {
  const match = value.trim().match(/^rgb\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)$/i)
  if (!match) return null
  const rgb = match.slice(1).map(Number)
  if (rgb.some((channel) => channel < 0 || channel > 255)) return null
  return rgb
}

function parseHsl(value) {
  const match = value.trim().match(/^hsl\(\s*(-?\d{1,3}(?:\.\d+)?)\s*,\s*(\d{1,3}(?:\.\d+)?)%\s*,\s*(\d{1,3}(?:\.\d+)?)%\s*\)$/i)
  if (!match) return null
  const hue = ((Number(match[1]) % 360) + 360) % 360
  const saturation = Number(match[2])
  const lightness = Number(match[3])
  if (saturation < 0 || saturation > 100 || lightness < 0 || lightness > 100) return null
  return [hue, saturation, lightness]
}

function hexToRgb(hex) {
  return [
    Number.parseInt(hex.slice(0, 2), 16),
    Number.parseInt(hex.slice(2, 4), 16),
    Number.parseInt(hex.slice(4, 6), 16),
  ]
}

function hslToRgb(hue, saturation, lightness) {
  const s = saturation / 100
  const l = lightness / 100
  const c = (1 - Math.abs(2 * l - 1)) * s
  const x = c * (1 - Math.abs(((hue / 60) % 2) - 1))
  const m = l - c / 2
  let rgbPrime = [0, 0, 0]

  if (hue < 60) rgbPrime = [c, x, 0]
  else if (hue < 120) rgbPrime = [x, c, 0]
  else if (hue < 180) rgbPrime = [0, c, x]
  else if (hue < 240) rgbPrime = [0, x, c]
  else if (hue < 300) rgbPrime = [x, 0, c]
  else rgbPrime = [c, 0, x]

  return rgbPrime.map((channel) => Math.round((channel + m) * 255))
}

function rgbToHex(red, green, blue) {
  return `#${[red, green, blue].map((channel) => channel.toString(16).padStart(2, '0')).join('').toUpperCase()}`
}

function rgbToHsl(red, green, blue) {
  const r = red / 255
  const g = green / 255
  const b = blue / 255
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  const delta = max - min
  let hue = 0
  const lightness = (max + min) / 2
  const saturation = delta === 0 ? 0 : delta / (1 - Math.abs(2 * lightness - 1))

  if (delta !== 0) {
    if (max === r) hue = 60 * (((g - b) / delta) % 6)
    else if (max === g) hue = 60 * ((b - r) / delta + 2)
    else hue = 60 * ((r - g) / delta + 4)
  }

  return [Math.round((hue + 360) % 360), Math.round(saturation * 100), Math.round(lightness * 100)]
}

function rgbToCmyk(red, green, blue) {
  const r = red / 255
  const g = green / 255
  const b = blue / 255
  const black = 1 - Math.max(r, g, b)
  if (black === 1) return [0, 0, 0, 100]

  const cyan = ((1 - r - black) / (1 - black)) * 100
  const magenta = ((1 - g - black) / (1 - black)) * 100
  const yellow = ((1 - b - black) / (1 - black)) * 100
  return [cyan, magenta, yellow, black * 100].map((value) => Math.round(clamp(value, 0, 100)))
}

function parseToRgb(input) {
  const normalizedHex = normalizeHex(input)
  if (normalizedHex) return hexToRgb(normalizedHex)

  const rgb = parseRgb(input)
  if (rgb) return rgb

  const hsl = parseHsl(input)
  if (hsl) return hslToRgb(...hsl)

  return null
}

export function convertColor(input) {
  const rgb = parseToRgb(input)
  if (!rgb) {
    return { error: 'Unsupported color format.', hex: '', rgb: '', hsl: '', cmyk: '' }
  }

  const [red, green, blue] = rgb
  const [hue, saturation, lightness] = rgbToHsl(red, green, blue)
  const [cyan, magenta, yellow, black] = rgbToCmyk(red, green, blue)

  return {
    error: '',
    hex: rgbToHex(red, green, blue),
    rgb: `rgb(${red}, ${green}, ${blue})`,
    hsl: `hsl(${hue}, ${saturation}%, ${lightness}%)`,
    cmyk: `cmyk(${cyan}%, ${magenta}%, ${yellow}%, ${black}%)`,
  }
}
