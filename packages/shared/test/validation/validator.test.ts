import {
  DomainError,
  EmailRule,
  MinLengthRule,
  RequiredRule,
  ValidationError,
  ValidationException,
  Validator,
} from '../../src/index'

describe('ValidationError (objeto de valor)', () => {
  test('compõe fullCode a partir de fieldCode + errorCode', () => {
    const error = new ValidationError('user.email', 'invalid.email')

    expect(error.fieldCode).toBe('user.email')
    expect(error.errorCode).toBe('invalid.email')
    expect(error.fullCode).toBe('user.email.invalid.email')
  })

  test('não é um Error lançável', () => {
    expect(new ValidationError('user.name', 'required')).not.toBeInstanceOf(
      Error,
    )
  })
})

describe('Validator', () => {
  test('retorna lista vazia quando todas as regras de todos os campos passam', () => {
    const validator = new Validator([
      {
        fieldCode: 'user.email',
        value: 'joao@example.com',
        rules: [new RequiredRule(), new EmailRule()],
      },
      {
        fieldCode: 'user.name',
        value: 'Ana',
        rules: [new RequiredRule()],
      },
    ])

    expect(validator.validate()).toEqual([])
  })

  test('acumula todos os erros de um campo — não para na primeira falha', () => {
    const validator = new Validator([
      {
        fieldCode: 'user.password',
        value: '',
        rules: [new RequiredRule(), new MinLengthRule(8)],
      },
    ])

    expect(validator.validate().map((error) => error.fullCode)).toEqual([
      'user.password.required',
      'user.password.min.length',
    ])
  })

  test('valida vários campos de uma vez e junta todos os erros', () => {
    const validator = new Validator([
      { fieldCode: 'user.name', value: '', rules: [new RequiredRule()] },
      {
        fieldCode: 'user.email',
        value: 'nao-e-email',
        rules: [new RequiredRule(), new EmailRule()],
      },
      { fieldCode: 'user.bio', value: 'ok', rules: [new MinLengthRule(2)] },
    ])

    expect(validator.validate().map((error) => error.fullCode)).toEqual([
      'user.name.required',
      'user.email.invalid.email',
    ])
  })

  test('preserva a ordem dos campos e, dentro do campo, a ordem das regras', () => {
    const validator = new Validator([
      {
        fieldCode: 'user.email',
        value: 'x',
        rules: [new EmailRule(), new MinLengthRule(50)],
      },
    ])

    expect(validator.validate().map((error) => error.errorCode)).toEqual([
      'invalid.email',
      'min.length',
    ])
  })

  test('expõe os fields recebidos no construtor', () => {
    const fields = [
      { fieldCode: 'product.name', value: 'X', rules: [new RequiredRule()] },
    ]
    const validator = new Validator(fields)

    expect(validator.fields).toBe(fields)
  })

  test('sem campos, retorna lista vazia', () => {
    expect(new Validator([]).validate()).toEqual([])
  })

  test('campo sem regras não gera erro', () => {
    const validator = new Validator([
      { fieldCode: 'qualquer', value: undefined, rules: [] },
    ])

    expect(validator.validate()).toEqual([])
  })
})

describe('Fluxo agregado com ValidationException', () => {
  function validarEntidade(): ValidationError[] {
    return new Validator([
      { fieldCode: 'user.name', value: 'Ana', rules: [new RequiredRule()] },
      {
        fieldCode: 'user.email',
        value: 'nao-e-email',
        rules: [new RequiredRule(), new EmailRule()],
      },
    ]).validate()
  }

  test('throwIfAny lança uma única exceção com todos os erros', () => {
    const errors = validarEntidade()

    expect(() => ValidationException.throwIfAny(errors)).toThrow(
      ValidationException,
    )

    try {
      ValidationException.throwIfAny(errors)
      throw new Error('deveria ter lançado')
    } catch (caught) {
      const exception = caught as ValidationException

      expect(exception).toBeInstanceOf(DomainError)
      expect(exception).toBeInstanceOf(Error)
      expect(exception.name).toBe('ValidationException')
      expect(exception.statusCode).toBe(422)
      expect(exception.errors).toHaveLength(1)
      expect(exception.errors[0]?.fullCode).toBe('user.email.invalid.email')
    }
  })

  test('throwIfAny é no-op quando não há erros', () => {
    expect(() => ValidationException.throwIfAny([])).not.toThrow()
  })

  test('a exceção também pode ser construída diretamente', () => {
    const exception = new ValidationException([
      new ValidationError('user.name', 'required'),
    ])

    expect(exception.message).toContain('1 erro(s)')
  })
})
