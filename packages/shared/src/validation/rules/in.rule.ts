import { deepEquals, isNullish } from '../rule.utils.js'
import type { ValidationRule } from '../validation-rule.interface.js'

/**
 * Exige que o valor esteja na lista de valores permitidos.
 *
 * A comparação é estrutural ({@link deepEquals}). Não valida presença:
 * `null`/`undefined` são aceitos (a menos que constem na lista, caso em que
 * passam).
 */
export class InRule implements ValidationRule {
  readonly errorCode = 'invalid.in'

  constructor(readonly allowed: readonly unknown[]) {}

  validate(value: unknown): string | null {
    if (isNullish(value)) {
      return null
    }

    return this.allowed.some((candidate) => deepEquals(candidate, value))
      ? null
      : this.errorCode
  }
}
