import { DomainError } from './domain.error.js'

/**
 * Erro para recurso inexistente (HTTP 404 Not Found).
 */
export class NotFoundError extends DomainError {
  constructor(message: string) {
    super(message, 404)
  }
}
