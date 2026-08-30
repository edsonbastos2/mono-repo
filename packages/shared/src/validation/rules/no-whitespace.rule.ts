import { isNullish } from '../rule.utils.js'
import type { ValidationRule } from '../validation-rule.interface.js'

/**
 * Proíbe qualquer caractere de espaço em branco (espaço, tab, quebra de linha).
 *
 * Não valida presença: `null`/`undefined` são aceitos. Valores que não são
 * string são considerados inválidos.
 */
export class NoWhitespaceRule implements ValidationRule {
  readonly errorCode = 'invalid.no-whitespace'

  validate(value: unknown): string | null {
    if (isNullish(value)) {
      return null
    }

    if (typeof value !== 'string') {
      return this.errorCode
    }

    return /\s/.test(value) ? this.errorCode : null
  }
}
