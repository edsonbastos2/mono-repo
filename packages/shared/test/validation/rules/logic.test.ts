import {
  EqualsRule,
  NotEqualsRule,
  NotNullRule,
  NotUndefinedRule,
} from '../../../src/index'

describe('NotNullRule', () => {
  const rule = new NotNullRule()

  test('errorCode', () => expect(rule.errorCode).toBe('invalid.not-null'))
  test('rejeita null', () =>
    expect(rule.validate(null)).toBe('invalid.not-null'))
  test.each([undefined, 0, '', false, 'x'])('aceita %p', (value) =>
    expect(rule.validate(value)).toBeNull(),
  )
})

describe('NotUndefinedRule', () => {
  const rule = new NotUndefinedRule()

  test('errorCode', () =>
    expect(rule.errorCode).toBe('invalid.not-undefined'))
  test('rejeita undefined', () =>
    expect(rule.validate(undefined)).toBe('invalid.not-undefined'))
  test.each([null, 0, '', false, 'x'])('aceita %p', (value) =>
    expect(rule.validate(value)).toBeNull(),
  )
})

describe('EqualsRule', () => {
  test('errorCode', () =>
    expect(new EqualsRule('x').errorCode).toBe('invalid.equals'))

  describe('modo valor fixo', () => {
    const rule = new EqualsRule('BR')

    test('expõe expected', () => expect(rule.expected).toBe('BR'))
    test('aceita valor igual', () => expect(rule.validate('BR')).toBeNull())
    test('rejeita valor diferente', () =>
      expect(rule.validate('US')).toBe('invalid.equals'))
    test('compara estruturalmente', () =>
      expect(new EqualsRule({ a: 1 }).validate({ a: 1 })).toBeNull())
  })

  describe('modo par (array de 2 posições)', () => {
    const rule = new EqualsRule()

    test('aceita par igual', () =>
      expect(rule.validate(['senha', 'senha'])).toBeNull())
    test('rejeita par diferente', () =>
      expect(rule.validate(['senha', 'outra'])).toBe('invalid.equals'))
    test.each([[['senha']], [['a', 'b', 'c']], ['senha'], [null]])(
      'rejeita valor que não é par %p',
      (value) => expect(rule.validate(value)).toBe('invalid.equals'),
    )
  })
})

describe('NotEqualsRule', () => {
  test('errorCode', () =>
    expect(new NotEqualsRule('x').errorCode).toBe('invalid.not-equals'))

  describe('modo valor fixo', () => {
    const rule = new NotEqualsRule('admin')

    test('expõe forbidden', () => expect(rule.forbidden).toBe('admin'))
    test('aceita valor diferente', () =>
      expect(rule.validate('user')).toBeNull())
    test('rejeita valor igual', () =>
      expect(rule.validate('admin')).toBe('invalid.not-equals'))
  })

  describe('modo par (array de 2 posições)', () => {
    const rule = new NotEqualsRule()

    test('aceita par diferente', () =>
      expect(rule.validate(['atual', 'nova'])).toBeNull())
    test('rejeita par igual', () =>
      expect(rule.validate(['igual', 'igual'])).toBe('invalid.not-equals'))
    test.each([[['so-um']], ['texto'], [undefined]])(
      'rejeita valor que não é par %p',
      (value) => expect(rule.validate(value)).toBe('invalid.not-equals'),
    )
  })
})
