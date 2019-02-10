import { Observable } from 'rxjs'
import { execFile } from 'child_process'
import Args from '../args'

export default function diffStream(progArgs: Args, hash: string): Observable<string> {
  return new Observable(subscriber => {
    execFile(
      'git',
      [ 'diff', `${hash}^`, `${hash}` ],
      { cwd: progArgs.cwd, timeout: 2 },
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
