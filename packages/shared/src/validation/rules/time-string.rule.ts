import { isNullish } from '../rule.utils.js'
import type { ValidationRule } from '../validation-rule.interface.js'

/** `HH:mm` ou `HH:mm:ss` em relógio de 24 horas. */
const TIME_PATTERN = /^([01]\d|2[0-3]):[0-5]\d(:[0-5]\d)?$/

/**
 * Valida o formato de hora `HH:mm` ou `HH:mm:ss` (24 horas).
 *
 * Não valida presença: `null`/`undefined` são aceitos. Valores que não são
 * string são considerados inválidos.
 */
export class TimeStringRule implements ValidationRule {
  readonly errorCode = 'invalid.time-string'

  validate(value: unknown): string | null {
    if (isNullish(value)) {
      return null
    }

    if (typeof value !== 'string') {
      return this.errorCode
    }

    return TIME_PATTERN.test(value) ? null : this.errorCode
  }
}
