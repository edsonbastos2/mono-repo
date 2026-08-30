import { isNullish } from '../rule.utils.js'
import type { ValidationRule } from '../validation-rule.interface.js'

/**
 * Aceita apenas letras minúsculas não acentuadas (`a-z`), com pelo menos um
 * caractere.
 *
 * Não valida presença: `null`/`undefined` são aceitos. Valores que não são
 * string são considerados inválidos.
 */
export class LowerCaseRule implements ValidationRule {
  readonly errorCode = 'invalid.lowercase'

  validate(value: unknown): string | null {
    if (isNullish(value)) {
      return null
    }

    if (typeof value !== 'string') {
      return this.errorCode
    }

    return /^[a-z]+$/.test(value) ? null : this.errorCode
  }
}
