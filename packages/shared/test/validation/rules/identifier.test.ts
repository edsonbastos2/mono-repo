import {
  HexColorRule,
  JsonStringRule,
  SlugRule,
  UuidRule,
} from '../../../src/index'

describe('UuidRule', () => {
  const rule = new UuidRule()

  test('errorCode', () => expect(rule.errorCode).toBe('invalid.uuid'))
  test.each([
    '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d',
    '3D2170D8-9F9A-4E7C-8B1A-1E5C7B9F0A11',
  ])('aceita %p', (value) => expect(rule.validate(value)).toBeNull())
  test.each([
    '9b1deb4d-3b7d-1bad-9bdd-2b0d7b3dcb6d',
    '9b1deb4d3b7d4bad9bdd2b0d7b3dcb6d',
    'not-a-uuid',
  ])('rejeita %p', (value) =>
    expect(rule.validate(value)).toBe('invalid.uuid'),
  )
  test('rejeita não-string', () =>
    expect(rule.validate(1)).toBe('invalid.uuid'))
  test.each([null, undefined])('é leniente com %p', (value) =>
    expect(rule.validate(value)).toBeNull(),
  )
})

describe('SlugRule', () => {
  const rule = new SlugRule()

  test('errorCode', () => expect(rule.errorCode).toBe('invalid.slug'))
  test.each(['meu-texto-aqui', 'abc', 'a1-b2-c3'])('aceita %p', (value) =>
    expect(rule.validate(value)).toBeNull(),
  )
  test.each(['Meu-Texto', 'com espaco', '-inicio', 'fim-', 'dois--hifens', ''])(
    'rejeita %p',
    (value) => expect(rule.validate(value)).toBe('invalid.slug'),
  )
  test('rejeita não-string', () =>
    expect(rule.validate(1)).toBe('invalid.slug'))
  test.each([null, undefined])('é leniente com %p', (value) =>
    expect(rule.validate(value)).toBeNull(),
  )
})

describe('HexColorRule', () => {
  const rule = new HexColorRule()

  test('errorCode', () => expect(rule.errorCode).toBe('invalid.hex-color'))
  test.each(['#FFF', '#ffffff', '#0a1B2c'])('aceita %p', (value) =>
    expect(rule.validate(value)).toBeNull(),
  )
  test.each(['FFF', '#FF', '#FFFF', '#GGGGGG', '#fffffff'])(
    'rejeita %p',
    (value) => expect(rule.validate(value)).toBe('invalid.hex-color'),
  )
  test('rejeita não-string', () =>
    expect(rule.validate(1)).toBe('invalid.hex-color'))
  test.each([null, undefined])('é leniente com %p', (value) =>
    expect(rule.validate(value)).toBeNull(),
  )
})

describe('JsonStringRule', () => {
  const rule = new JsonStringRule()

  test('errorCode', () => expect(rule.errorCode).toBe('invalid.json-string'))
  test.each(['{"a":1}', '[1,2,3]', '"texto"', 'null', '42'])(
    'aceita %p',
    (value) => expect(rule.validate(value)).toBeNull(),
  )
  test.each(['{a:1}', "{'a':1}", '', 'undefined'])('rejeita %p', (value) =>
    expect(rule.validate(value)).toBe('invalid.json-string'),
  )
  test('rejeita não-string', () =>
    expect(rule.validate({ a: 1 })).toBe('invalid.json-string'))
  test.each([null, undefined])('é leniente com %p', (value) =>
    expect(rule.validate(value)).toBeNull(),
  )
})
