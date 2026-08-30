import { isNullish } from '../rule.utils.js'
import type { ValidationRule } from '../validation-rule.interface.js'

/**
 * Exige que a string comece com o prefixo informado.
 *
 * Não valida presença: `null`/`undefined` são aceitos. Valores que não são
 * string são considerados inválidos.
 */
export class StartsWithRule implements ValidationRule {
  readonly errorCode = 'invalid.starts-with'

  constructor(readonly prefix: string) {}

  validate(value: unknown): string | null {
    if (isNullish(value)) {
      return null
    }

    if (typeof value !== 'string') {
      return this.errorCode
    }

    return value.startsWith(this.prefix) ? null : this.errorCode
  }
}
