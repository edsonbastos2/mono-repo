import { isNullish } from '../rule.utils.js'
import type { ValidationRule } from '../validation-rule.interface.js'

/** Qualquer caractere que não seja letra `a-z`/`A-Z`, dígito ou espaço em branco. */
const SPECIAL_CHAR = /[^a-zA-Z0-9\s]/

/**
 * Exige ao menos um caractere especial (não letra, não dígito, não espaço).
 *
 * Não valida presença: `null`/`undefined` são aceitos. Valores que não são
 * string são considerados inválidos.
 */
export class HasSpecialCharRule implements ValidationRule {
  readonly errorCode = 'invalid.has-special-char'

  validate(value: unknown): string | null {
    if (isNullish(value)) {
      return null
    }

    if (typeof value !== 'string') {
      return this.errorCode
    }

    return SPECIAL_CHAR.test(value) ? null : this.errorCode
  }
}
