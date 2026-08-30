import { isNullish } from '../rule.utils.js'
import type { ValidationRule } from '../validation-rule.interface.js'

/**
 * Valida a string contra uma expressão regular customizada.
 *
 * A flag `g` do padrão é ignorada para evitar dependência de `lastIndex` entre
 * chamadas. Não valida presença: `null`/`undefined` são aceitos. Valores que
 * não são string são considerados inválidos.
 */
export class RegexRule implements ValidationRule {
  readonly errorCode = 'invalid.regex'

  private readonly pattern: RegExp

  constructor(pattern: RegExp) {
    this.pattern = new RegExp(
      pattern.source,
      pattern.flags.replace(/g/g, ''),
    )
  }

  validate(value: unknown): string | null {
    if (isNullish(value)) {
      return null
    }

    if (typeof value !== 'string') {
      return this.errorCode
    }

    return this.pattern.test(value) ? null : this.errorCode
  }
}
