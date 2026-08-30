import { isNullish, onlyDigits } from '../rule.utils.js'
import type { ValidationRule } from '../validation-rule.interface.js'

/**
 * Valida um CPF pelos dois dígitos verificadores.
 *
 * Aceita a string com ou sem máscara (`000.000.000-00` ou `00000000000`).
 * Rejeita sequências de dígitos repetidos. Não valida presença:
 * `null`/`undefined` são aceitos. Valores que não são string são considerados
 * inválidos.
 */
export class CpfRule implements ValidationRule {
  readonly errorCode = 'invalid.cpf'

  validate(value: unknown): string | null {
    if (isNullish(value)) {
      return null
    }

    if (typeof value !== 'string') {
      return this.errorCode
    }

    const digits = onlyDigits(value)

    if (digits.length !== 11 || /^(\d)\1{10}$/.test(digits)) {
      return this.errorCode
    }

    if (
      checkDigit(digits, 9, 10) !== Number(digits[9]) ||
      checkDigit(digits, 10, 11) !== Number(digits[10])
    ) {
      return this.errorCode
    }

    return null
  }
}

/** Dígito verificador de CPF sobre os primeiros `length` dígitos. */
function checkDigit(digits: string, length: number, startWeight: number): number {
  let sum = 0

  for (let i = 0; i < length; i += 1) {
    sum += Number(digits[i]) * (startWeight - i)
  }

  const remainder = (sum * 10) % 11

  return remainder === 10 ? 0 : remainder
}
