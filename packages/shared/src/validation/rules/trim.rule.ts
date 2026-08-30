import { isNullish } from '../rule.utils.js'
import type { ValidationRule } from '../validation-rule.interface.js'

/**
 * Rejeita strings com espaços em branco no início ou no fim.
 *
 * Não valida presença: `null`/`undefined` são aceitos. Valores que não são
 * string são considerados inválidos.
 */
export class TrimRule implements ValidationRule {
  readonly errorCode = 'invalid.trim'

  validate(value: unknown): string | null {
    if (isNullish(value)) {
      return null
    }

    if (typeof value !== 'string') {
      return this.errorCode
    }

    return value === value.trim() ? null : this.errorCode
  }
}
