import { isNullish, lengthOf } from '../rule.utils.js'
import type { ValidationRule } from '../validation-rule.interface.js'

/**
 * Valida se o tamanho de uma string ou array está entre `min` e `max`,
 * inclusive.
 *
 * Não valida presença: `null`/`undefined` são aceitos. Valores sem `length`
 * (número, objeto, etc.) são considerados inválidos.
 */
export class RangeLengthRule implements ValidationRule {
  readonly errorCode = 'range.length'

  constructor(
    readonly min: number,
    readonly max: number,
  ) {}

  validate(value: unknown): string | null {
    if (isNullish(value)) {
      return null
    }

    const length = lengthOf(value)

    return length !== null && length >= this.min && length <= this.max
      ? null
      : this.errorCode
  }
}
