import {
  InRule,
  MaxItemsRule,
  MinItemsRule,
  NotInRule,
  UniqueItemsRule,
} from '../../../src/index'

describe('MinItemsRule', () => {
  const rule = new MinItemsRule(2)

  test('errorCode', () => expect(rule.errorCode).toBe('min.items'))
  test('expõe min', () => expect(rule.min).toBe(2))
  test('aceita array no limite', () =>
    expect(rule.validate([1, 2])).toBeNull())
  test('rejeita array curto', () =>
    expect(rule.validate([1])).toBe('min.items'))
  test('rejeita não-array', () =>
    expect(rule.validate('ab')).toBe('min.items'))
  test.each([null, undefined])('é leniente com %p', (value) =>
    expect(rule.validate(value)).toBeNull(),
  )
})

describe('MaxItemsRule', () => {
  const rule = new MaxItemsRule(2)

  test('errorCode', () => expect(rule.errorCode).toBe('max.items'))
  test('expõe max', () => expect(rule.max).toBe(2))
  test('aceita array no limite', () =>
    expect(rule.validate([1, 2])).toBeNull())
  test('rejeita array longo', () =>
    expect(rule.validate([1, 2, 3])).toBe('max.items'))
  test('rejeita não-array', () =>
    expect(rule.validate('abc')).toBe('max.items'))
  test.each([null, undefined])('é leniente com %p', (value) =>
    expect(rule.validate(value)).toBeNull(),
  )
})

describe('UniqueItemsRule', () => {
  const rule = new UniqueItemsRule()

  test('errorCode', () =>
    expect(rule.errorCode).toBe('invalid.unique-items'))
  test('aceita array sem duplicados', () =>
    expect(rule.validate([1, 2, 3])).toBeNull())
  test('aceita array vazio', () => expect(rule.validate([])).toBeNull())
  test('rejeita duplicados primitivos', () =>
    expect(rule.validate([1, 2, 1])).toBe('invalid.unique-items'))
  test('rejeita duplicados estruturais', () =>
    expect(rule.validate([{ a: 1 }, { a: 1 }])).toBe('invalid.unique-items'))
  test('rejeita não-array', () =>
    expect(rule.validate('abc')).toBe('invalid.unique-items'))
  test.each([null, undefined])('é leniente com %p', (value) =>
    expect(rule.validate(value)).toBeNull(),
  )
})

describe('InRule', () => {
  const rule = new InRule(['a', 'b', { c: 1 }])

  test('errorCode', () => expect(rule.errorCode).toBe('invalid.in'))
  test('expõe allowed', () =>
    expect(rule.allowed).toEqual(['a', 'b', { c: 1 }]))
  test('aceita valor da lista', () => expect(rule.validate('a')).toBeNull())
  test('aceita valor estruturalmente igual', () =>
    expect(rule.validate({ c: 1 })).toBeNull())
  test('rejeita valor fora da lista', () =>
    expect(rule.validate('z')).toBe('invalid.in'))
  test.each([null, undefined])('é leniente com %p', (value) =>
    expect(rule.validate(value)).toBeNull(),
  )
})

describe('NotInRule', () => {
  const rule = new NotInRule(['admin', 'root'])

  test('errorCode', () => expect(rule.errorCode).toBe('invalid.not-in'))
  test('expõe blacklist', () =>
    expect(rule.blacklist).toEqual(['admin', 'root']))
  test('aceita valor fora da lista', () =>
    expect(rule.validate('user')).toBeNull())
  test('rejeita valor da lista', () =>
    expect(rule.validate('admin')).toBe('invalid.not-in'))
  test.each([null, undefined])('é leniente com %p', (value) =>
    expect(rule.validate(value)).toBeNull(),
  )
})
