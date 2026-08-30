import type { ValidationError } from '../validation/validation-error.js'
import { DomainError } from './domain.error.js'

/**
 * Exceção lançada quando uma ou mais validações de uma entidade falham
 * (HTTP 422 Unprocessable Entity).
 *
 * Agrega em um único disparo todos os {@link ValidationError} coletados pelos
 * validadores. O consumidor percorre {@link ValidationException.errors} e usa
 * `error.fullCode` como chave de i18n.
 */
export class ValidationException extends DomainError {
  constructor(
    readonly errors: readonly ValidationError[],
    message = `Falha de validação: ${errors.length} erro(s) encontrado(s)`,
  ) {
    super(message, 422)
  }

  /**
   * Lança uma {@link ValidationException} contendo `errors` se a lista não
   * estiver vazia. No-op caso contrário.
   *
   * Atalho para o passo final do fluxo: "se houver qualquer erro, lançar uma
   * única exceção com a lista completa".
   */
  static throwIfAny(errors: readonly ValidationError[]): void {
    if (errors.length > 0) {
      throw new ValidationException(errors)
    }
  }
}
