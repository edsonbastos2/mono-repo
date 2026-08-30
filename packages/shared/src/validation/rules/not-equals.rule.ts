import { deepEquals } from '../rule.utils.js'
import type { ValidationRule } from '../validation-rule.interface.js'

/**
 * Exige que o valor seja diferente de um valor de referência (comparação
 * estrutural).
 *
 * Dois modos:
 * - **valor fixo** — `new NotEqualsRule('admin')` rejeita o valor `'admin'`;
 * - **par** — `new NotEqualsRule()` espera um array de duas posições como valor
 *   e rejeita quando a primeira posição é igual à segunda (ex.: nova senha
 *   diferente da atual).
 */
export class NotEqualsRule implements ValidationRule {
  readonly errorCode = 'invalid.not-equals'

  private readonly comparePair: boolean

  constructor(readonly forbidden?: unknown) {
    this.comparePair = forbidden === undefined
  }

  validate(value: unknown): string | null {
    if (this.comparePair) {
      if (!Array.isArray(value) || value.length !== 2) {
        return this.errorCode
      }

      return deepEquals(value[0], value[1]) ? this.errorCode : null
    }

    return deepEquals(value, this.forbidden) ? this.errorCode : null
  }
}
