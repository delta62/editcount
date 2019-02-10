import yargs from 'yargs'
import Args from './args'

import { tap, flatMap, map } from 'rxjs/operators'

import commitStream from './streams/commit'
import diffStream from './streams/diff'

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

// stream which emits commit diffs
let diffs = commitStream(args)
  .pipe(flatMap(hash => diffStream(args, hash)))
//   .pipe(map(getCommitEdits))
  .subscribe(
    console.log.bind(console),
    err => console.error(err)
  )

interface FileChanges {
  file: string
  additions: number
  deletions: number
}

interface CommitChanges {
  commit: string
  author: string
  timestamp: number
  edits: Record<string, FileChanges>
}

// function getCommitEdits(diff: string): CommitChanges {
//   let filename = ''
// }
//
// function getFileEdits(diff: string): FileChanges {
//
// }
