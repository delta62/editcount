import yargs from 'yargs'
import { concat, from } from 'rxjs'
import { concatAll, flatMap, map } from 'rxjs/operators'

import Args from './args'
import revListStream from './streams/commit'
import diffStream from './streams/diff'
import { getCommitFiles } from './transforms/diff-files'

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

let fileStream = revListStream(args)
  .pipe(map(hash => diffStream(args, hash)))
  .pipe(concatAll())
  .pipe(flatMap(getCommitFiles))

let fileStrings = fileStream.pipe(map(obj => JSON.stringify(obj)))
let openArrayStream = from([ '[' ])
let closeArrayStream = from([ ']' ])

concat(openArrayStream, fileStrings, closeArrayStream)
  .subscribe(
    process.stdout.write.bind(process.stdout),
    console.error.bind(console)
  )
