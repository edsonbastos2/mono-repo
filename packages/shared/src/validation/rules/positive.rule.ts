import { isFiniteNumber, isNullish } from '../rule.utils.js'
import type { ValidationRule } from '../validation-rule.interface.js'

/**
 * Exige um número maior que zero.
 *
 * Não valida presença: `null`/`undefined` são aceitos. Valores que não são
 * `number` finito são considerados inválidos.
 */
export class PositiveRule implements ValidationRule {
  readonly errorCode = 'invalid.positive'

  validate(value: unknown): string | null {
    if (isNullish(value)) {
      return null
    }

    if (!isFiniteNumber(value)) {
      return this.errorCode
    }

    return value > 0 ? null : this.errorCode
  }
}
