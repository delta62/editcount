import '../matchers/single-obs'
import { from } from 'rxjs'

jest.mock('../../lib/streams/exec')

import exec from '../../lib/streams/exec'
import commitStream from '../../lib/streams/commit'

describe('commitStream', async () => {
  test('should invoke git rev-list', async () => {
    (exec as any).mockReturnValue(from([ '' ]))
    await commitStream({ from: 'from-hash', to: 'to-hash', cwd: '' }).toPromise()

    expect(exec).toHaveBeenCalledTimes(1)
    let callArgs = (exec as jest.Mock).mock.calls[0]
    expect(callArgs[0]).toBe('git')
    expect(callArgs[1]).toEqual([ 'rev-list', '^from-hash', 'to-hash' ])
  })

  test('should stream no commits', async () => {
    (exec as any).mockReturnValue(from([ '' ]))
    let commits = commitStream({ from: 'from-hash', to: 'to-hash', cwd: '' })
    await expect(commits).toBeEmptyObservable()
  })

  test('should stream one commit', async () => {
    (exec as jest.Mock).mockReturnValue(from([ '8a6b02108fc1ff9feb30a6c0405fca9600f9a4a6' ]))
    let commits = commitStream({ from: 'from-hash', to: 'to-hash', cwd: '' })
    await expect(commits).toBeSingletonObservable('8a6b02108fc1ff9feb30a6c0405fca9600f9a4a6')
  })

  test('should stream multiple commits', async () => {
    let expected = [
      '8a6b02108fc1ff9feb30a6c0405fca9600f9a4a6',
      'c3ed1451aebd0bfe1fdae4324622d5315ddff2d0',
      '621cc3b0d2fe11f6ac7d6f980c5aba9591d171bf'
    ];
    (exec as any).mockReturnValue(from([ expected.join('\n') ]))
    let commits = commitStream({ from: 'from-hash', to: 'to-hash', cwd: '' })
    await expect(commits).toBeObservableWith(expected)
  })
})
