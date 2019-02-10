import { FileDiff } from './diff-files'

export interface FileChanges {
  file: string
  additions: number
  deletions: number
}

export function getFileChanges(diff: FileDiff): FileChanges {
  return diff.lines.reduce<FileChanges>((acc, line) => {
    if (/^- /.test(line)) {
      acc.deletions++
    } else if (/^\+ /.test(line)) {
      acc.additions++
    }
    return acc
  }, { file: diff.filename, additions: 0, deletions: 0 })
}
