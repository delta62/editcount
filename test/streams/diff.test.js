const { from } = require('rxjs')
const { readFileSync } = require('fs')
  test('should not emit for an empty commit', async () => {
    let expected = setDiffResult('add.patch')
      file: expected
  test('should emit for a deleted file', async () => {
    let expected = setDiffResult('remove.patch')
    await expect(diffStream({ })).toBeSingletonObservable({
      authorName: 'Sam Noedel',
      authorEmail: 'sam.noedel@gmail.com',
      hash: '77f0f8024f485127cbe6336d891cc622b5e99b1e',
      timestamp: 1550645429000,
      file: expected
    })
  })
  test('should not emit for a renamed file', async() => {
    let expected = setDiffResult('rename.patch')
    await expect(diffStream({ })).toBeSingletonObservable({
      authorName: 'Sam Noedel',
      authorEmail: 'sam.noedel@gmail.com',
      hash: '77f0f8024f485127cbe6336d891cc622b5e99b1e',
      timestamp: 1550645429000,
      file: expected
    })
  })
  test('should emit for an edited file', async () => {
    let expected = setDiffResult('edit.patch')
    await expect(diffStream({ })).toBeSingletonObservable({
      authorName: 'Sam Noedel',
      authorEmail: 'sam.noedel@gmail.com',
      hash: '621cc3b0d2fe11f6ac7d6f980c5aba9591d171bf',
      timestamp: 1549754966000,
      file: expected
    })
  })

  test('should emit for a file with spaces in the filename', async () => {
    let expected = setDiffResult('spaces.patch')
    await expect(diffStream({ })).toBeSingletonObservable({
      authorName: 'Sam Noedel',
      authorEmail: 'sam.noedel@gmail.com',
      hash: '621cc3b0d2fe11f6ac7d6f980c5aba9591d171bf',
      timestamp: 1549754966000,
      file: expected
    })
  })
  test('should emit for multiple file edits', async () => {
    let expected = setDiffResult('multi-edit.patch')
    await expect(diffStream({ })).toBeSingletonObservable({
      authorName: 'Sam Noedel',
      authorEmail: 'sam.noedel@gmail.com',
      hash: '621cc3b0d2fe11f6ac7d6f980c5aba9591d171bf',
      timestamp: 1549754966000,
      file: expected
    })
  })
  let fileContents = readFileSync(diffPath, { encoding: 'utf8' })
  let diffStream = from([ fileContents ])

  let breakIdx = fileContents.indexOf('\n\n') + 2
  return breakIdx === -1 ? null : fileContents.substring(breakIdx)