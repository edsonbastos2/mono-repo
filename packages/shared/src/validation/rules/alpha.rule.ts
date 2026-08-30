import { isNullish } from '../rule.utils.js'
import type { ValidationRule } from '../validation-rule.interface.js'

/**
 * Aceita apenas letras não acentuadas (`a-z`, `A-Z`), com pelo menos um
 * caractere.
 *
 * Não valida presença: `null`/`undefined` são aceitos. Valores que não são
 * string são considerados inválidos.
 */
export class AlphaRule implements ValidationRule {
  readonly errorCode = 'invalid.alpha'

  validate(value: unknown): string | null {
    if (isNullish(value)) {
      return null
    }

    if (typeof value !== 'string') {
      return this.errorCode
    }

    return /^[a-zA-Z]+$/.test(value) ? null : this.errorCode
  }
}
