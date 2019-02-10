import { Observable } from 'rxjs'
import { execFile } from 'child_process'
import Args from '../args'

export default function commitStream(progArgs: Args): Observable<string> {
  return new Observable(subscriber => {
    execFile(
      'git',
      [ 'rev-list', `^${progArgs.from}`, `${progArgs.to}` ],
      { cwd: progArgs.cwd, timeout: 2 },
      (err, stdout, stderr) => {
        if (err) {
          subscriber.error(err)
        } else {
          let lines = stdout.split('\n').filter(line => line.length)
          lines.forEach(subscriber.next.bind(subscriber))
          subscriber.complete()
        }
      }
    )
  })
}
