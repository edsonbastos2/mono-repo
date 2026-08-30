import type { ValidationRule } from '../validation-rule.interface.js'

/**
 * Proíbe `undefined` explicitamente.
 *
 * `null` é aceito — use {@link NotNullRule} para bloqueá-lo.
 */
export class NotUndefinedRule implements ValidationRule {
  readonly errorCode = 'invalid.not-undefined'

  validate(value: unknown): string | null {
    return value === undefined ? this.errorCode : null
  }
}
