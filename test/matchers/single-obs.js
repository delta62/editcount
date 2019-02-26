const diff = require('jest-diff')
const { isObservable } = require('rxjs')
const { single } = require('rxjs/operators')

expect.extend({
  async toBeSingletonObservable(received, expected) {
    let options = {
      isNot: this.isNot,
      promise: this.promise
    }
    if (!isObservable(received)) {
      return {
        message: () => 'toBeSingletonObservable called with a non-observable value',
        pass: false
      }
    }

    let result = await singletonStream(received)
    let pass = this.equals(result, expected)
    let message = pass
      ? () =>
        this.utils.matcherHint('toBe', undefined, undefined, options) +
        '\n\n' +
        `Expected: ${this.utils.printExpected(expected)}\n` +
        `Received: ${this.utils.printReceived(received)}`
      : () => {
        let difference = diff(expected, received, {
          expand: this.expand
        })
        return (
          this.utils.matcherHint('toBeSingletonObservable', undefined, undefined, options) +
          '\n\n' +
          (difference && difference.includes('- Expect')
            ? `Difference:\n\n`
            : `Expected: ${this.utils.printExpected(expected)}\n` +
              `Received: ${this.utils.printReceived(received)}`)
        )
      }

    return { actual: received, message, pass }
  }
})

async function singletonStream(stream) {
  return await new Promise((resolve, reject) => {
    stream.pipe(single()).subscribe(resolve, reject)
  })
}
