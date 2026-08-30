import { isNullish } from '../rule.utils.js'
import type { ValidationRule } from '../validation-rule.interface.js'

/** Cinco dígitos, hífen, três dígitos. */
const CEP_PATTERN = /^\d{5}-\d{3}$/

/**
 * Valida um CEP no formato `00000-000`.
 *
 * Não valida presença: `null`/`undefined` são aceitos. Valores que não são
 * string são considerados inválidos.
 */
export class CepRule implements ValidationRule {
  readonly errorCode = 'invalid.cep'

  validate(value: unknown): string | null {
    if (isNullish(value)) {
      return null
    }

    if (typeof value !== 'string') {
      return this.errorCode
    }

    return CEP_PATTERN.test(value) ? null : this.errorCode
  }
}
