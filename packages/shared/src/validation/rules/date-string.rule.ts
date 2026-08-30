import { isNullish } from '../rule.utils.js'
import type { ValidationRule } from '../validation-rule.interface.js'

/** Data (`YYYY-MM-DD`) opcionalmente seguida de hora ISO 8601. */
const ISO_8601 =
  /^\d{4}-\d{2}-\d{2}([T ]\d{2}:\d{2}(:\d{2}(\.\d+)?)?(Z|[+-]\d{2}:?\d{2})?)?$/

/**
 * Exige uma string no formato ISO 8601 (`2024-01-31`, `2024-01-31T12:00:00Z`).
 *
 * Além do formato, a data precisa ser real (parseável por `Date`). Não valida
 * presença: `null`/`undefined` são aceitos. Valores que não são string são
 * considerados inválidos.
 */
export class DateStringRule implements ValidationRule {
  readonly errorCode = 'invalid.date-string'

  validate(value: unknown): string | null {
    if (isNullish(value)) {
      return null
    }

    if (typeof value !== 'string') {
      return this.errorCode
    }

    if (!ISO_8601.test(value)) {
      return this.errorCode
    }

    return Number.isNaN(Date.parse(value)) ? this.errorCode : null
  }
}
