const { lines } = require('../src/strings')

describe('string utils', () => {
  test('returns an empty array for an empty string', () => {
    let result = lines('')
    expect(result).toEqual([ ])
  })

  test('returns a singleton array for one line', () => {
    let result = lines('line one\n')
    expect(result).toEqual([ 'line one' ])
  })

  test('returns multiple lines', () => {
    let result = lines('line one\nline two\n')
    expect(result).toEqual([ 'line one', 'line two' ])
  })

  test('returns text with no trailing newline', () => {
    let result = lines('line one')
    expect(result).toEqual([ 'line one' ])
  })

  test('considers trailing text after newlines', () => {
    let result = lines('line one\nline two')
    expect(result).toEqual([ 'line one', 'line two' ])
  })
})
