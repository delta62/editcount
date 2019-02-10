import { Observable } from 'rxjs'
import { execFile } from 'child_process'
import { lines } from '../strings'
import Args from '../args'

export default function revListStream(progArgs: Args): Observable<string> {
  return new Observable(subscriber => {
    execFile(
      'git',
      [ 'rev-list', `^${progArgs.from}`, `${progArgs.to}` ],
      { cwd: progArgs.cwd, timeout: 2 },
      (err, stdout) => {
        if (err) {
          subscriber.error(err)
        } else {
          for (let l of lines(stdout)) {
            subscriber.next(l)
          }
          subscriber.complete()
        }
      }
    )
  })
}
