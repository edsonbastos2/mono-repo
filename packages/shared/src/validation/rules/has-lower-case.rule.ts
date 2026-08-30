import { isNullish } from '../rule.utils.js'
import type { ValidationRule } from '../validation-rule.interface.js'

/**
 * Exige ao menos uma letra minúscula não acentuada (`a-z`).
 *
 * Não valida presença: `null`/`undefined` são aceitos. Valores que não são
 * string são considerados inválidos.
 */
export class HasLowerCaseRule implements ValidationRule {
  readonly errorCode = 'invalid.has-lowercase'

  validate(value: unknown): string | null {
    if (isNullish(value)) {
      return null
    }

    if (typeof value !== 'string') {
      return this.errorCode
    }

    return /[a-z]/.test(value) ? null : this.errorCode
  }
}
