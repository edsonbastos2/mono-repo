import { deepEquals } from '../rule.utils.js'
import type { ValidationRule } from '../validation-rule.interface.js'

/**
 * Exige que o valor seja igual a um valor de referência (comparação estrutural).
 *
 * Dois modos:
 * - **valor fixo** — `new EqualsRule('BR')` compara o valor validado com `'BR'`;
 * - **par** — `new EqualsRule()` espera um array de duas posições como valor e
 *   compara a primeira com a segunda (ex.: senha e confirmação de senha).
 */
export class EqualsRule implements ValidationRule {
  readonly errorCode = 'invalid.equals'

  private readonly comparePair: boolean

  constructor(readonly expected?: unknown) {
    this.comparePair = expected === undefined
  }

  validate(value: unknown): string | null {
    if (this.comparePair) {
      if (!Array.isArray(value) || value.length !== 2) {
        return this.errorCode
      }

      return deepEquals(value[0], value[1]) ? null : this.errorCode
    }

    return deepEquals(value, this.expected) ? null : this.errorCode
  }
}
