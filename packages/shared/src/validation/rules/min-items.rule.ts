import { isNullish } from '../rule.utils.js'
import type { ValidationRule } from '../validation-rule.interface.js'

/**
 * Exige um array com pelo menos `min` itens.
 *
 * Não valida presença: `null`/`undefined` são aceitos. Valores que não são
 * array são considerados inválidos.
 */
export class MinItemsRule implements ValidationRule {
  readonly errorCode = 'min.items'

  constructor(readonly min: number) {}

  validate(value: unknown): string | null {
    if (isNullish(value)) {
      return null
    }

    if (!Array.isArray(value)) {
      return this.errorCode
    }

    return value.length >= this.min ? null : this.errorCode
  }
}
