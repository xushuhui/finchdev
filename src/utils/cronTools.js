function padTime(value) {
  return String(value).padStart(2, '0')
}

export function buildCronExpression(parts) {
  return [parts.minute, parts.hour, parts.dayOfMonth, parts.month, parts.dayOfWeek].join(' ')
}

export function describeCronExpression(expression) {
  const parts = expression.trim().split(/\s+/)
  if (parts.length !== 5) {
    return 'Invalid cron expression. Expected 5 fields.'
  }

  const [minute, hour, dayOfMonth, month, dayOfWeek] = parts
  if (minute === '0' && /^\d+$/.test(hour) && dayOfMonth === '*' && month === '*' && dayOfWeek === '*') {
    return `Every day at ${padTime(hour)}:00`
  }
  if (minute === '0' && /^\d+$/.test(hour) && dayOfMonth === '*' && month === '*' && dayOfWeek === '1-5') {
    return `Every weekday at ${padTime(hour)}:00`
  }
  return `Cron schedule: ${expression}`
}
