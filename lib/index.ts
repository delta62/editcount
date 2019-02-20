import { concatAll, flatMap, map } from 'rxjs/operators'

import Args from './args'
import revListStream from './streams/commit'
import diffStream from './streams/diff'
import { getCommitFiles } from './transforms/diff-files'

export function edits(args: Args) {
  return revListStream(args)
    .pipe(map(hash => diffStream(args, hash)))
    .pipe(concatAll())
    .pipe(flatMap(getCommitFiles))
}

export default edits
