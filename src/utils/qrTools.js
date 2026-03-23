export function normalizeQrOptions(options = {}) {
  return {
    width: Math.min(1024, Math.max(128, Number(options.width) || 256)),
    margin: Math.min(10, Math.max(0, Number(options.margin) || 2)),
  }
}

export async function createQrCode(text, options = {}, generator) {
  const makeQrCode = generator || ((value, normalizedOptions) => import('qrcode').then((module) => module.toDataURL(value, normalizedOptions)))
  return makeQrCode(text, normalizeQrOptions(options))
}
