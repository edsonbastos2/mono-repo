import { isNullish } from '../rule.utils.js'
import type { ValidationRule } from '../validation-rule.interface.js'

/**
 * Aceita apenas letras maiúsculas não acentuadas (`A-Z`), com pelo menos um
 * caractere.
 *
 * Não valida presença: `null`/`undefined` são aceitos. Valores que não são
 * string são considerados inválidos.
 */
export class UpperCaseRule implements ValidationRule {
  readonly errorCode = 'invalid.uppercase'

  validate(value: unknown): string | null {
    if (isNullish(value)) {
      return null
    }

    if (typeof value !== 'string') {
      return this.errorCode
    }

    return /^[A-Z]+$/.test(value) ? null : this.errorCode
  }
}
