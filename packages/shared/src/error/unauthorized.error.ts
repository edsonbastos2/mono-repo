import { DomainError } from './domain.error.js'

/**
 * Erro de autenticação ausente ou inválida (HTTP 401 Unauthorized).
 */
export class UnauthorizedError extends DomainError {
  constructor(message: string) {
    super(message, 401)
  }
}
