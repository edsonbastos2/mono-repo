import type { ValidationRule } from '../validation-rule.interface.js'

/**
 * Valida a obrigatoriedade do campo.
 *
 * Rejeita `null`, `undefined` e strings compostas apenas por espaços. Qualquer
 * outro valor — incluindo `0`, `false` e arrays vazios — é considerado
 * presente.
 */
export class RequiredRule implements ValidationRule {
  readonly errorCode = 'required'

  validate(value: unknown): string | null {
    if (value === null || value === undefined) {
      return this.errorCode
    }

    if (typeof value === 'string' && value.trim().length === 0) {
      return this.errorCode
    }

    return null
  }
}
