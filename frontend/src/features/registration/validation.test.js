import { describe, expect, it } from 'vitest'
import { validateRegistration } from './validation'
const valid = { name: 'Test Customer', mobile: '9876543210', email: 'test@example.com', password: 'Laundry123!', confirm_password: 'Laundry123!', accept_terms: true }
describe('registration validation', () => {
  it('accepts complete valid details', () => expect(validateRegistration(valid)).toBe(''))
  it.each([
    [{ name: ' ' }, 'full name'],
    [{ mobile: '1234' }, '10-digit'],
    [{ email: 'invalid' }, 'email'],
    [{ password: 'short' }, '8 characters'],
    [{ password: 'é'.repeat(40) }, '72 bytes'],
    [{ confirm_password: 'different' }, 'do not match'],
    [{ accept_terms: false }, 'accept'],
  ])('rejects invalid input %j', (change, text) => {
    expect(validateRegistration({ ...valid, ...change })).toContain(text)
  })
})
