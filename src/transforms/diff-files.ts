import { Observable, from } from 'rxjs'
import { lines } from '../strings'

export interface FileDiff {
  commit: string
  authorName: string
  authorEmail: string
  timestamp: number
  filename: string
  isCreated: boolean
  isDeleted: boolean
  additions: number
  deletions: number
  addedLines: string[]
  deletedLines: string[]
}

const DIFF_HEADER = /^diff --git (\S+) (\S+)/

export function getCommitFiles(diff: string): Observable<FileDiff> {
  let ret: FileDiff[] = [ ]
  let ls = lines(diff)
  let curDiff: FileDiff | null = null

  // Parse header

  let hash = ls[0]
  let authorEmail = ls[1]
  let authorName = ls[2]
  let timestamp = parseInt(ls[3])
  ls = ls.slice(5)

  let plusFile: string | null = null
  let minusFile: string | null = null

  // Parse diff lines
  for (let line of ls) {
    let matches = line.match(DIFF_HEADER)
    if (matches) {
      plusFile = null
      minusFile = null
      if (curDiff) {
        ret.push(curDiff)
      }
      curDiff = {
        commit: hash,
        authorName: authorName,
        authorEmail: authorEmail,
        timestamp: timestamp,
        filename: matches[1].substring(2),
        isCreated: false,
        isDeleted: false,
        additions: 0,
        deletions: 0,
        addedLines: [ ],
        deletedLines: [ ]
      }
    } else if (curDiff) {
      if (plusFile != null && minusFile != null) {
        if (/^\+/.test(line)) {
          curDiff.additions++
          curDiff.addedLines.push(line)
        } else if (/^-/.test(line)) {
          curDiff.deletions++
          curDiff.deletedLines.push(line)
        }
      }
      if (matches = line.match(/^\+\+\+ (.*)$/)) {
        plusFile = matches[1]
        if (!curDiff.isDeleted) {
          curDiff.isDeleted = plusFile === '/dev/null'
        }
      }
      if (matches = line.match(/^--- (.*)$/)) {
        minusFile = matches[1]
        if (!curDiff.isDeleted) {
          curDiff.isCreated = minusFile === '/dev/null'
        }
      }
    }
  }

  return from(ret)
}
