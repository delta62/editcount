import diff from 'jest-diff'
import { Observable, from, isObservable, zip } from 'rxjs'
import { isEmpty, reduce, single } from 'rxjs/operators'

expect.extend({
  async toBeSingletonObservable<T>(this: jest.MatcherUtils, actual: Observable<T>, expected: T): Promise<jest.CustomMatcherResult> {
    if (!isObservable(actual)) {
      return {
        message: () => 'toBeSingletonObservable called with a non-observable value',
        pass: false
      }
    }

    let result = await singletonStream(actual)
    let pass = this.equals(result, expected)

    let message: string
    if (pass) {
      message = [
        this.utils.matcherHint('toBeSingletonObservable'),
        `Expected: ${this.utils.printExpected(expected)}`,
        `Received: ${this.utils.printReceived(actual)}`
      ].join('\n')
    } else {
      let difference = diff(expected, result, {
        expand: this.expand
      })

      message = [
        this.utils.matcherHint('toBeSingletonObservable'),
        difference
      ].join('\n')
    }

    return { message: () => message, pass }
  },

  async toBeEmptyObservable(actual: Observable<any>) {
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

  async toBeObservableWith<T>(this: jest.MatcherUtils, actual: Observable<T>, expected: T[]): Promise<jest.CustomMatcherResult> {
    if (!isObservable(actual)) {
      return {
        message: () => 'toBeEmptyObservable called with a non-observable value',
        pass: false
      }
    }

    let expectedObs = from(expected)
    let errorString = await zip(actual, expectedObs)
      .pipe(reduce<[ T, T ], string>((acc, [ x, y ]) => {
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

async function singletonStream(stream: Observable<any>) {
  return await stream.pipe(single()).toPromise()
}
