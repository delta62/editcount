require('../matchers/single-obs')
const { bindNodeCallback } = require('rxjs')
const { single } = require('rxjs/operators')
const { readFile } = require('fs')
const path = require('path')

jest.mock('../../lib/streams/exec')
const exec = require('../../lib/streams/exec')

describe('diffStream', () => {
  let diffStream

  beforeEach(() => {
    diffStream = require('../../lib/streams/diff').default
  })

  test('should emit for an empty commit', async () => {
    exec.default.mockReturnValue(setDiffResult('empty.patch'))
    let stream = diffStream({ })
    await expect(stream).toBeSingletonObservable({
      hash: '0f80cc7f5cad4ac5252d4b76348d5564049ac06f'
    })
  })

  // test('should emit for a created file', done => {
  //   expect.default.mockReturnValue(setDiffResult('add.patch'))
  //   diffStream({ })
  //     .pipe(single)
  //     .subscribe(
  //       next => { },
  //       done,
  //       done
  //     )
  // })

  // test('should emit for a deleted file', done => {
  //   done(new Error('Not implemented'))
  // })

  // test('should emit for an edited file', done => {
  //   done(new Error('Not implemented'))
  // })

  // test('should emit for a file with spaces in the filename', done => {
  //   done(new Error('Not implemented'))
  // })

  // test('should emit for multiple file edits', done => {
  //   done(new Error('Not implemented'))
  // })
})

function setDiffResult(diff) {
  let diffPath = path.join(__dirname, '..', 'diffs', diff)
  return bindNodeCallback(readFile)(diffPath, { encoding: 'utf8' })
}
