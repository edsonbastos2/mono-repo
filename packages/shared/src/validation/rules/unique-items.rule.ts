import { deepEquals, isNullish } from '../rule.utils.js'
import type { ValidationRule } from '../validation-rule.interface.js'

/**
 * Exige um array sem itens duplicados.
 *
 * A comparação é estrutural ({@link deepEquals}), então objetos e arrays com o
 * mesmo conteúdo contam como duplicados. Não valida presença:
 * `null`/`undefined` são aceitos. Valores que não são array são considerados
 * inválidos.
 */
export class UniqueItemsRule implements ValidationRule {
  readonly errorCode = 'invalid.unique-items'

  validate(value: unknown): string | null {
    if (isNullish(value)) {
      return null
    }

    if (!Array.isArray(value)) {
      return this.errorCode
    }

    for (let i = 0; i < value.length; i += 1) {
      for (let j = i + 1; j < value.length; j += 1) {
        if (deepEquals(value[i], value[j])) {
          return this.errorCode
        }
      }
    }

    return null
  }
}
