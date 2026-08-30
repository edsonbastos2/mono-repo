import { isNullish } from '../rule.utils.js'
import type { ValidationRule } from '../validation-rule.interface.js'

/**
 * Exige que a string termine com o sufixo informado.
 *
 * Não valida presença: `null`/`undefined` são aceitos. Valores que não são
 * string são considerados inválidos.
 */
export class EndsWithRule implements ValidationRule {
  readonly errorCode = 'invalid.ends-with'

  constructor(readonly suffix: string) {}

  validate(value: unknown): string | null {
    if (isNullish(value)) {
      return null
    }

    if (typeof value !== 'string') {
      return this.errorCode
    }

    return value.endsWith(this.suffix) ? null : this.errorCode
  }
}
