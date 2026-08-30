import { isNullish } from '../rule.utils.js'
import type { ValidationRule } from '../validation-rule.interface.js'

/**
 * Exige ao menos um dígito (`0-9`).
 *
 * Não valida presença: `null`/`undefined` são aceitos. Valores que não são
 * string são considerados inválidos.
 */
export class HasNumberRule implements ValidationRule {
  readonly errorCode = 'invalid.has-number'

  validate(value: unknown): string | null {
    if (isNullish(value)) {
      return null
    }

    if (typeof value !== 'string') {
      return this.errorCode
    }

    return /\d/.test(value) ? null : this.errorCode
  }
}
