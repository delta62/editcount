import { Observable } from 'rxjs'
import { ExecFileOptions, execFile } from 'child_process'

export default function execStream(cmd: string, args?: string[], opts?: ExecFileOptions): Observable<string | Buffer> {
  return new Observable(subscriber => {
    function cb(err: Error | null, stdout: string | Buffer) {
      if (err) {
        subscriber.error(err)
      } else {
        subscriber.next(stdout)
        subscriber.complete()
      }
    }
    execFile(cmd, args, opts, cb)
  })
}