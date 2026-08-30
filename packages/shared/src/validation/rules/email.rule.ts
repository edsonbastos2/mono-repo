import { isNullish } from '../rule.utils.js'
import type { ValidationRule } from '../validation-rule.interface'

/** Padrão pragmático de e-mail (não cobre toda a RFC 5322). */
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/**
 * Valida o formato de e-mail.
 *
 * Não valida presença: `null`/`undefined` são aceitos — combine com
 * {@link RequiredRule} quando o campo for obrigatório.
 */
export class EmailRule implements ValidationRule {
  readonly errorCode = 'invalid.email'

  validate(value: unknown): string | null {
    if (isNullish(value)) {
      return null
    }

    if (typeof value !== 'string') {
      return this.errorCode
    }

    return EMAIL_PATTERN.test(value.trim()) ? null : this.errorCode
  }
}
