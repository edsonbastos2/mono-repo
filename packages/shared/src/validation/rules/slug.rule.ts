import { isNullish } from '../rule.utils.js'
import type { ValidationRule } from '../validation-rule.interface.js'

/** Palavras `[a-z0-9]` separadas por hífen simples, sem hífen nas pontas. */
const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

/**
 * Valida o formato slug (`meu-texto-aqui`): minúsculas, dígitos e hífens
 * simples entre palavras.
 *
 * Não valida presença: `null`/`undefined` são aceitos. Valores que não são
 * string são considerados inválidos.
 */
export class SlugRule implements ValidationRule {
  readonly errorCode = 'invalid.slug'

  validate(value: unknown): string | null {
    if (isNullish(value)) {
      return null
    }

    if (typeof value !== 'string') {
      return this.errorCode
    }

    return SLUG_PATTERN.test(value) ? null : this.errorCode
  }
}
