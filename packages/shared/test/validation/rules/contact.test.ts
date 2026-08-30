import { DomainRule, PhoneRule, UrlRule } from '../../../src/index'

describe('UrlRule', () => {
  const rule = new UrlRule()

  test('errorCode', () => expect(rule.errorCode).toBe('invalid.url'))
  test.each([
    'http://example.com',
    'https://example.com/path?q=1#frag',
    'https://sub.example.co.uk:8443/x',
  ])('aceita %p', (value) => expect(rule.validate(value)).toBeNull())
  test('rejeita protocolo não http(s)', () =>
    expect(rule.validate('ftp://example.com')).toBe('invalid.url'))
  test('rejeita string que não é URL', () =>
    expect(rule.validate('isto não é url')).toBe('invalid.url'))
  test('rejeita não-string', () =>
    expect(rule.validate(1)).toBe('invalid.url'))
  test.each([null, undefined])('é leniente com %p', (value) =>
    expect(rule.validate(value)).toBeNull(),
  )
})

describe('PhoneRule', () => {
  const rule = new PhoneRule()

  test('errorCode', () => expect(rule.errorCode).toBe('invalid.phone'))
  test('expõe pattern', () => expect(rule.pattern).toBeInstanceOf(RegExp))
  test.each(['+5511999999999', '+14155552671'])('aceita E.164 %p', (value) =>
    expect(rule.validate(value)).toBeNull(),
  )
  test.each(['11999999999', '+0123', 'telefone'])('rejeita %p', (value) =>
    expect(rule.validate(value)).toBe('invalid.phone'),
  )
  test('aceita pattern customizado', () => {
    const custom = new PhoneRule(/^\d{4}-\d{4}$/)

    expect(custom.validate('1234-5678')).toBeNull()
    expect(custom.validate('12345678')).toBe('invalid.phone')
  })
  test('rejeita não-string', () =>
    expect(rule.validate(1)).toBe('invalid.phone'))
  test.each([null, undefined])('é leniente com %p', (value) =>
    expect(rule.validate(value)).toBeNull(),
  )
})

describe('DomainRule', () => {
  const rule = new DomainRule()

  test('errorCode', () => expect(rule.errorCode).toBe('invalid.domain'))
  test.each(['example.com', 'sub.example.co.uk', 'a.io', 'my-site.dev'])(
    'aceita %p',
    (value) => expect(rule.validate(value)).toBeNull(),
  )
  test.each([
    'localhost',
    'http://example.com',
    '-bad.com',
    'bad-.com',
    'exemplo .com',
    'example.c',
  ])('rejeita %p', (value) =>
    expect(rule.validate(value)).toBe('invalid.domain'),
  )
  test('rejeita não-string', () =>
    expect(rule.validate(1)).toBe('invalid.domain'))
  test.each([null, undefined])('é leniente com %p', (value) =>
    expect(rule.validate(value)).toBeNull(),
  )
})
