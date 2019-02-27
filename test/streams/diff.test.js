const exec = require('../../lib/streams/exec').default
const diffStream = require('../../lib/streams/diff').default
describe('diffStream', () => {
  test('should emit for an empty commit', async () => {
    setDiffResult('empty.patch')
    await expect(diffStream({ })).toBeEmptyObservable()
  test('should emit for a created file', async () => {
    setDiffResult('add.patch')
    await expect(diffStream({ })).toBeSingletonObservable({
      authorName: 'Sam Noedel',
      authorEmail: 'sam.noedel@gmail.com',
      hash: '8a6b02108fc1ff9feb30a6c0405fca9600f9a4a6',
      timestamp: 1549753267000,
      file: `diff --git a/.gitignore b/.gitignore
new file mode 100644
index 0000000..f5f2ba6
--- /dev/null
+++ b/.gitignore
@@ -0,0 +1,2 @@
+node_modules/
+*.js
`
  let diffStream = bindNodeCallback(readFile)(diffPath, { encoding: 'utf8' })
  exec.mockReturnValue(diffStream)