import { isNullish } from '../rule.utils.js'
import type { ValidationRule } from '../validation-rule.interface.js'

/**
 * Formato básico: 5 a 13 dígitos e um dígito verificador final que pode ser um
 * número ou a letra `X`.
 */
const RG_PATTERN = /^\d{5,13}[0-9Xx]$/

/**
 * Valida um RG no formato básico, com ou sem pontuação (`12.345.678-9`,
 * `123456789`, `12.345.678-X`).
 *
 * Como o formato do RG varia entre os estados, apenas a estrutura genérica é
 * verificada. Não valida presença: `null`/`undefined` são aceitos. Valores que
 * não são string são considerados inválidos.
 */
export class RgRule implements ValidationRule {
  readonly errorCode = 'invalid.rg'

  validate(value: unknown): string | null {
    if (isNullish(value)) {
      return null
    }

    if (typeof value !== 'string') {
      return this.errorCode
    }

    const cleaned = value.replace(/[.\-\s]/g, '')

    return RG_PATTERN.test(cleaned) ? null : this.errorCode
  }
}
