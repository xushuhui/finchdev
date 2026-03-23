import { diffLines, type Change } from 'diff'

export type DiffPart = Change
export type LineDiffFunction = (leftText: string, rightText: string) => DiffPart[]

interface DiffSummary {
  added: number
  removed: number
}

const defaultLineDiff: LineDiffFunction = (leftText, rightText) => diffLines(leftText, rightText)

export function createLineDiff(leftText: string, rightText: string, diffFn: LineDiffFunction = defaultLineDiff): DiffPart[] {
  return diffFn(leftText, rightText)
}

export function buildDiffSummary(parts: DiffPart[]): DiffSummary {
  let added = 0
  let removed = 0
  for (const part of parts) {
    const lineCount = part.value ? part.value.replace(/\n$/, '').split('\n').filter(Boolean).length : 0
    if (part.added) added += lineCount
    if (part.removed) removed += lineCount
  }
  return { added, removed }
}
