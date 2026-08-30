import {
  IntegerRule,
  MaxValueRule,
  NegativeRule,
  PositiveRule,
  PrecisionRule,
  RangeValueRule,
} from '../../../src/index'

describe('MaxValueRule', () => {
  const rule = new MaxValueRule(10)

  test('errorCode', () => expect(rule.errorCode).toBe('max.value'))
  test('expõe max', () => expect(rule.max).toBe(10))
  test('aceita valor no limite', () => expect(rule.validate(10)).toBeNull())
  test('aceita valor abaixo', () => expect(rule.validate(-5)).toBeNull())
  test('rejeita valor acima', () =>
    expect(rule.validate(11)).toBe('max.value'))
  test.each(['5', NaN, Infinity, {}])('rejeita não-número %p', (value) =>
    expect(rule.validate(value)).toBe('max.value'),
  )
  test.each([null, undefined])('é leniente com %p', (value) =>
    expect(rule.validate(value)).toBeNull(),
  )
})

describe('RangeValueRule', () => {
  const rule = new RangeValueRule(1, 5)

  test('errorCode', () => expect(rule.errorCode).toBe('range.value'))
  test('expõe min e max', () => {
    expect(rule.min).toBe(1)
    expect(rule.max).toBe(5)
  })
  test.each([1, 3, 5])('aceita %p', (value) =>
    expect(rule.validate(value)).toBeNull(),
  )
  test.each([0, 6])('rejeita %p', (value) =>
    expect(rule.validate(value)).toBe('range.value'),
  )
  test('rejeita não-número', () =>
    expect(rule.validate('3')).toBe('range.value'))
  test.each([null, undefined])('é leniente com %p', (value) =>
    expect(rule.validate(value)).toBeNull(),
  )
})

describe('IntegerRule', () => {
  const rule = new IntegerRule()

  test('errorCode', () => expect(rule.errorCode).toBe('invalid.integer'))
  test.each([0, 42, -7])('aceita %p', (value) =>
    expect(rule.validate(value)).toBeNull(),
  )
  test.each([1.5, '5', NaN, Infinity, {}])('rejeita %p', (value) =>
    expect(rule.validate(value)).toBe('invalid.integer'),
  )
  test.each([null, undefined])('é leniente com %p', (value) =>
    expect(rule.validate(value)).toBeNull(),
  )
})

describe('PositiveRule', () => {
  const rule = new PositiveRule()

  test('errorCode', () => expect(rule.errorCode).toBe('invalid.positive'))
  test('aceita maior que zero', () =>
    expect(rule.validate(0.1)).toBeNull())
  test.each([0, -1])('rejeita %p', (value) =>
    expect(rule.validate(value)).toBe('invalid.positive'),
  )
  test('rejeita não-número', () =>
    expect(rule.validate('1')).toBe('invalid.positive'))
  test.each([null, undefined])('é leniente com %p', (value) =>
    expect(rule.validate(value)).toBeNull(),
  )
})

describe('NegativeRule', () => {
  const rule = new NegativeRule()

  test('errorCode', () => expect(rule.errorCode).toBe('invalid.negative'))
  test('aceita menor que zero', () =>
    expect(rule.validate(-0.1)).toBeNull())
  test.each([0, 1])('rejeita %p', (value) =>
    expect(rule.validate(value)).toBe('invalid.negative'),
  )
  test('rejeita não-número', () =>
    expect(rule.validate('-1')).toBe('invalid.negative'))
  test.each([null, undefined])('é leniente com %p', (value) =>
    expect(rule.validate(value)).toBeNull(),
  )
})

describe('PrecisionRule', () => {
  const rule = new PrecisionRule(2)

  test('errorCode', () => expect(rule.errorCode).toBe('invalid.precision'))
  test('expõe maxDecimals', () => expect(rule.maxDecimals).toBe(2))
  test.each([5, 1.2, 1.23, -0.99])('aceita %p', (value) =>
    expect(rule.validate(value)).toBeNull(),
  )
  test('rejeita casas decimais em excesso', () =>
    expect(rule.validate(1.234)).toBe('invalid.precision'))
  test('rejeita notação científica', () =>
    expect(rule.validate(1e-7)).toBe('invalid.precision'))
  test('rejeita não-número', () =>
    expect(rule.validate('1.2')).toBe('invalid.precision'))
  test.each([null, undefined])('é leniente com %p', (value) =>
    expect(rule.validate(value)).toBeNull(),
  )
})
