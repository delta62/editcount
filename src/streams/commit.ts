import { Observable } from 'rxjs'
import { spawn } from 'child_process'
import Args from '../args'

export default function commitStream(progArgs: Args): Observable<string> {
  let args = [ 'rev-list', `^${progArgs.from}`, `${progArgs.to}` ]
  let opts = {
    cwd: progArgs.cwd,
    timeout: 10
  }

  return new Observable(subscriber => {
    let buffer = ''
    let proc = spawn('git', args, opts)

    proc.stdout.on('data', data => {
      buffer += data
      let lines = buffer.split('\n')
      for (let line of lines) {
        subscriber.next(line)
      }
    })

    proc.on('close', code => {
      if (code !== 0) {
        subscriber.error(new Error(`Process exited with code ${code}`))
      }
      subscriber.complete()
    })
  })
}
