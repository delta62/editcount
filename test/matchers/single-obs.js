const diff = require('jest-diff')
const { from, isObservable, zip } = require('rxjs')
const { isEmpty, map, reduce, single } = require('rxjs/operators')

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

    let pass = await actual.pipe(isEmpty()).toPromise()
    let message = pass
      ? 'Observable was empty'
      : 'Observable was not empty'
    return { message: () => message, pass }
  },

  async toBeObservableWith(actual, expected) {
    expected = from(expected)
    if (!isObservable(actual)) {
      return {
        message: () => 'toBeEmptyObservable called with a non-observable value',
        pass: false
      }
    }

    let errorString = await zip(actual, expected)
      .pipe(reduce((acc, [ x, y ]) => {
        if (acc) return acc
        if (this.equals(x, y)) {
          return ''
        } else {
          return `expected ${x} to equal ${y}`
        }
      }, ''))
      .toPromise()

    let message = errorString
      ? errorString
      : 'All observable values were equal'

    return { message: () => message, pass: !errorString }
  }
})

async function singletonStream(stream) {
  return await stream.pipe(single()).toPromise()
}
