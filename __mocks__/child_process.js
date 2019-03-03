const child_process = jest.genMockFromModule('child_process')

let mockResults = { err: null, stdout: null, stderr: null }

function __setMockResults(err, stdout, stderr) {
  mockResults = { err, stdout, stderr }
}

function execFile(cmd, args, opts, cb) {
  let { err, stdout, stderr } = mockResults
  setTimeout(() => cb(err, stdout, stderr))
}

child_process.execFile = jest.fn(execFile)
child_process.__setMockResults = __setMockResults

module.exports = child_process
