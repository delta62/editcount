import yargs from 'yargs'
import commitStream from './streams/commit'
import Args from './args'

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

// stream which emits commit hashes
commitStream(args)
  .subscribe((data) => {
    console.log('data', data)
  })
