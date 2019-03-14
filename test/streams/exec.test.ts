jest.mock('child_process')
const cp = require('child_process')
const execStream = require('../../lib/streams/exec').default

describe('execStream', () => {
  test('invokes the given command', async () => {
    await execStream('command', [ 'arg1', 'arg2' ], { cwd: 'some/dir' }).toPromise()
    expect(cp.spawn).toHaveBeenCalledWith(
      'command',
      [ 'arg1', 'arg2' ],
      { cwd: 'some/dir' }
    )
  })

  test('emits next with stdout', async () => {
    cp.__setMockResults(0, 'command results')
    let result = await execStream('command').toPromise()
    expect(result).toBe('command results')
  })

  test('emits error with command errors', async () => {
    cp.__setMockResults(1)
    await expect(execStream('command').toPromise()).rejects.toThrow()
  })
})
