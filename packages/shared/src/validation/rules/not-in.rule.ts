import { deepEquals, isNullish } from '../rule.utils.js'
import type { ValidationRule } from '../validation-rule.interface.js'

/**
 * Exige que o valor **não** esteja na lista negra.
 *
 * A comparação é estrutural ({@link deepEquals}). Não valida presença:
 * `null`/`undefined` são aceitos (a menos que constem na lista, caso em que são
 * rejeitados).
 */
export class NotInRule implements ValidationRule {
  readonly errorCode = 'invalid.not-in'

  constructor(readonly blacklist: readonly unknown[]) {}

  validate(value: unknown): string | null {
    if (isNullish(value)) {
      return null
    }

    return this.blacklist.some((candidate) => deepEquals(candidate, value))
      ? this.errorCode
      : null
  }
}
