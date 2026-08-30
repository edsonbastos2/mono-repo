import { isNullish } from '../rule.utils.js'
import type { ValidationRule } from '../validation-rule.interface.js'

/** `#` seguido de 3 ou 6 dígitos hexadecimais. */
const HEX_COLOR = /^#(?:[0-9a-f]{3}|[0-9a-f]{6})$/i

/**
 * Valida uma cor hexadecimal (`#FFF` ou `#FFFFFF`).
 *
 * Não valida presença: `null`/`undefined` são aceitos. Valores que não são
 * string são considerados inválidos.
 */
export class HexColorRule implements ValidationRule {
  readonly errorCode = 'invalid.hex-color'

  validate(value: unknown): string | null {
    if (isNullish(value)) {
      return null
    }

    if (typeof value !== 'string') {
      return this.errorCode
    }

    return HEX_COLOR.test(value) ? null : this.errorCode
  }
}
