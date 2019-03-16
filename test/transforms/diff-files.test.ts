import { readFile } from 'fs'
import * as path from 'path'

import getDiffFiles from '../../lib/transforms/diff-files'

describe('getDiffFiles', () => {

  test('detects new files', async () => {
    let diff = await getDiff('add.patch')
    let result = getDiffFiles(diff)
    expect(result).toHaveProperty('isCreated', true)
  })

  test('detects deleted files', async () => {
    let diff = await getDiff('remove.patch')
    let result = getDiffFiles(diff)
    expect(result).toHaveProperty('isDeleted', true)
  })

  test('detects renamed files', async () => {
    let diff = await getDiff('rename.patch')
    let result = getDiffFiles(diff)
    expect(result).toHaveProperty('isRename', true)
  })

  test('parses filename', async () => {
    let diff = await getDiff('spaces.patch')
    let result = getDiffFiles(diff)
    expect(result).toHaveProperty('filename', 'src/space file.ts')
  })

  test('counts additions properly', async () => {
    let diff = await getDiff('edit.patch')
    let result = getDiffFiles(diff)
    expect(result).toHaveProperty('additions', 5)
  })

  test('counts deletions properly', async () => {
    let diff = await getDiff('edit.patch')
    let result = getDiffFiles(diff)
    expect(result).toHaveProperty('deletions', 3)
  })
})

async function getDiff(name: string) {
  let filePath = path.join(__dirname, '..', 'diffs', name)
  let contents: string = await new Promise((resolve, reject) => {
    readFile(filePath, { encoding: 'utf8' }, (err, data) => {
      err ? reject(err) : resolve(data)
    })
  })
  return {
    hash: 'some-hash',
    authorName: 'some-author',
    authorEmail: 'some-author@example.com',
    timestamp: 0,
    file: contents
  }
}
