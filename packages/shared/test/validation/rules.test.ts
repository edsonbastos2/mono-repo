import {
  AgeRule,
  DateRule,
  EmailRule,
  MaxLengthRule,
  MinLengthRule,
  RangeLengthRule,
  RequiredRule,
  isNullish,
  lengthOf,
  toValidDate,
} from '../../src/index'

describe('RequiredRule', () => {
  const rule = new RequiredRule()

  test('errorCode', () => expect(rule.errorCode).toBe('required'))

  test.each([null, undefined, '', '   '])('rejeita %p', (value) => {
    expect(rule.validate(value)).toBe('required')
  })

  test.each([[0], [false], ['a'], [[]], [{ a: 1 }]])('aceita %p', (value) => {
    expect(rule.validate(value)).toBeNull()
  })
})

describe('EmailRule', () => {
  const rule = new EmailRule()

  test('errorCode', () => expect(rule.errorCode).toBe('invalid.email'))

  test.each(['a@b.co', 'joao.silva@example.com.br'])('aceita %p', (value) => {
    expect(rule.validate(value)).toBeNull()
  })

  test.each(['plainaddress', 'a@b', 'a b@c.com', '@sem-local.com', 42])(
    'rejeita %p',
    (value) => {
      expect(rule.validate(value)).toBe('invalid.email')
    },
  )

  test.each([null, undefined])('é leniente com %p', (value) => {
    expect(rule.validate(value)).toBeNull()
  })
})

describe('MinLengthRule', () => {
  const rule = new MinLengthRule(3)

  test('errorCode', () => expect(rule.errorCode).toBe('min.length'))
  test('expõe min', () => expect(rule.min).toBe(3))
  test('aceita string no limite', () =>
    expect(rule.validate('abc')).toBeNull())
  test('rejeita string curta', () =>
    expect(rule.validate('ab')).toBe('min.length'))
  test('conta itens de array', () =>
    expect(rule.validate([1, 2, 3])).toBeNull())
  test('rejeita valor sem length', () =>
    expect(rule.validate(5)).toBe('min.length'))
  test.each([null, undefined])('é leniente com %p', (value) => {
    expect(rule.validate(value)).toBeNull()
  })
})

describe('MaxLengthRule', () => {
  const rule = new MaxLengthRule(3)

  test('errorCode', () => expect(rule.errorCode).toBe('max.length'))
  test('expõe max', () => expect(rule.max).toBe(3))
  test('aceita string no limite', () =>
    expect(rule.validate('abc')).toBeNull())
  test('rejeita string longa', () =>
    expect(rule.validate('abcd')).toBe('max.length'))
  test('rejeita valor sem length', () =>
    expect(rule.validate(5)).toBe('max.length'))
  test.each([null, undefined])('é leniente com %p', (value) => {
    expect(rule.validate(value)).toBeNull()
  })
})

describe('RangeLengthRule', () => {
  const rule = new RangeLengthRule(2, 4)

  test('errorCode', () => expect(rule.errorCode).toBe('range.length'))
  test('expõe min e max', () => {
    expect(rule.min).toBe(2)
    expect(rule.max).toBe(4)
  })
  test.each(['ab', 'abc', 'abcd'])('aceita %p', (value) =>
    expect(rule.validate(value)).toBeNull(),
  )
  test.each(['a', 'abcde'])('rejeita %p', (value) =>
    expect(rule.validate(value)).toBe('range.length'),
  )
  test('rejeita valor sem length', () =>
    expect(rule.validate(3)).toBe('range.length'))
  test.each([null, undefined])('é leniente com %p', (value) => {
    expect(rule.validate(value)).toBeNull()
  })
})

describe('DateRule', () => {
  const rule = new DateRule()

  test('errorCode', () => expect(rule.errorCode).toBe('invalid.date'))
  test('aceita Date válida', () =>
    expect(rule.validate(new Date('2020-01-01'))).toBeNull())
  test('aceita string ISO', () =>
    expect(rule.validate('2020-01-01')).toBeNull())
  test('aceita timestamp numérico', () =>
    expect(rule.validate(0)).toBeNull())
  test('rejeita Date inválida', () =>
    expect(rule.validate(new Date('nope'))).toBe('invalid.date'))
  test('rejeita string não parseável', () =>
    expect(rule.validate('trinta de fevereiro')).toBe('invalid.date'))
  test('rejeita objeto', () =>
    expect(rule.validate({})).toBe('invalid.date'))
  test.each([null, undefined])('é leniente com %p', (value) => {
    expect(rule.validate(value)).toBeNull()
  })
})

describe('AgeRule', () => {
  const rule = new AgeRule(18, 65)

  function nascimentoParaIdade(anos: number, deslocamentoDias = 0): Date {
    const hoje = new Date()
    return new Date(
      hoje.getFullYear() - anos,
      hoje.getMonth(),
      hoje.getDate() + deslocamentoDias,
    )
  }

  test('errorCode', () => expect(rule.errorCode).toBe('invalid.age'))
  test('expõe min e max', () => {
    expect(rule.min).toBe(18)
    expect(rule.max).toBe(65)
  })
  test('aceita idade no limite inferior', () =>
    expect(rule.validate(nascimentoParaIdade(18))).toBeNull())
  test('aceita idade no limite superior', () =>
    expect(rule.validate(nascimentoParaIdade(65))).toBeNull())
  test('rejeita idade abaixo do mínimo', () =>
    expect(rule.validate(nascimentoParaIdade(17))).toBe('invalid.age'))
  test('rejeita idade acima do máximo', () =>
    expect(rule.validate(nascimentoParaIdade(66))).toBe('invalid.age'))
  test('aceita string parseável', () =>
    expect(rule.validate(nascimentoParaIdade(30).toISOString())).toBeNull())
  test('rejeita valor não parseável como data', () =>
    expect(rule.validate('não é data')).toBe('invalid.age'))
  test('desconta o ano quando o aniversário ainda não ocorreu', () =>
    expect(new AgeRule(18, 65).validate(nascimentoParaIdade(18, 1))).toBe(
      'invalid.age',
    ))
  test.each([null, undefined])('é leniente com %p', (value) => {
    expect(rule.validate(value)).toBeNull()
  })
})

describe('rule.utils', () => {
  test('isNullish', () => {
    expect(isNullish(null)).toBe(true)
    expect(isNullish(undefined)).toBe(true)
    expect(isNullish(0)).toBe(false)
    expect(isNullish('')).toBe(false)
  })

  test('lengthOf', () => {
    expect(lengthOf('abc')).toBe(3)
    expect(lengthOf([1, 2])).toBe(2)
    expect(lengthOf(5)).toBeNull()
    expect(lengthOf({ length: 3 })).toBeNull()
  })

  test('toValidDate', () => {
    expect(toValidDate(new Date('2020-01-01'))).toBeInstanceOf(Date)
    expect(toValidDate('2020-01-01')).toBeInstanceOf(Date)
    expect(toValidDate(0)).toBeInstanceOf(Date)
    expect(toValidDate(new Date('nope'))).toBeNull()
    expect(toValidDate('lixo')).toBeNull()
    expect(toValidDate({})).toBeNull()
    expect(toValidDate(null)).toBeNull()
  })
})
