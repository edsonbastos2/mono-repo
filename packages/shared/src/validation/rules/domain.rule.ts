import { isNullish } from '../rule.utils.js'
import type { ValidationRule } from '../validation-rule.interface.js'

/**
 * Rótulos `[a-z0-9-]` (sem hífen nas pontas), separados por ponto, terminando
 * num TLD de ao menos duas letras.
 */
const DOMAIN_PATTERN =
  /^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,}$/i

/**
 * Valida um domínio (`exemplo.com.br`) — sem protocolo, porta, caminho ou
 * espaços.
 *
 * Não valida presença: `null`/`undefined` são aceitos. Valores que não são
 * string são considerados inválidos.
 */
export class DomainRule implements ValidationRule {
  readonly errorCode = 'invalid.domain'

  validate(value: unknown): string | null {
    if (isNullish(value)) {
      return null
    }

    if (typeof value !== 'string') {
      return this.errorCode
    }

    return DOMAIN_PATTERN.test(value) ? null : this.errorCode
  }
}
