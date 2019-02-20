import { Observable } from 'rxjs'
import execStream from './exec'
import Args from '../args'

export default function diffStream(progArgs: Args, hash: string): Observable<string> {
  let args = [ 'show', '--format=%H%+ae%+an%+at', hash ]
  let opts = { cwd: progArgs.cwd, timeout: 5 }
  return execStream('git', args, opts) as Observable<string>
}
