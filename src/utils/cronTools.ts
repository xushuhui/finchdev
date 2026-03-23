export interface CronParts {
  minute: string
  hour: string
  dayOfMonth: string
  month: string
  dayOfWeek: string
}

function padTime(value: string): string {
  return String(value).padStart(2, '0')
}

export function buildCronExpression(parts: CronParts): string {
  return [parts.minute, parts.hour, parts.dayOfMonth, parts.month, parts.dayOfWeek].join(' ')
}

export function describeCronExpression(expression: string): string {
  const parts = expression.trim().split(/\s+/)
  if (parts.length !== 5) {
    return 'Invalid cron expression. Expected 5 fields.'
  }

  const [minute, hour, dayOfMonth, month, dayOfWeek] = parts as [string, string, string, string, string]
  if (minute === '0' && /^\d+$/.test(hour) && dayOfMonth === '*' && month === '*' && dayOfWeek === '*') {
    return `Every day at ${padTime(hour)}:00`
  }
  if (minute === '0' && /^\d+$/.test(hour) && dayOfMonth === '*' && month === '*' && dayOfWeek === '1-5') {
    return `Every weekday at ${padTime(hour)}:00`
  }
  return `Cron schedule: ${expression}`
}
