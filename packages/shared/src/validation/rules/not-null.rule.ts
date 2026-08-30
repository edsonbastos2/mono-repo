import type { ValidationRule } from '../validation-rule.interface.js'

/**
 * Proíbe `null` explicitamente.
 *
 * `undefined` é aceito — use {@link NotUndefinedRule} para bloqueá-lo.
 */
export class NotNullRule implements ValidationRule {
  readonly errorCode = 'invalid.not-null'

  validate(value: unknown): string | null {
    return value === null ? this.errorCode : null
  }
}
