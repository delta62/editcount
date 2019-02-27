import { Observable, from } from 'rxjs'
import { filter, flatMap } from 'rxjs/operators'

import execStream from './exec'
import Args from '../args'

const DIFF_MATCHER = /^diff --git.*\n]$/

export interface FileChange {
  hash: string
  authorName: string
  authorEmail: string
  timestamp: number
  file: string
}

export default function diffStream(progArgs: Args, hash: string): Observable<FileChange> {
  let args = [ 'show', '--format=%H%+ae%+an%+at', hash ]
  let opts = { cwd: progArgs.cwd, timeout: 5 }
  return (execStream('git', args, opts) as Observable<string>)
    .pipe(flatMap(mapDiffFiles))
    .pipe(filter(x => !!x.file))
}

function mapDiffFiles(diff: string) {
  let { header, changes } = parseHeader(diff)
  let chunks = changes.split(DIFF_MATCHER)
    .map(file => ({ ...header, file }))
  return from(chunks)
}

function parseHeader(diff: string) {
  let pieces = diff.split('\n')
  let [ hash, authorEmail, authorName, ts ] = pieces
  let changes = pieces.slice(5).join('\n')
  let timestamp = parseInt(ts) * 1000
  let header = { hash, authorName, authorEmail, timestamp }
  return { header, changes }
}
