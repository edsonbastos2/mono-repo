import { DomainError, NotFoundError, UnauthorizedError } from '../src/index'

describe('DomainError', () => {
  test('herda de Error e do próprio DomainError', () => {
    const error = new DomainError('falha genérica')

    expect(error).toBeInstanceOf(Error)
    expect(error).toBeInstanceOf(DomainError)
  })

  test('usa o statusCode 400 por padrão e preserva a mensagem', () => {
    const error = new DomainError('falha genérica')

    expect(error.statusCode).toBe(400)
    expect(error.message).toBe('falha genérica')
    expect(error.name).toBe('DomainError')
  })
})

describe('Subclasses de DomainError', () => {
  const cases = [
    { Err: NotFoundError, statusCode: 404 },
    { Err: UnauthorizedError, statusCode: 401 },
  ] as const

  test.each(cases)(
    '$Err.name expõe statusCode $statusCode e mantém a cadeia de instância',
    ({ Err, statusCode }) => {
      const error = new Err('mensagem de teste')

      expect(error).toBeInstanceOf(Err)
      expect(error).toBeInstanceOf(DomainError)
      expect(error).toBeInstanceOf(Error)
      expect(error.statusCode).toBe(statusCode)
      expect(error.name).toBe(Err.name)
      expect(error.message).toBe('mensagem de teste')
    },
  )
})
