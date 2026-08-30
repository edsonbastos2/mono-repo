import { isNullish, toValidDate } from '../rule.utils.js'
import type { ValidationRule } from '../validation-rule.interface.js'

/**
 * Exige uma data estritamente no futuro (posterior ao instante da validação).
 *
 * Aceita `Date` ou string/number parseável. Não valida presença:
 * `null`/`undefined` são aceitos. Um valor que não parseia como data é
 * inválido.
 */
export class FutureDateRule implements ValidationRule {
  readonly errorCode = 'invalid.future-date'

  validate(value: unknown): string | null {
    if (isNullish(value)) {
      return null
    }

    const date = toValidDate(value)

    if (date === null) {
      return this.errorCode
    }

    return date.getTime() > Date.now() ? null : this.errorCode
  }
}
