import {
  EmailRule,
  Entity,
  MinLengthRule,
  RequiredRule,
  UuidRule,
  ValidationException,
  Validator,
  type EntityProps,
  type ValidationError,
} from '../../src/index'

/**
 * Entidade concreta de exemplo — o caso comum da aplicação.
 *
 * Estende {@link EntityProps} com seus próprios campos e implementa
 * {@link Entity.validate} montando um `Validator` com as regras do módulo de
 * validação.
 */
interface UserProps extends EntityProps {
  name: string
  email: string
  password: string
}

class User extends Entity<UserProps> {
  constructor(props: UserProps) {
    super(props)
  }

  get name(): string {
    return this.props.name
  }

  get email(): string {
    return this.props.email
  }

  get password(): string {
    return this.props.password
  }

  validate(): ValidationError[] {
    return new Validator([
      {
        fieldCode: 'user.name',
        value: this.name,
        rules: [new RequiredRule(), new MinLengthRule(2)],
      },
      {
        fieldCode: 'user.email',
        value: this.email,
        rules: [new RequiredRule(), new EmailRule()],
      },
      {
        fieldCode: 'user.password',
        value: this.password,
        rules: [new RequiredRule(), new MinLengthRule(8)],
      },
    ]).validate()
  }
}

const UUID_V4 =
  /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

function makeUser(overrides: Partial<UserProps> = {}): User {
  return new User({
    name: 'Ana Souza',
    email: 'ana@example.com',
    password: 'senha-forte',
    ...overrides,
  })
}

describe('Entity — id', () => {
  test('gera um UUID v4 quando o id não é informado', () => {
    const user = makeUser()

    expect(user.id).toMatch(UUID_V4)
    expect(new UuidRule().validate(user.id)).toBeNull()
  })

  test('gera ids diferentes para instâncias diferentes', () => {
    expect(makeUser().id).not.toBe(makeUser().id)
  })

  test('preserva o id fornecido nas props', () => {
    const id = '3f1e7c9a-1b2c-4d3e-8f9a-0b1c2d3e4f5a'

    expect(makeUser({ id }).id).toBe(id)
  })
})

describe('Entity — equals (identidade por id)', () => {
  test('true para entidades com o mesmo id', () => {
    const id = 'a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d'

    expect(makeUser({ id }).equals(makeUser({ id, name: 'Outro Nome' }))).toBe(
      true,
    )
  })

  test('true para a própria instância', () => {
    const user = makeUser()

    expect(user.equals(user)).toBe(true)
  })

  test('false para entidades com ids diferentes', () => {
    expect(makeUser().equals(makeUser())).toBe(false)
  })

  test('false para null e undefined', () => {
    const user = makeUser()

    expect(user.equals(null)).toBe(false)
    expect(user.equals(undefined)).toBe(false)
  })

  test('false para valores que não são entidades', () => {
    const user = makeUser()

    expect(user.equals({ id: user.id } as unknown as Entity)).toBe(false)
  })
})

describe('Entity — validate', () => {
  test('retorna lista vazia quando a entidade é válida', () => {
    expect(makeUser().validate()).toEqual([])
  })

  test('acumula os erros de todos os campos inválidos', () => {
    const user = makeUser({ name: '', email: 'nao-e-email', password: '123' })

    expect(user.validate().map((error) => error.fullCode)).toEqual([
      'user.name.required',
      'user.name.min.length',
      'user.email.invalid.email',
      'user.password.min.length',
    ])
  })

  test('compõe com ValidationException.throwIfAny', () => {
    expect(() =>
      ValidationException.throwIfAny(makeUser().validate()),
    ).not.toThrow()

    try {
      ValidationException.throwIfAny(makeUser({ email: 'x' }).validate())
      throw new Error('deveria ter lançado')
    } catch (caught) {
      const exception = caught as ValidationException

      expect(exception).toBeInstanceOf(ValidationException)
      expect(exception.statusCode).toBe(422)
      expect(exception.errors[0]?.fullCode).toBe('user.email.invalid.email')
    }
  })
})
