jest.mock('child_process')
const cp = require('child_process')
const execStream = require('../../lib/streams/exec').default

describe('execStream', () => {
  test('invokes the given command', async () => {
    await execStream('command', [ 'arg1', 'arg2' ], { opt: 'opt' }).toPromise()
    expect(cp.execFile).toHaveBeenCalledWith(
      'command',
      [ 'arg1', 'arg2' ],
      { opt: 'opt' },
      expect.any(Function)
    )
  })

  test('emits next with stdout', async () => {
    cp.__setMockResults(null, 'command results')
    let result = await execStream('command').toPromise()
    expect(result).toBe('command results')
  })

  test('emits error with command errors', async () => {
    let err = new Error('Unable to run command')
    cp.__setMockResults(err)
    await expect(execStream('command').toPromise()).rejects.toThrow(err)
  })
})
