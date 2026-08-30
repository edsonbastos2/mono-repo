import { DomainError } from './domain.error.js'

/**
 * Erro de validação de dados de entrada (HTTP 422 Unprocessable Entity).
 */
export class ValidationError extends DomainError {
  constructor(message: string) {
    super(message, 422)
  }
}
