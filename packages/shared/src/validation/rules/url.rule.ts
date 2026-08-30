import { isNullish } from '../rule.utils.js'
import type { ValidationRule } from '../validation-rule.interface.js'

/**
 * Valida uma URL absoluta com protocolo `http` ou `https`.
 *
 * Não valida presença: `null`/`undefined` são aceitos. Valores que não são
 * string são considerados inválidos.
 */
export class UrlRule implements ValidationRule {
  readonly errorCode = 'invalid.url'

  validate(value: unknown): string | null {
    if (isNullish(value)) {
      return null
    }

    if (typeof value !== 'string') {
      return this.errorCode
    }

    let parsed: URL

    try {
      parsed = new URL(value)
    } catch {
      return this.errorCode
    }

    return parsed.protocol === 'http:' || parsed.protocol === 'https:'
      ? null
      : this.errorCode
  }
}
