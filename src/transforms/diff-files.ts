import { Observable, from } from 'rxjs'
import { lines } from '../strings'

export interface FileDiff {
  filename: string
  lines: string[]
}

export function getCommitFiles(diff: string): Observable<FileDiff> {
  let ret = [ ]
  const DIFF_HEADER = /diff --git (\S+) (\S+)/
  let curDiff: FileDiff | null = null

  for (let line of lines(diff)) {
    let matches = line.match(DIFF_HEADER)
    if (matches) {
      if (curDiff) {
        ret.push(curDiff)
      }
      curDiff = { filename: matches[1], lines: [ line ] }
    } else {
      if (curDiff) {
        curDiff.lines.push(line)
      }
    }
  }

  return from(ret)
}
