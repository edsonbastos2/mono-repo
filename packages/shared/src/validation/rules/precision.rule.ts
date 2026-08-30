import { isFiniteNumber, isNullish } from '../rule.utils.js'
import type { ValidationRule } from '../validation-rule.interface.js'

/**
 * Limita a quantidade de casas decimais de um número.
 *
 * Não valida presença: `null`/`undefined` são aceitos. Valores que não são
 * `number` finito, ou expressos em notação científica, são considerados
 * inválidos.
 */
export class PrecisionRule implements ValidationRule {
  readonly errorCode = 'invalid.precision'

  constructor(readonly maxDecimals: number) {}

  validate(value: unknown): string | null {
    if (isNullish(value)) {
      return null
    }

    if (!isFiniteNumber(value)) {
      return this.errorCode
    }

    const text = value.toString()

    if (text.includes('e')) {
      return this.errorCode
    }

    const dot = text.indexOf('.')
    const decimals = dot === -1 ? 0 : text.length - dot - 1

    return decimals <= this.maxDecimals ? null : this.errorCode
  }
}
