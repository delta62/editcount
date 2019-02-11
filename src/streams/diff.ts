import { Observable } from 'rxjs'
import { execFile } from 'child_process'
import Args from '../args'

export default function diffStream(progArgs: Args, hash: string): Observable<string> {
  return new Observable(subscriber => {
    execFile(
      'git',
      [ 'show', '--format=%H%+ae%+an%+at', hash ],
      { cwd: progArgs.cwd, timeout: 5 },
      (err, stdout, stderr) => {
        if (err) {
          subscriber.error(err)
        } else {
          subscriber.next(stdout)
          subscriber.complete()
        }
      }
    )
  })
}
