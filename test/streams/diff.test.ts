import '../matchers/single-obs'
import { from } from 'rxjs'
import { readFileSync } from 'fs'
import path from 'path'

jest.mock('../../lib/streams/exec')

import exec from '../../lib/streams/exec'
import diffStream from '../../lib/streams/diff'

const args = {
  cwd: '',
  from: '',
  to: ''
}

describe('diffStream', () => {
  test('should not emit for an empty commit', async () => {
    setDiffResult('empty.patch')
    await expect(diffStream(args, '')).toBeEmptyObservable()
  })

  test('should emit for a created file', async () => {
    let expected = setDiffResult('add.patch')
    await expect(diffStream(args, '')).toBeSingletonObservable({
      authorName: 'Sam Noedel',
      authorEmail: 'sam.noedel@gmail.com',
      hash: '8a6b02108fc1ff9feb30a6c0405fca9600f9a4a6',
      timestamp: 1549753267000,
      file: expected
    })
  })

  test('should emit for a deleted file', async () => {
    let expected = setDiffResult('remove.patch')
    await expect(diffStream(args, '')).toBeSingletonObservable({
      authorName: 'Sam Noedel',
      authorEmail: 'sam.noedel@gmail.com',
      hash: '77f0f8024f485127cbe6336d891cc622b5e99b1e',
      timestamp: 1550645429000,
      file: expected
    })
  })

  test('should not emit for a renamed file', async() => {
    let expected = setDiffResult('rename.patch')
    await expect(diffStream(args, '')).toBeSingletonObservable({
      authorName: 'Sam Noedel',
      authorEmail: 'sam.noedel@gmail.com',
      hash: '77f0f8024f485127cbe6336d891cc622b5e99b1e',
      timestamp: 1550645429000,
      file: expected
    })
  })

  test('should emit for an edited file', async () => {
    let expected = setDiffResult('edit.patch')
    await expect(diffStream(args, '')).toBeSingletonObservable({
      authorName: 'Sam Noedel',
      authorEmail: 'sam.noedel@gmail.com',
      hash: '621cc3b0d2fe11f6ac7d6f980c5aba9591d171bf',
      timestamp: 1549754966000,
      file: expected
    })
  })

  test('should emit for a file with spaces in the filename', async () => {
    let expected = setDiffResult('spaces.patch')
    await expect(diffStream(args, '')).toBeSingletonObservable({
      authorName: 'Sam Noedel',
      authorEmail: 'sam.noedel@gmail.com',
      hash: '621cc3b0d2fe11f6ac7d6f980c5aba9591d171bf',
      timestamp: 1549754966000,
      file: expected
    })
  })

  test('should emit for multiple file edits', async () => {
    let expected = setDiffResult('multi-edit.patch')
    await expect(diffStream(args, '')).toBeSingletonObservable({
      authorName: 'Sam Noedel',
      authorEmail: 'sam.noedel@gmail.com',
      hash: '621cc3b0d2fe11f6ac7d6f980c5aba9591d171bf',
      timestamp: 1549754966000,
      file: expected
    })
  })
})

function setDiffResult(diff: string) {
  let diffPath = path.join(__dirname, '..', 'diffs', diff)
  let fileContents = readFileSync(diffPath, { encoding: 'utf8' })
  let diffStream = from([ fileContents ]);
  (exec as any).mockReturnValue(diffStream)

  let breakIdx = fileContents.indexOf('\n\n') + 2
  return breakIdx === -1 ? null : fileContents.substring(breakIdx)
}
