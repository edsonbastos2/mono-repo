import { isNullish } from '../rule.utils.js'
import type { ValidationRule } from '../validation-rule.interface.js'

/**
 * Exige uma string que seja um JSON parseável por `JSON.parse`.
 *
 * Não valida presença: `null`/`undefined` são aceitos. Valores que não são
 * string são considerados inválidos.
 */
export class JsonStringRule implements ValidationRule {
  readonly errorCode = 'invalid.json-string'

  validate(value: unknown): string | null {
    if (isNullish(value)) {
      return null
    }

    if (typeof value !== 'string') {
      return this.errorCode
    }

    try {
      JSON.parse(value)

      return null
    } catch {
      return this.errorCode
    }
  }
}
