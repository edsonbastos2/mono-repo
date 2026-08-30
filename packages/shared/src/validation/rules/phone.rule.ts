import { isNullish } from '../rule.utils.js'
import type { ValidationRule } from '../validation-rule.interface.js'

/** Formato E.164: `+` seguido de 2 a 15 dígitos, o primeiro diferente de zero. */
const E164_PATTERN = /^\+[1-9]\d{1,14}$/

/**
 * Valida um número de telefone.
 *
 * Por padrão exige o formato E.164 (`+5511999999999`). Um `pattern` customizado
 * pode ser informado no construtor para outros formatos. Não valida presença:
 * `null`/`undefined` são aceitos. Valores que não são string são considerados
 * inválidos.
 */
export class PhoneRule implements ValidationRule {
  readonly errorCode = 'invalid.phone'

  constructor(readonly pattern: RegExp = E164_PATTERN) {}

  validate(value: unknown): string | null {
    if (isNullish(value)) {
      return null
    }

    if (typeof value !== 'string') {
      return this.errorCode
    }

    return this.pattern.test(value) ? null : this.errorCode
  }
}
