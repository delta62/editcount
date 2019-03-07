import { strict as assert } from 'assert'
import Args from './args'

export default function validate(args: Args) {
  assert(args)
  assert.strictEqual(typeof args, 'object')
  assert.strictEqual(typeof args.from, 'string')
  assert.strictEqual(typeof args.to, 'string')
}
