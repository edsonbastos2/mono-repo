import { isNullish, lengthOf } from '../rule.utils.js'
import type { ValidationRule } from '../validation-rule.interface.js'

/**
 * Valida o tamanho máximo de uma string ou array.
 *
 * Não valida presença: `null`/`undefined` são aceitos. Valores sem `length`
 * (número, objeto, etc.) são considerados inválidos.
 */
export class MaxLengthRule implements ValidationRule {
  readonly errorCode = 'max.length'

  constructor(readonly max: number) {}

  validate(value: unknown): string | null {
    if (isNullish(value)) {
      return null
    }

    const length = lengthOf(value)

    return length !== null && length <= this.max ? null : this.errorCode
  }
}
