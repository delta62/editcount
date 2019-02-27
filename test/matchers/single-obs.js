const diff = require('jest-diff')
const { isObservable } = require('rxjs')
const { isEmpty, single } = require('rxjs/operators')

expect.extend({
  async toBeSingletonObservable(actual, expected) {
    if (!isObservable(actual)) {
      return {
        message: () => 'toBeSingletonObservable called with a non-observable value',
        pass: false
      }
    }

    let options = {
      isNot: this.isNot,
      promise: this.promise
    }

    let result = await singletonStream(actual)
    let pass = this.equals(result, expected)

    let message
    if (pass) {
      message = [
        this.utils.matcherHint('toBeSingletonObservable', undefined, undefined, options),
        `Expected: ${this.utils.printExpected(expected)}`,
        `Received: ${this.utils.printReceived(actual)}`
      ].join('\n')
    } else {
      let difference = diff(expected, result, {
        expand: this.expand
      })

      message = [
        this.utils.matcherHint('toBeSingletonObservable', undefined, undefined, options),
        difference
      ].join('\n')
    }

    return { message: () => message, pass }
  },

  async toBeEmptyObservable(actual) {
    if (!isObservable(actual)) {
      return {
        message: () => 'toBeEmptyObservable called with a non-observable value',
        pass: false
      }
    }

    let options = {
      isNot: this.isNot,
      promise: this.promise
    }
    let pass = await actual.pipe(isEmpty()).toPromise()
    let message = pass
      ? 'Observable was empty'
      : 'Observable was not empty'
    return { message: () => message, pass }
  }
})

async function singletonStream(stream) {
  return await stream.pipe(single()).toPromise()
}
