import {
  HasLowerCaseRule,
  HasNumberRule,
  HasSpecialCharRule,
  HasUpperCaseRule,
  NoCommonPasswordRule,
  NoRepeatCharsRule,
  StrongPasswordRule,
} from '../../../src/index'

describe('StrongPasswordRule', () => {
  const rule = new StrongPasswordRule()

  test('errorCode', () =>
    expect(rule.errorCode).toBe('invalid.strong-password'))
  test('expõe minLength padrão', () => expect(rule.minLength).toBe(8))
  test('aceita senha forte', () =>
    expect(rule.validate('Abcdef1@')).toBeNull())
  test.each([
    'abcdef1@', // sem maiúscula
    'ABCDEF1@', // sem minúscula
    'Abcdefg@', // sem número
    'Abcdefg1', // sem especial
    'Abc1@', // curta
  ])('rejeita %p', (value) =>
    expect(rule.validate(value)).toBe('invalid.strong-password'),
  )
  test('respeita minLength customizado', () => {
    const long = new StrongPasswordRule(12)

    expect(long.validate('Abcdef1@')).toBe('invalid.strong-password')
    expect(long.validate('Abcdefghij1@')).toBeNull()
  })
  test('rejeita não-string', () =>
    expect(rule.validate(1)).toBe('invalid.strong-password'))
  test.each([null, undefined])('é leniente com %p', (value) =>
    expect(rule.validate(value)).toBeNull(),
  )
})

describe('NoCommonPasswordRule', () => {
  test('errorCode', () =>
    expect(new NoCommonPasswordRule().errorCode).toBe(
      'invalid.common-password',
    ))
  test('bloqueia senha da lista padrão (case-insensitive)', () => {
    const rule = new NoCommonPasswordRule()

    expect(rule.validate('123456')).toBe('invalid.common-password')
    expect(rule.validate('PassWord')).toBe('invalid.common-password')
  })
  test('aceita senha fora da lista', () =>
    expect(new NoCommonPasswordRule().validate('h4x0r-secreto')).toBeNull())
  test('aceita lista negra customizada', () => {
    const rule = new NoCommonPasswordRule(['segredo'])

    expect(rule.validate('segredo')).toBe('invalid.common-password')
    expect(rule.validate('123456')).toBeNull()
  })
  test('rejeita não-string', () =>
    expect(new NoCommonPasswordRule().validate(1)).toBe(
      'invalid.common-password',
    ))
  test.each([null, undefined])('é leniente com %p', (value) =>
    expect(new NoCommonPasswordRule().validate(value)).toBeNull(),
  )
})

describe('NoRepeatCharsRule', () => {
  const rule = new NoRepeatCharsRule()

  test('errorCode', () =>
    expect(rule.errorCode).toBe('invalid.repeat-chars'))
  test('expõe maxRepeat padrão', () => expect(rule.maxRepeat).toBe(2))
  test('aceita até 2 repetições consecutivas', () =>
    expect(rule.validate('aabbcc')).toBeNull())
  test('rejeita 3+ repetições consecutivas', () =>
    expect(rule.validate('aaab')).toBe('invalid.repeat-chars'))
  test('respeita maxRepeat customizado', () => {
    const rule1 = new NoRepeatCharsRule(1)

    expect(rule1.validate('aa')).toBe('invalid.repeat-chars')
    expect(rule1.validate('ab')).toBeNull()
  })
  test('rejeita não-string', () =>
    expect(rule.validate(1)).toBe('invalid.repeat-chars'))
  test.each([null, undefined])('é leniente com %p', (value) =>
    expect(rule.validate(value)).toBeNull(),
  )
})

describe('HasUpperCaseRule', () => {
  const rule = new HasUpperCaseRule()

  test('errorCode', () =>
    expect(rule.errorCode).toBe('invalid.has-uppercase'))
  test('aceita com maiúscula', () =>
    expect(rule.validate('abcD')).toBeNull())
  test('rejeita sem maiúscula', () =>
    expect(rule.validate('abc1@')).toBe('invalid.has-uppercase'))
  test('rejeita não-string', () =>
    expect(rule.validate(1)).toBe('invalid.has-uppercase'))
  test.each([null, undefined])('é leniente com %p', (value) =>
    expect(rule.validate(value)).toBeNull(),
  )
})

describe('HasLowerCaseRule', () => {
  const rule = new HasLowerCaseRule()

  test('errorCode', () =>
    expect(rule.errorCode).toBe('invalid.has-lowercase'))
  test('aceita com minúscula', () =>
    expect(rule.validate('ABCd')).toBeNull())
  test('rejeita sem minúscula', () =>
    expect(rule.validate('ABC1@')).toBe('invalid.has-lowercase'))
  test('rejeita não-string', () =>
    expect(rule.validate(1)).toBe('invalid.has-lowercase'))
  test.each([null, undefined])('é leniente com %p', (value) =>
    expect(rule.validate(value)).toBeNull(),
  )
})

describe('HasNumberRule', () => {
  const rule = new HasNumberRule()

  test('errorCode', () => expect(rule.errorCode).toBe('invalid.has-number'))
  test('aceita com dígito', () => expect(rule.validate('abc9')).toBeNull())
  test('rejeita sem dígito', () =>
    expect(rule.validate('abc@')).toBe('invalid.has-number'))
  test('rejeita não-string', () =>
    expect(rule.validate(1)).toBe('invalid.has-number'))
  test.each([null, undefined])('é leniente com %p', (value) =>
    expect(rule.validate(value)).toBeNull(),
  )
})

describe('HasSpecialCharRule', () => {
  const rule = new HasSpecialCharRule()

  test('errorCode', () =>
    expect(rule.errorCode).toBe('invalid.has-special-char'))
  test('aceita com caractere especial', () =>
    expect(rule.validate('abc@')).toBeNull())
  test.each(['abc123', 'abc 123'])('rejeita %p', (value) =>
    expect(rule.validate(value)).toBe('invalid.has-special-char'),
  )
  test('rejeita não-string', () =>
    expect(rule.validate(1)).toBe('invalid.has-special-char'))
  test.each([null, undefined])('é leniente com %p', (value) =>
    expect(rule.validate(value)).toBeNull(),
  )
})
