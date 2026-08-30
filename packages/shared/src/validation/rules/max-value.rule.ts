import { isFiniteNumber, isNullish } from '../rule.utils.js'
import type { ValidationRule } from '../validation-rule.interface.js'

/**
 * Valida o valor máximo numérico (`value <= max`).
 *
 * Não valida presença: `null`/`undefined` são aceitos. Valores que não são
 * `number` finito são considerados inválidos.
 */
export class MaxValueRule implements ValidationRule {
  readonly errorCode = 'max.value'

  constructor(readonly max: number) {}

  validate(value: unknown): string | null {
    if (isNullish(value)) {
      return null
    }

    if (!isFiniteNumber(value)) {
      return this.errorCode
    }

    return value <= this.max ? null : this.errorCode
  }
}
