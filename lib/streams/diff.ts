import { Observable, from } from 'rxjs'
import { flatMap } from 'rxjs/operators'

import execStream from './exec'
import Args from '../args'

const DIFF_MATCHER = /^diff --git.*\n]$/

export default function diffStream(progArgs: Args, hash: string): Observable<string> {
  let args = [ 'show', '--format=%H%+ae%+an%+at', hash ]
  let opts = { cwd: progArgs.cwd, timeout: 5 }
  return (execStream('git', args, opts) as Observable<string>)
    .pipe(flatMap(mapDiffFiles))
}

function mapDiffFiles(diff: string) {
  let matches = diff.split(DIFF_MATCHER)
  return from(matches || [ ])
}
