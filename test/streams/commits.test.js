require('../matchers/single-obs')
const { from } = require('rxjs')
const { isEmpty, single } = require('rxjs/operators')

jest.mock('../../lib/streams/exec')

const exec = require('../../lib/streams/exec').default
const commitStream = require('../../lib/streams/commit').default

describe('commitStream', async () => {
  test('should invoke git rev-list', async () => {
    exec.mockReturnValue(from([ '' ]))
    await commitStream({ from: 'from-hash', to: 'to-hash' }).toPromise()

    expect(exec).toHaveBeenCalledTimes(1)
    let callArgs = exec.mock.calls[0]
    expect(callArgs[0]).toBe('git')
    expect(callArgs[1]).toEqual([ 'rev-list', '^from-hash', 'to-hash' ])
  })

  test('should stream no commits', async () => {
    exec.mockReturnValue(from([ '' ]))
    let commits = commitStream({ from: 'from-hash', to: 'to-hash' })
    await expect(commits).toBeEmptyObservable()
  })

  test('should stream one commit', async () => {
    exec.mockReturnValue(from([ '8a6b02108fc1ff9feb30a6c0405fca9600f9a4a6' ]))
    let commits = commitStream({ from: 'from-hash', to: 'to-hash' })
    await expect(commits).toBeSingletonObservable('8a6b02108fc1ff9feb30a6c0405fca9600f9a4a6')
  })

  test('should stream multiple commits', async () => {
    let expected = [
      '8a6b02108fc1ff9feb30a6c0405fca9600f9a4a6',
      'c3ed1451aebd0bfe1fdae4324622d5315ddff2d0',
      '621cc3b0d2fe11f6ac7d6f980c5aba9591d171bf'
    ]
    exec.mockReturnValue(from([ expected.join('\n') ]))
    let commits = commitStream({ from: 'from-hash', to: 'to-hash' })
    await expect(commits).toBeObservableWith(expected)
  })
})
