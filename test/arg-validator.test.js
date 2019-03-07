const validate = require('../lib/arg-validator').default

test('should fail for empty arg', () => {
  expect(() => validate()).toThrow()
})

test('should fail for non-object arg', () => {
  expect(() => validate('string')).toThrow()
})

test('should fail for missing "from"', () => {
  expect(() => validate({ to: 'some-hash' })).toThrow()
})

test('should fail for missing "to"', () => {
  expect(() => validate({ from: 'some-hash' })).toThrow()
})

test('should not throw for valid input', () => {
  expect(() => validate({ to: 'some-hash', from: 'some-hash' })).not.toThrow()
})
