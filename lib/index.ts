import { Observable } from 'rxjs'
import { concatAll, map } from 'rxjs/operators'

import Args from './args'
import validate from './arg-validator'
import revListStream from './streams/commit'
import diffStream from './streams/diff'
import getDiffFiles from './transforms/diff-files'
import { FileDiff } from './models'

export default function edits(args: Args): Observable<FileDiff> {
  validate(args)
  return revListStream(args)
    .pipe(map(hash => diffStream(args, hash)))
    // Git can only handle one read from the DB at a time
    .pipe(concatAll())
    .pipe(map(getDiffFiles))
}
