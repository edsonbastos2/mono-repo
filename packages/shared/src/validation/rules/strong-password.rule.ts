import { isNullish } from '../rule.utils.js'
import type { ValidationRule } from '../validation-rule.interface.js'

/**
 * Exige uma senha forte: ao menos uma maiúscula, uma minúscula, um dígito, um
 * caractere especial e o comprimento mínimo (`minLength`, padrão `8`).
 *
 * Não valida presença: `null`/`undefined` são aceitos. Valores que não são
 * string são considerados inválidos.
 */
export class StrongPasswordRule implements ValidationRule {
  readonly errorCode = 'invalid.strong-password'

  constructor(readonly minLength: number = 8) {}

  validate(value: unknown): string | null {
    if (isNullish(value)) {
      return null
    }

    if (typeof value !== 'string') {
      return this.errorCode
    }

    const strong =
      value.length >= this.minLength &&
      /[a-z]/.test(value) &&
      /[A-Z]/.test(value) &&
      /\d/.test(value) &&
      /[^a-zA-Z0-9]/.test(value)

    return strong ? null : this.errorCode
  }
}
