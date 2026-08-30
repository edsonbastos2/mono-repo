import { isNullish, toValidDate } from '../rule.utils.js'
import type { ValidationRule } from '../validation-rule.interface.js'

/**
 * Valida se o valor representa uma data válida — uma instância `Date` válida ou
 * uma string/number parseável por `new Date(...)`.
 *
 * Não valida presença: `null`/`undefined` são aceitos.
 */
export class DateRule implements ValidationRule {
  readonly errorCode = 'invalid.date'

  validate(value: unknown): string | null {
    if (isNullish(value)) {
      return null
    }

    return toValidDate(value) !== null ? null : this.errorCode
  }
}
