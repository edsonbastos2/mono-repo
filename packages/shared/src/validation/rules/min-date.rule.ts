import { isNullish, toValidDate } from '../rule.utils.js'
import type { ValidationRule } from '../validation-rule.interface.js'

/**
 * Exige uma data maior ou igual a `min`.
 *
 * Aceita `Date` ou string/number parseável, tanto no construtor quanto no
 * valor. Não valida presença: `null`/`undefined` são aceitos. Um valor que não
 * parseia como data é inválido.
 */
export class MinDateRule implements ValidationRule {
  readonly errorCode = 'min.date'

  private readonly min: Date

  constructor(min: Date | string | number) {
    const parsed = toValidDate(min)

    if (parsed === null) {
      throw new TypeError('MinDateRule: data mínima inválida')
    }

    this.min = parsed
  }

  validate(value: unknown): string | null {
    if (isNullish(value)) {
      return null
    }

    const date = toValidDate(value)

    if (date === null) {
      return this.errorCode
    }

    return date.getTime() >= this.min.getTime() ? null : this.errorCode
  }
}
