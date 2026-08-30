import { isNullish, lengthOf } from '../rule.utils.js'
import type { ValidationRule } from '../validation-rule.interface.js'

/**
 * Valida o tamanho mínimo de uma string ou array.
 *
 * Não valida presença: `null`/`undefined` são aceitos. Valores sem `length`
 * (número, objeto, etc.) são considerados inválidos.
 */
export class MinLengthRule implements ValidationRule {
  readonly errorCode = 'min.length'

  constructor(readonly min: number) {}

  validate(value: unknown): string | null {
    if (isNullish(value)) {
      return null
    }

    const length = lengthOf(value)

    return length !== null && length >= this.min ? null : this.errorCode
  }
}
