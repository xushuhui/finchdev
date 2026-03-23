interface TimestampConversionResult {
  error: string
  utc: string
  local: string
  seconds: string
  milliseconds: string
}

function failure(error: string): TimestampConversionResult {
  return { error, utc: '', local: '', seconds: '', milliseconds: '' }
}

export function timestampToDate(input: string | number): TimestampConversionResult {
  const raw = String(input).trim()
  if (!raw) {
    return failure('Please enter a timestamp.')
  }

  if (!/^-?\d+$/.test(raw)) {
    return failure('Timestamp must be a number.')
  }

  const numeric = Number(raw)
  const milliseconds = raw.length <= 10 ? numeric * 1000 : numeric
  const date = new Date(milliseconds)

  if (Number.isNaN(date.getTime())) {
    return failure('Invalid timestamp value.')
  }

  return {
    error: '',
    utc: date.toISOString(),
    local: date.toLocaleString(),
    seconds: '',
    milliseconds: '',
  }
}

export function dateToTimestamp(input: string): TimestampConversionResult {
  if (!input) {
    return failure('Please choose a date and time.')
  }

  const date = new Date(input)
  if (Number.isNaN(date.getTime())) {
    return failure('Invalid date input.')
  }

  return {
    error: '',
    utc: '',
    local: '',
    seconds: String(Math.floor(date.getTime() / 1000)),
    milliseconds: String(date.getTime()),
  }
}
