import { isFiniteNumber, isNullish } from '../rule.utils.js'
import type { ValidationRule } from '../validation-rule.interface.js'

/**
 * Valida se o valor numérico está entre `min` e `max`, inclusive.
 *
 * Não valida presença: `null`/`undefined` são aceitos. Valores que não são
 * `number` finito são considerados inválidos.
 */
export class RangeValueRule implements ValidationRule {
  readonly errorCode = 'range.value'

  constructor(
    readonly min: number,
    readonly max: number,
  ) {}

  validate(value: unknown): string | null {
    if (isNullish(value)) {
      return null
    }

    if (!isFiniteNumber(value)) {
      return this.errorCode
    }

    return value >= this.min && value <= this.max ? null : this.errorCode
  }
}
