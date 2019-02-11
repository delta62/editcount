import { Observable, from } from 'rxjs'
import { lines } from '../strings'

export interface FileDiff {
  commit: string
  authorName: string
  authorEmail: string
  timestamp: number
  filename: string
  lines: string[]
}

const DIFF_HEADER = /diff --git (\S+) (\S+)/

export function getCommitFiles(diff: string): Observable<FileDiff> {
  let ret: FileDiff[] = [ ]
  let ls = lines(diff)
  let curDiff: FileDiff | null = null
  let hash = ls[0]
  let authorEmail = ls[1]
  let authorName = ls[2]
  let timestamp = parseInt(ls[3])
  ls = ls.slice(5)

  for (let line of ls) {
    let matches = line.match(DIFF_HEADER)
    if (matches) {
      if (curDiff) {
        ret.push(curDiff)
      }
      curDiff = {
        commit: hash,
        authorName: authorName,
        authorEmail: authorEmail,
        timestamp: timestamp,
        filename: matches[1],
        lines: [ line ]
      }
    } else if (curDiff) {
      curDiff.lines.push(line)
    }
  }

  return from(ret)
}
