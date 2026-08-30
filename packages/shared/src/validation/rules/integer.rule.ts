import { isNullish } from '../rule.utils.js'
import type { ValidationRule } from '../validation-rule.interface.js'

/**
 * Aceita apenas números inteiros (sem parte decimal).
 *
 * Não valida presença: `null`/`undefined` são aceitos. Qualquer outro valor —
 * inclusive strings numéricas e números com decimais — é inválido.
 */
export class IntegerRule implements ValidationRule {
  readonly errorCode = 'invalid.integer'

  validate(value: unknown): string | null {
    if (isNullish(value)) {
      return null
    }

    return Number.isInteger(value) ? null : this.errorCode
  }
}
