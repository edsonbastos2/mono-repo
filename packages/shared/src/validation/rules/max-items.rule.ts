import { isNullish } from '../rule.utils.js'
import type { ValidationRule } from '../validation-rule.interface.js'

/**
 * Exige um array com no máximo `max` itens.
 *
 * Não valida presença: `null`/`undefined` são aceitos. Valores que não são
 * array são considerados inválidos.
 */
export class MaxItemsRule implements ValidationRule {
  readonly errorCode = 'max.items'

  constructor(readonly max: number) {}

  validate(value: unknown): string | null {
    if (isNullish(value)) {
      return null
    }

    if (!Array.isArray(value)) {
      return this.errorCode
    }

    return value.length <= this.max ? null : this.errorCode
  }
}
