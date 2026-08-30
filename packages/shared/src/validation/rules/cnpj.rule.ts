import { isNullish, onlyDigits } from '../rule.utils.js'
import type { ValidationRule } from '../validation-rule.interface.js'

/** Pesos dos dígitos verificadores do CNPJ. */
const FIRST_WEIGHTS = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]
const SECOND_WEIGHTS = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]

/**
 * Valida um CNPJ pelos dois dígitos verificadores.
 *
 * Aceita a string com ou sem máscara (`00.000.000/0000-00` ou
 * `00000000000000`). Rejeita sequências de dígitos repetidos. Não valida
 * presença: `null`/`undefined` são aceitos. Valores que não são string são
 * considerados inválidos.
 */
export class CnpjRule implements ValidationRule {
  readonly errorCode = 'invalid.cnpj'

  validate(value: unknown): string | null {
    if (isNullish(value)) {
      return null
    }

    if (typeof value !== 'string') {
      return this.errorCode
    }

    const digits = onlyDigits(value)

    if (digits.length !== 14 || /^(\d)\1{13}$/.test(digits)) {
      return this.errorCode
    }

    if (
      checkDigit(digits, FIRST_WEIGHTS) !== Number(digits[12]) ||
      checkDigit(digits, SECOND_WEIGHTS) !== Number(digits[13])
    ) {
      return this.errorCode
    }

    return null
  }
}

/** Dígito verificador de CNPJ para o conjunto de pesos informado. */
function checkDigit(digits: string, weights: readonly number[]): number {
  const sum = weights.reduce(
    (acc, weight, index) => acc + Number(digits[index]) * weight,
    0,
  )

  const remainder = sum % 11

  return remainder < 2 ? 0 : 11 - remainder
}
