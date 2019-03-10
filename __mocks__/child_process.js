const child_process = jest.genMockFromModule('child_process')

let mockResults = { exitCode: null, stdout: null, stderr: null }

function __setMockResults(exitCode, stdout, stderr) {
  mockResults = {
    exitCode,
    stdout: stdout && Buffer.from(stdout),
    stderr: stderr && Buffer.from(stderr)
  }
}

function spawn(cmd, args, opts) {
  let handlers = { }

  let stdout = {
    handlers: { },
    on(event, handler) { stdout.handlers[event] = handler }
  }

  let stderr = {
    handlers: { },
    on(event, handler) { stderr.handlers[event] = handler }
  }

  if (mockResults.stdout) {
    setTimeout(() => stdout.handlers.data(mockResults.stdout))
  }
  if (mockResults.stderr) {
    setTimeout(() => stderr.handlers.data(mockResults.stderr))
  }

  exitCode = mockResults.exitCode == null ? 0 : mockResults.exitCode
  setTimeout(() => handlers.exit(exitCode))

  return {
    stdout,
    stderr,
    on(event, handler) { handlers[event] = handler }
  }
}

child_process.spawn = jest.fn(spawn)
child_process.__setMockResults = __setMockResults

module.exports = child_process
