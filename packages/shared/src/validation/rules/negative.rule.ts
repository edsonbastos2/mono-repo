import { isFiniteNumber, isNullish } from '../rule.utils.js'
import type { ValidationRule } from '../validation-rule.interface.js'

/**
 * Exige um número menor que zero.
 *
 * Não valida presença: `null`/`undefined` são aceitos. Valores que não são
 * `number` finito são considerados inválidos.
 */
export class NegativeRule implements ValidationRule {
  readonly errorCode = 'invalid.negative'

  validate(value: unknown): string | null {
    if (isNullish(value)) {
      return null
    }

    if (!isFiniteNumber(value)) {
      return this.errorCode
    }

    return value < 0 ? null : this.errorCode
  }
}
