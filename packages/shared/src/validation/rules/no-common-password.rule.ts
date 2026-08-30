import { isNullish } from '../rule.utils.js'
import type { ValidationRule } from '../validation-rule.interface.js'

/** Lista negra padrão com as senhas mais recorrentes em vazamentos. */
const DEFAULT_BLACKLIST = [
  '123456',
  '123456789',
  '12345678',
  '12345',
  '1234567',
  'password',
  'qwerty',
  'abc123',
  '111111',
  '123123',
  'senha',
]

/**
 * Bloqueia senhas presentes numa lista negra (comparação sem diferenciar
 * maiúsculas/minúsculas).
 *
 * Sem argumentos usa uma lista padrão de senhas comuns; uma lista customizada
 * pode ser informada no construtor. Não valida presença: `null`/`undefined` são
 * aceitos. Valores que não são string são considerados inválidos.
 */
export class NoCommonPasswordRule implements ValidationRule {
  readonly errorCode = 'invalid.common-password'

  private readonly blacklist: Set<string>

  constructor(blacklist: readonly string[] = DEFAULT_BLACKLIST) {
    this.blacklist = new Set(blacklist.map((entry) => entry.toLowerCase()))
  }

  validate(value: unknown): string | null {
    if (isNullish(value)) {
      return null
    }

    if (typeof value !== 'string') {
      return this.errorCode
    }

    return this.blacklist.has(value.toLowerCase()) ? this.errorCode : null
  }
}
