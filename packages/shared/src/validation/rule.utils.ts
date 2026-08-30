/**
 * Utilitários compartilhados por **múltiplas** regras de validação.
 *
 * Mantenha aqui apenas funções usadas por mais de uma regra. Lógica específica
 * de uma única regra deve ficar no próprio arquivo da regra.
 */

/** `true` se o valor é `null` ou `undefined`. */
export function isNullish(value: unknown): value is null | undefined {
  return value === null || value === undefined
}

/**
 * Comprimento de um valor que expõe `length` (string ou array). Retorna `null`
 * para qualquer outro tipo.
 */
export function lengthOf(value: unknown): number | null {
  if (typeof value === 'string' || Array.isArray(value)) {
    return value.length
  }

  return null
}

/**
 * Converte o valor em uma `Date` válida, se possível.
 *
 * Aceita instâncias `Date` e valores `string`/`number` parseáveis por
 * `new Date(...)`. Retorna `null` quando o valor não representa uma data
 * válida.
 */
export function toValidDate(value: unknown): Date | null {
  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? null : value
  }

  if (typeof value === 'string' || typeof value === 'number') {
    const parsed = new Date(value)

    return Number.isNaN(parsed.getTime()) ? null : parsed
  }

  return null
}

/** `true` se o valor é um `number` finito (exclui `NaN`, `Infinity` e não-números). */
export function isFiniteNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value)
}

/** Remove tudo que não é dígito de uma string. Retorna `''` para não-strings. */
export function onlyDigits(value: unknown): string {
  return typeof value === 'string' ? value.replace(/\D/g, '') : ''
}

/**
 * Igualdade estrutural entre dois valores.
 *
 * Compara primitivos com `Object.is` e percorre arrays e objetos planos
 * recursivamente. Suficiente para comparar valores de formulário; não trata
 * `Map`, `Set`, `Date` ou referências cíclicas.
 */
export function deepEquals(a: unknown, b: unknown): boolean {
  if (Object.is(a, b)) {
    return true
  }

  if (
    typeof a !== 'object' ||
    typeof b !== 'object' ||
    a === null ||
    b === null
  ) {
    return false
  }

  if (Array.isArray(a) || Array.isArray(b)) {
    if (!Array.isArray(a) || !Array.isArray(b) || a.length !== b.length) {
      return false
    }

    return a.every((item, index) => deepEquals(item, b[index]))
  }

  const keysA = Object.keys(a as Record<string, unknown>)
  const keysB = Object.keys(b as Record<string, unknown>)

  if (keysA.length !== keysB.length) {
    return false
  }

  return keysA.every(
    (key) =>
      Object.prototype.hasOwnProperty.call(b, key) &&
      deepEquals(
        (a as Record<string, unknown>)[key],
        (b as Record<string, unknown>)[key],
      ),
  )
}
