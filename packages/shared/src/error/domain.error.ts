/**
 * Erro base de domínio da aplicação.
 *
 * Todas as classes de erro da aplicação devem herdar de `DomainError`. Ela
 * estende o `Error` nativo do JavaScript e expõe um `statusCode` que as
 * subclasses sobrescrevem de acordo com o tipo de erro (validação, não
 * encontrado, não autorizado, etc.).
 */
export class DomainError extends Error {
  /**
   * Código de status HTTP associado ao erro. `400` por padrão; cada subclasse
   * sobrescreve com o valor apropriado.
   */
  readonly statusCode: number

  constructor(message: string, statusCode = 400) {
    super(message)

    this.statusCode = statusCode

    // Mantém o nome da classe concreta (`ValidationError`, `NotFoundError`, ...)
    this.name = new.target.name

    // Garante a cadeia de protótipos correta ao transpilar para ES5/ES2015.
    Object.setPrototypeOf(this, new.target.prototype)

    // Remove o próprio construtor do stack trace (apenas V8).
    Error.captureStackTrace?.(this, new.target)
  }
}
