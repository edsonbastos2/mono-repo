import {
  CepRule,
  CnpjRule,
  CpfRule,
  PhoneBrRule,
  RgRule,
} from '../../../src/index'

describe('CpfRule', () => {
  const rule = new CpfRule()

  test('errorCode', () => expect(rule.errorCode).toBe('invalid.cpf'))
  test.each(['111.444.777-35', '11144477735', '529.982.247-25', '00000000604'])(
    'aceita CPF válido %p',
    (value) => expect(rule.validate(value)).toBeNull(),
  )
  test.each([
    '111.444.777-36', // primeiro dígito ok, segundo errado
    '11144477700', // dígitos verificadores errados
    '123', // curto
    '111.444.777-3X', // caractere inválido
  ])('rejeita %p', (value) =>
    expect(rule.validate(value)).toBe('invalid.cpf'),
  )
  test('rejeita sequência de dígitos repetidos', () =>
    expect(rule.validate('111.111.111-11')).toBe('invalid.cpf'))
  test('rejeita não-string', () =>
    expect(rule.validate(11144477735)).toBe('invalid.cpf'))
  test.each([null, undefined])('é leniente com %p', (value) =>
    expect(rule.validate(value)).toBeNull(),
  )
})

describe('CnpjRule', () => {
  const rule = new CnpjRule()

  test('errorCode', () => expect(rule.errorCode).toBe('invalid.cnpj'))
  test.each([
    '11.222.333/0001-81',
    '11222333000181',
    '00000000000604',
  ])('aceita CNPJ válido %p', (value) =>
    expect(rule.validate(value)).toBeNull(),
  )
  test.each([
    '11.222.333/0001-82', // dígito verificador errado
    '11222333000100',
    '123', // curto
  ])('rejeita %p', (value) =>
    expect(rule.validate(value)).toBe('invalid.cnpj'),
  )
  test('rejeita sequência de dígitos repetidos', () =>
    expect(rule.validate('11.111.111/1111-11')).toBe('invalid.cnpj'))
  test('rejeita não-string', () =>
    expect(rule.validate(11222333000181)).toBe('invalid.cnpj'))
  test.each([null, undefined])('é leniente com %p', (value) =>
    expect(rule.validate(value)).toBeNull(),
  )
})

describe('CepRule', () => {
  const rule = new CepRule()

  test('errorCode', () => expect(rule.errorCode).toBe('invalid.cep'))
  test('aceita CEP no formato 00000-000', () =>
    expect(rule.validate('01310-100')).toBeNull())
  test.each(['01310100', '01310-10', '0131-1000', 'abcde-fgh'])(
    'rejeita %p',
    (value) => expect(rule.validate(value)).toBe('invalid.cep'),
  )
  test('rejeita não-string', () =>
    expect(rule.validate(1310100)).toBe('invalid.cep'))
  test.each([null, undefined])('é leniente com %p', (value) =>
    expect(rule.validate(value)).toBeNull(),
  )
})

describe('PhoneBrRule', () => {
  const rule = new PhoneBrRule()

  test('errorCode', () => expect(rule.errorCode).toBe('invalid.phone-br'))
  test.each([
    '(11) 91234-5678',
    '11912345678',
    '+55 11 91234-5678',
    '1132145678', // fixo, 8 dígitos
    '5511912345678',
  ])('aceita %p', (value) => expect(rule.validate(value)).toBeNull())
  test.each([
    '0119123456', // DDD começa com 0
    '9999', // curto
    '119123456789', // dígitos demais
  ])('rejeita %p', (value) =>
    expect(rule.validate(value)).toBe('invalid.phone-br'),
  )
  test('rejeita não-string', () =>
    expect(rule.validate(11912345678)).toBe('invalid.phone-br'))
  test.each([null, undefined])('é leniente com %p', (value) =>
    expect(rule.validate(value)).toBeNull(),
  )
})

describe('RgRule', () => {
  const rule = new RgRule()

  test('errorCode', () => expect(rule.errorCode).toBe('invalid.rg'))
  test.each(['12.345.678-9', '123456789', '12.345.678-X', '1234567'])(
    'aceita %p',
    (value) => expect(rule.validate(value)).toBeNull(),
  )
  test.each(['123', '12.345.678-YZ', 'abcdef'])('rejeita %p', (value) =>
    expect(rule.validate(value)).toBe('invalid.rg'),
  )
  test('rejeita não-string', () =>
    expect(rule.validate(123456789)).toBe('invalid.rg'))
  test.each([null, undefined])('é leniente com %p', (value) =>
    expect(rule.validate(value)).toBeNull(),
  )
})
