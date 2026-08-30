import { isNullish } from '../rule.utils.js'
import type { ValidationRule } from '../validation-rule.interface.js'

/**
 * Proíbe o mesmo caractere repetido em sequência acima de `maxRepeat` vezes
 * (padrão `2`, ou seja, `"aa"` passa e `"aaa"` não).
 *
 * Não valida presença: `null`/`undefined` são aceitos. Valores que não são
 * string são considerados inválidos.
 */
export class NoRepeatCharsRule implements ValidationRule {
  readonly errorCode = 'invalid.repeat-chars'

  private readonly pattern: RegExp

  constructor(readonly maxRepeat: number = 2) {
    this.pattern = new RegExp(`(.)\\1{${maxRepeat},}`)
  }

  validate(value: unknown): string | null {
    if (isNullish(value)) {
      return null
    }

    if (typeof value !== 'string') {
      return this.errorCode
    }

    return this.pattern.test(value) ? this.errorCode : null
  }
}
