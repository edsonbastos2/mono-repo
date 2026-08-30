import { isNullish, toValidDate } from '../rule.utils.js'
import type { ValidationRule } from '../validation-rule.interface.js'

/**
 * Exige uma data entre `min` e `max`, inclusive.
 *
 * Aceita `Date` ou string/number parseável, tanto no construtor quanto no
 * valor. Não valida presença: `null`/`undefined` são aceitos. Um valor que não
 * parseia como data é inválido.
 */
export class DateRangeRule implements ValidationRule {
  readonly errorCode = 'range.date'

  private readonly min: Date
  private readonly max: Date

  constructor(
    min: Date | string | number,
    max: Date | string | number,
  ) {
    const parsedMin = toValidDate(min)
    const parsedMax = toValidDate(max)

    if (parsedMin === null || parsedMax === null) {
      throw new TypeError('DateRangeRule: limites de data inválidos')
    }

    this.min = parsedMin
    this.max = parsedMax
  }

  validate(value: unknown): string | null {
    if (isNullish(value)) {
      return null
    }

    const date = toValidDate(value)

    if (date === null) {
      return this.errorCode
    }

    const time = date.getTime()

    return time >= this.min.getTime() && time <= this.max.getTime()
      ? null
      : this.errorCode
  }
}
