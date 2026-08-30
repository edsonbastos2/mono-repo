import { isNullish, toValidDate } from '../rule.utils.js'
import type { ValidationRule } from '../validation-rule.interface.js'

/**
 * Exige uma data menor ou igual a `max`.
 *
 * Aceita `Date` ou string/number parseável, tanto no construtor quanto no
 * valor. Não valida presença: `null`/`undefined` são aceitos. Um valor que não
 * parseia como data é inválido.
 */
export class MaxDateRule implements ValidationRule {
  readonly errorCode = 'max.date'

  private readonly max: Date

  constructor(max: Date | string | number) {
    const parsed = toValidDate(max)

    if (parsed === null) {
      throw new TypeError('MaxDateRule: data máxima inválida')
    }

    this.max = parsed
  }

  validate(value: unknown): string | null {
    if (isNullish(value)) {
      return null
    }

    const date = toValidDate(value)

    if (date === null) {
      return this.errorCode
    }

    return date.getTime() <= this.max.getTime() ? null : this.errorCode
  }
}
