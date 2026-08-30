import { isNullish } from '../rule.utils.js'
import type { ValidationRule } from '../validation-rule.interface.js'

/**
 * Exige que a string contenha a substring informada.
 *
 * Não valida presença: `null`/`undefined` são aceitos. Valores que não são
 * string são considerados inválidos.
 */
export class ContainsRule implements ValidationRule {
  readonly errorCode = 'invalid.contains'

  constructor(readonly substring: string) {}

  validate(value: unknown): string | null {
    if (isNullish(value)) {
      return null
    }

    if (typeof value !== 'string') {
      return this.errorCode
    }

    return value.includes(this.substring) ? null : this.errorCode
  }
}
