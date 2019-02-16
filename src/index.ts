import yargs from 'yargs'
import { concatAll, concatMap, flatMap, map, tap } from 'rxjs/operators'

import Args from './args'
import revListStream from './streams/commit'
import diffStream from './streams/diff'
import { FileDiff, getCommitFiles } from './transforms/diff-files'

let args: Args = yargs
  .option('cwd', {
    description: 'The directory to execute git commands in',
    default: '.',
    type: 'string'
  })
  .option('from', {
    description: 'The commit to start diffing from',
    type: 'string'
  })
  .option('to', {
    description: 'The commit to stop diffing at',
    type: 'string'
  })
  .demandOption([ 'from', 'to' ])
  .help()
  .argv

revListStream(args)
  .pipe(map(hash => diffStream(args, hash)))
  .pipe(concatAll())
  .pipe(flatMap(getCommitFiles))
  .subscribe(
    console.log.bind(console),
    err => console.error(err)
  )
