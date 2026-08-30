import {
  AlphaNumericRule,
  AlphaRule,
  ContainsRule,
  EndsWithRule,
  LowerCaseRule,
  NoWhitespaceRule,
  RegexRule,
  StartsWithRule,
  TrimRule,
  UpperCaseRule,
} from '../../../src/index'

describe('TrimRule', () => {
  const rule = new TrimRule()

  test('errorCode', () => expect(rule.errorCode).toBe('invalid.trim'))
  test('aceita string sem espaços nas pontas', () =>
    expect(rule.validate('abc')).toBeNull())
  test('aceita string vazia', () => expect(rule.validate('')).toBeNull())
  test.each([' abc', 'abc ', '\tabc', 'abc\n'])('rejeita %p', (value) =>
    expect(rule.validate(value)).toBe('invalid.trim'),
  )
  test('rejeita não-string', () =>
    expect(rule.validate(42)).toBe('invalid.trim'))
  test.each([null, undefined])('é leniente com %p', (value) =>
    expect(rule.validate(value)).toBeNull(),
  )
})

describe('NoWhitespaceRule', () => {
  const rule = new NoWhitespaceRule()

  test('errorCode', () =>
    expect(rule.errorCode).toBe('invalid.no-whitespace'))
  test('aceita string sem espaços', () =>
    expect(rule.validate('abc123')).toBeNull())
  test.each(['a b', ' ab', 'ab\t', 'a\nb'])('rejeita %p', (value) =>
    expect(rule.validate(value)).toBe('invalid.no-whitespace'),
  )
  test('rejeita não-string', () =>
    expect(rule.validate(1)).toBe('invalid.no-whitespace'))
  test.each([null, undefined])('é leniente com %p', (value) =>
    expect(rule.validate(value)).toBeNull(),
  )
})

describe('AlphaRule', () => {
  const rule = new AlphaRule()

  test('errorCode', () => expect(rule.errorCode).toBe('invalid.alpha'))
  test.each(['abc', 'ABC', 'AbC'])('aceita %p', (value) =>
    expect(rule.validate(value)).toBeNull(),
  )
  test.each(['abc1', 'a b', 'áéí', '', 'a-b'])('rejeita %p', (value) =>
    expect(rule.validate(value)).toBe('invalid.alpha'),
  )
  test('rejeita não-string', () =>
    expect(rule.validate(10)).toBe('invalid.alpha'))
  test.each([null, undefined])('é leniente com %p', (value) =>
    expect(rule.validate(value)).toBeNull(),
  )
})

describe('AlphaNumericRule', () => {
  const rule = new AlphaNumericRule()

  test('errorCode', () =>
    expect(rule.errorCode).toBe('invalid.alphanumeric'))
  test.each(['abc123', 'ABC', '123'])('aceita %p', (value) =>
    expect(rule.validate(value)).toBeNull(),
  )
  test.each(['abc 123', 'a_b', '', 'áb1'])('rejeita %p', (value) =>
    expect(rule.validate(value)).toBe('invalid.alphanumeric'),
  )
  test('rejeita não-string', () =>
    expect(rule.validate(10)).toBe('invalid.alphanumeric'))
  test.each([null, undefined])('é leniente com %p', (value) =>
    expect(rule.validate(value)).toBeNull(),
  )
})

describe('StartsWithRule', () => {
  const rule = new StartsWithRule('pre-')

  test('errorCode', () =>
    expect(rule.errorCode).toBe('invalid.starts-with'))
  test('expõe prefix', () => expect(rule.prefix).toBe('pre-'))
  test('aceita string com o prefixo', () =>
    expect(rule.validate('pre-texto')).toBeNull())
  test('rejeita string sem o prefixo', () =>
    expect(rule.validate('texto')).toBe('invalid.starts-with'))
  test('rejeita não-string', () =>
    expect(rule.validate(1)).toBe('invalid.starts-with'))
  test.each([null, undefined])('é leniente com %p', (value) =>
    expect(rule.validate(value)).toBeNull(),
  )
})

describe('EndsWithRule', () => {
  const rule = new EndsWithRule('.png')

  test('errorCode', () => expect(rule.errorCode).toBe('invalid.ends-with'))
  test('expõe suffix', () => expect(rule.suffix).toBe('.png'))
  test('aceita string com o sufixo', () =>
    expect(rule.validate('foto.png')).toBeNull())
  test('rejeita string sem o sufixo', () =>
    expect(rule.validate('foto.jpg')).toBe('invalid.ends-with'))
  test('rejeita não-string', () =>
    expect(rule.validate(1)).toBe('invalid.ends-with'))
  test.each([null, undefined])('é leniente com %p', (value) =>
    expect(rule.validate(value)).toBeNull(),
  )
})

describe('ContainsRule', () => {
  const rule = new ContainsRule('@')

  test('errorCode', () => expect(rule.errorCode).toBe('invalid.contains'))
  test('expõe substring', () => expect(rule.substring).toBe('@'))
  test('aceita string que contém', () =>
    expect(rule.validate('a@b')).toBeNull())
  test('rejeita string que não contém', () =>
    expect(rule.validate('ab')).toBe('invalid.contains'))
  test('rejeita não-string', () =>
    expect(rule.validate(1)).toBe('invalid.contains'))
  test.each([null, undefined])('é leniente com %p', (value) =>
    expect(rule.validate(value)).toBeNull(),
  )
})

describe('RegexRule', () => {
  const rule = new RegexRule(/^[a-f0-9]+$/)

  test('errorCode', () => expect(rule.errorCode).toBe('invalid.regex'))
  test('aceita string que casa', () =>
    expect(rule.validate('deadbeef')).toBeNull())
  test('rejeita string que não casa', () =>
    expect(rule.validate('xyz')).toBe('invalid.regex'))
  test('rejeita não-string', () =>
    expect(rule.validate(1)).toBe('invalid.regex'))
  test('ignora a flag global e é estável entre chamadas', () => {
    const globalRule = new RegexRule(/abc/gi)

    expect(globalRule.validate('ABC')).toBeNull()
    expect(globalRule.validate('ABC')).toBeNull()
  })
  test.each([null, undefined])('é leniente com %p', (value) =>
    expect(rule.validate(value)).toBeNull(),
  )
})

describe('UpperCaseRule', () => {
  const rule = new UpperCaseRule()

  test('errorCode', () => expect(rule.errorCode).toBe('invalid.uppercase'))
  test('aceita só maiúsculas', () =>
    expect(rule.validate('ABC')).toBeNull())
  test.each(['Abc', 'abc', 'ABC1', '', 'A B'])('rejeita %p', (value) =>
    expect(rule.validate(value)).toBe('invalid.uppercase'),
  )
  test('rejeita não-string', () =>
    expect(rule.validate(1)).toBe('invalid.uppercase'))
  test.each([null, undefined])('é leniente com %p', (value) =>
    expect(rule.validate(value)).toBeNull(),
  )
})

describe('LowerCaseRule', () => {
  const rule = new LowerCaseRule()

  test('errorCode', () => expect(rule.errorCode).toBe('invalid.lowercase'))
  test('aceita só minúsculas', () =>
    expect(rule.validate('abc')).toBeNull())
  test.each(['Abc', 'ABC', 'abc1', '', 'a b'])('rejeita %p', (value) =>
    expect(rule.validate(value)).toBe('invalid.lowercase'),
  )
  test('rejeita não-string', () =>
    expect(rule.validate(1)).toBe('invalid.lowercase'))
  test.each([null, undefined])('é leniente com %p', (value) =>
    expect(rule.validate(value)).toBeNull(),
  )
})
