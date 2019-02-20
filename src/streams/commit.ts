import { Observable } from 'rxjs'
import execStream from './exec'
import Args from '../args'

export default function revListStream(progArgs: Args): Observable<string> {
  let args = [ 'rev-list', `^${progArgs.from}`, `${progArgs.to}` ]
  let opts = { cwd: progArgs.cwd, timeout: 2 }
  return execStream('git', args, opts) as Observable<string>
}
