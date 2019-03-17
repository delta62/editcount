import { Observable } from 'rxjs'
import { flatMap, map } from 'rxjs/operators'
import { Readable } from 'stream'

import Args from './args'
import validate from './arg-validator'
import revListStream from './streams/commit'
import diffStream from './streams/diff'
import getDiffFiles from './transforms/diff-files'
import { FileDiff } from './models'

export default function edits(args: Args): Observable<FileDiff> {
  validate(args)
  return revListStream(args)
    .pipe(flatMap(hash => diffStream(args, hash)))
    .pipe(map(getDiffFiles))
}

export function editStream(args: Args): Readable {
  let readable = new Readable({
    highWaterMark: 25,
    objectMode: true
  })

  edits(args)
    .subscribe(
      data => readable.push(data),
      err => readable.emit('error', err),
      () => readable.push(null)
    )

  return readable
}

export { FileDiff, edits as editObservable }
