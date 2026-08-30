import { deepEquals, isFiniteNumber, onlyDigits } from '../../../src/index'

describe('isFiniteNumber', () => {
  test.each([0, -1, 3.14, 1e10])('aceita %p', (value) =>
    expect(isFiniteNumber(value)).toBe(true),
  )
  test.each([NaN, Infinity, -Infinity, '5', null, undefined, {}])(
    'rejeita %p',
    (value) => expect(isFiniteNumber(value)).toBe(false),
  )
})

describe('onlyDigits', () => {
  test('mantém apenas dígitos', () =>
    expect(onlyDigits('(11) 91234-5678')).toBe('11912345678'))
  test('string sem dígitos vira vazio', () =>
    expect(onlyDigits('abc')).toBe(''))
  test.each([42, null, undefined, {}])('não-string vira vazio (%p)', (value) =>
    expect(onlyDigits(value)).toBe(''),
  )
})

describe('deepEquals', () => {
  test('primitivos iguais', () => {
    expect(deepEquals(1, 1)).toBe(true)
    expect(deepEquals('a', 'a')).toBe(true)
    expect(deepEquals(NaN, NaN)).toBe(true)
  })
  test('primitivos diferentes', () => {
    expect(deepEquals(1, 2)).toBe(false)
    expect(deepEquals('a', 'b')).toBe(false)
  })
  test('objeto vs primitivo', () => {
    expect(deepEquals({}, 1)).toBe(false)
    expect(deepEquals(1, {})).toBe(false)
  })
  test('null vs objeto (nos dois sentidos)', () => {
    expect(deepEquals(null, {})).toBe(false)
    expect(deepEquals({}, null)).toBe(false)
  })
  test('arrays', () => {
    expect(deepEquals([1, [2, 3]], [1, [2, 3]])).toBe(true)
    expect(deepEquals([1, 2], [1, 2, 3])).toBe(false)
    expect(deepEquals([1, 2], [1, 9])).toBe(false)
    expect(deepEquals([1], 'não-array')).toBe(false)
    expect(deepEquals('não-array', [1])).toBe(false)
  })
  test('objetos planos', () => {
    expect(deepEquals({ a: 1, b: { c: 2 } }, { a: 1, b: { c: 2 } })).toBe(true)
    expect(deepEquals({ a: 1 }, { a: 1, b: 2 })).toBe(false)
    expect(deepEquals({ a: 1 }, { b: 1 })).toBe(false)
    expect(deepEquals({ a: 1 }, { a: 2 })).toBe(false)
  })
})
