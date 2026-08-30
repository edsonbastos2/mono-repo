import { isNullish, onlyDigits } from '../rule.utils.js'
import type { ValidationRule } from '../validation-rule.interface.js'

/**
 * Dígitos aceitos: DDI `55` opcional, DDD de 2 dígitos (primeiro de 1 a 9) e
 * assinante fixo (8 dígitos) ou móvel (`9` + 8 dígitos).
 */
const PHONE_BR_DIGITS = /^(?:55)?[1-9][0-9](?:9\d{8}|\d{8})$/

/**
 * Valida um telefone no padrão brasileiro, com ou sem máscara
 * (`(11) 91234-5678`, `+55 11 1234-5678`, `1112345678`).
 *
 * Não valida presença: `null`/`undefined` são aceitos. Valores que não são
 * string são considerados inválidos.
 */
export class PhoneBrRule implements ValidationRule {
  readonly errorCode = 'invalid.phone-br'

  validate(value: unknown): string | null {
    if (isNullish(value)) {
      return null
    }

    if (typeof value !== 'string') {
      return this.errorCode
    }

    return PHONE_BR_DIGITS.test(onlyDigits(value)) ? null : this.errorCode
  }
}
