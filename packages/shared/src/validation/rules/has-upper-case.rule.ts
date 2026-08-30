import { isNullish } from '../rule.utils.js'
import type { ValidationRule } from '../validation-rule.interface.js'

/**
 * Exige ao menos uma letra maiúscula não acentuada (`A-Z`).
 *
 * Não valida presença: `null`/`undefined` são aceitos. Valores que não são
 * string são considerados inválidos.
 */
export class HasUpperCaseRule implements ValidationRule {
  readonly errorCode = 'invalid.has-uppercase'

  validate(value: unknown): string | null {
    if (isNullish(value)) {
      return null
    }

    if (typeof value !== 'string') {
      return this.errorCode
    }

    return /[A-Z]/.test(value) ? null : this.errorCode
  }
}
