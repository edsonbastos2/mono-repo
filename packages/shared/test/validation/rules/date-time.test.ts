import {
  DateRangeRule,
  DateStringRule,
  FutureDateRule,
  MaxDateRule,
  MinDateRule,
  PastDateRule,
  TimeStringRule,
} from '../../../src/index'

describe('DateStringRule', () => {
  const rule = new DateStringRule()

  test('errorCode', () => expect(rule.errorCode).toBe('invalid.date-string'))
  test.each([
    '2024-01-31',
    '2024-01-31T12:00:00Z',
    '2024-01-31T12:00:00.500Z',
    '2024-01-31 12:00',
    '2024-01-31T12:00:00+03:00',
  ])('aceita %p', (value) => expect(rule.validate(value)).toBeNull())
  test('rejeita formato não-ISO', () =>
    expect(rule.validate('31/01/2024')).toBe('invalid.date-string'))
  test('rejeita data no formato certo mas inexistente', () =>
    expect(rule.validate('2024-99-99')).toBe('invalid.date-string'))
  test('rejeita não-string', () =>
    expect(rule.validate(20240131)).toBe('invalid.date-string'))
  test.each([null, undefined])('é leniente com %p', (value) =>
    expect(rule.validate(value)).toBeNull(),
  )
})

describe('MinDateRule', () => {
  const rule = new MinDateRule('2024-01-01')

  test('errorCode', () => expect(rule.errorCode).toBe('min.date'))
  test('aceita a própria data mínima', () =>
    expect(rule.validate('2024-01-01')).toBeNull())
  test('aceita data posterior', () =>
    expect(rule.validate(new Date('2024-06-01'))).toBeNull())
  test('rejeita data anterior', () =>
    expect(rule.validate('2023-12-31')).toBe('min.date'))
  test('rejeita valor não parseável como data', () =>
    expect(rule.validate('não é data')).toBe('min.date'))
  test('aceita construtor com número (timestamp) e Date', () => {
    expect(new MinDateRule(0).validate('1970-01-02')).toBeNull()
    expect(new MinDateRule(new Date('2024-01-01')).validate('2020-01-01')).toBe(
      'min.date',
    )
  })
  test('lança se a data mínima é inválida', () =>
    expect(() => new MinDateRule('lixo')).toThrow(TypeError))
  test.each([null, undefined])('é leniente com %p', (value) =>
    expect(rule.validate(value)).toBeNull(),
  )
})

describe('MaxDateRule', () => {
  const rule = new MaxDateRule('2024-12-31')

  test('errorCode', () => expect(rule.errorCode).toBe('max.date'))
  test('aceita a própria data máxima', () =>
    expect(rule.validate('2024-12-31')).toBeNull())
  test('aceita data anterior', () =>
    expect(rule.validate('2024-01-01')).toBeNull())
  test('rejeita data posterior', () =>
    expect(rule.validate('2025-01-01')).toBe('max.date'))
  test('rejeita valor não parseável como data', () =>
    expect(rule.validate('xpto')).toBe('max.date'))
  test('lança se a data máxima é inválida', () =>
    expect(() => new MaxDateRule('lixo')).toThrow(TypeError))
  test.each([null, undefined])('é leniente com %p', (value) =>
    expect(rule.validate(value)).toBeNull(),
  )
})

describe('DateRangeRule', () => {
  const rule = new DateRangeRule('2024-01-01', '2024-12-31')

  test('errorCode', () => expect(rule.errorCode).toBe('range.date'))
  test.each(['2024-01-01', '2024-06-15', '2024-12-31'])(
    'aceita %p',
    (value) => expect(rule.validate(value)).toBeNull(),
  )
  test.each(['2023-12-31', '2025-01-01'])('rejeita %p', (value) =>
    expect(rule.validate(value)).toBe('range.date'),
  )
  test('rejeita valor não parseável como data', () =>
    expect(rule.validate('xpto')).toBe('range.date'))
  test('lança se algum limite é inválido', () => {
    expect(() => new DateRangeRule('lixo', '2024-12-31')).toThrow(TypeError)
    expect(() => new DateRangeRule('2024-01-01', 'lixo')).toThrow(TypeError)
  })
  test.each([null, undefined])('é leniente com %p', (value) =>
    expect(rule.validate(value)).toBeNull(),
  )
})

describe('FutureDateRule', () => {
  const rule = new FutureDateRule()

  test('errorCode', () => expect(rule.errorCode).toBe('invalid.future-date'))
  test('aceita data no futuro', () =>
    expect(rule.validate(new Date(Date.now() + 60_000))).toBeNull())
  test('rejeita data no passado', () =>
    expect(rule.validate(new Date(Date.now() - 60_000))).toBe(
      'invalid.future-date',
    ))
  test('rejeita valor não parseável como data', () =>
    expect(rule.validate('xpto')).toBe('invalid.future-date'))
  test.each([null, undefined])('é leniente com %p', (value) =>
    expect(rule.validate(value)).toBeNull(),
  )
})

describe('PastDateRule', () => {
  const rule = new PastDateRule()

  test('errorCode', () => expect(rule.errorCode).toBe('invalid.past-date'))
  test('aceita data no passado', () =>
    expect(rule.validate(new Date(Date.now() - 60_000))).toBeNull())
  test('rejeita data no futuro', () =>
    expect(rule.validate(new Date(Date.now() + 60_000))).toBe(
      'invalid.past-date',
    ))
  test('rejeita valor não parseável como data', () =>
    expect(rule.validate('xpto')).toBe('invalid.past-date'))
  test.each([null, undefined])('é leniente com %p', (value) =>
    expect(rule.validate(value)).toBeNull(),
  )
})

describe('TimeStringRule', () => {
  const rule = new TimeStringRule()

  test('errorCode', () => expect(rule.errorCode).toBe('invalid.time-string'))
  test.each(['00:00', '09:30', '23:59', '12:00:00'])('aceita %p', (value) =>
    expect(rule.validate(value)).toBeNull(),
  )
  test.each(['24:00', '12:60', '9:30', '12:00:60', 'meio-dia'])(
    'rejeita %p',
    (value) => expect(rule.validate(value)).toBe('invalid.time-string'),
  )
  test('rejeita não-string', () =>
    expect(rule.validate(930)).toBe('invalid.time-string'))
  test.each([null, undefined])('é leniente com %p', (value) =>
    expect(rule.validate(value)).toBeNull(),
  )
})
