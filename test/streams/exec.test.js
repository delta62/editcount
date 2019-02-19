jest.mock('child_process')
const { single } = require('rxjs/operators')

describe('execStream', () => {
  let execStream

  beforeEach(() => {
    execStream = require('../../src/streams/exec').default
  })

  test('invokes the given command', done => {
    execStream('command', [ 'arg1', 'arg2' ], { opt: 'opt' })
      .subscribe(
        () => { },
        () => { },
        () => {
          let mock = require('child_process').execFile.mock
          let [ cmd, args, opts ] = mock.calls[0]
          expect(cmd).toBe('command')
          expect(args).toEqual([ 'arg1', 'arg2' ])
          expect(opts).toEqual({ opt: 'opt' })
          done()
        })
  })

  test('emits next with stdout', done => {
    require('child_process').__setMockResults(null, 'command results')
    execStream('command')
      .pipe(single(x => {
        expect(x).toBe('command results')
      }))
      .subscribe(() => { }, () => { }, done)
  })

  test('emits error with command errors', done => {
    let err = new Error('Unable to run command')
    require('child_process').__setMockResults(err)
    execStream('command')
      .subscribe(
        () => { },
        error => {
          expect(error).toBe(err)
          done()
        })
  })
})
