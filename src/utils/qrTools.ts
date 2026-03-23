interface QrOptionsInput {
  width?: number
  margin?: number
}

interface QrOptions {
  width: number
  margin: number
}

type QrGenerator = (value: string, options: QrOptions) => Promise<string>

export function normalizeQrOptions(options: QrOptionsInput = {}): QrOptions {
  return {
    width: Math.min(1024, Math.max(128, Number(options.width) || 256)),
    margin: Math.min(10, Math.max(0, Number(options.margin) || 2)),
  }
}

export async function createQrCode(text: string, options: QrOptionsInput = {}, generator?: QrGenerator): Promise<string> {
  const makeQrCode: QrGenerator =
    generator ??
    ((value, normalizedOptions) => import('qrcode').then((module) => module.toDataURL(value, normalizedOptions)))

  return makeQrCode(text, normalizeQrOptions(options))
}
