import { Observable } from 'rxjs'
import { spawn } from 'child_process'

export default function execStream(cmd: string, args: string[] = [ ], opts?: { cwd: string }): Observable<string> {
  let proc = spawn(cmd, args, opts)
  let stdout = Buffer.alloc(0)
  let stderr = Buffer.alloc(0)

  return new Observable(subscriber => {
    proc.stdout.on('data', data => {
      stdout = Buffer.concat([ stdout, data ])
    })

    proc.stderr.on('data', data => {
      stderr = Buffer.concat([ stderr, data ])
    })

    proc.on('exit', code => {
      if (code === 0) {
        subscriber.next(stdout.toString('utf8'))
        subscriber.complete()
      } else {
        let err = new Error(`command ${cmd} ${args.join(' ')} returned exit code ${code}`)
        subscriber.error(err)
      }
    })

    proc.on('error', () => {
      let err = new Error(`Command ${cmd} ${args.join(' ')} failed\n${stderr.toString('utf8')}`)
      subscriber.error(err)
    })
  })
}
