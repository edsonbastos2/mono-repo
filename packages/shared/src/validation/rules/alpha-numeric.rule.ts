import { isNullish } from '../rule.utils.js'
import type { ValidationRule } from '../validation-rule.interface.js'

/**
 * Aceita apenas letras não acentuadas e dígitos (`a-z`, `A-Z`, `0-9`), com pelo
 * menos um caractere.
 *
 * Não valida presença: `null`/`undefined` são aceitos. Valores que não são
 * string são considerados inválidos.
 */
export class AlphaNumericRule implements ValidationRule {
  readonly errorCode = 'invalid.alphanumeric'

  validate(value: unknown): string | null {
    if (isNullish(value)) {
      return null
    }

    if (typeof value !== 'string') {
      return this.errorCode
    }

    return /^[a-zA-Z0-9]+$/.test(value) ? null : this.errorCode
  }
}
