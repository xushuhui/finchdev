import { diffLines } from 'diff'

export function createLineDiff(leftText, rightText, diffFn = diffLines) {
  return diffFn(leftText, rightText)
}

export function buildDiffSummary(parts) {
  let added = 0
  let removed = 0
  for (const part of parts) {
    const lineCount = part.value ? part.value.replace(/\n$/, '').split('\n').filter(Boolean).length : 0
    if (part.added) added += lineCount
    if (part.removed) removed += lineCount
  }
  return { added, removed }
}
