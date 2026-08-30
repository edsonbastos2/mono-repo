import { isNullish, toValidDate } from '../rule.utils.js'
import type { ValidationRule } from '../validation-rule.interface.js'

/**
 * Valida se a data de nascimento informada corresponde a uma idade, em anos
 * completos, entre `min` e `max` — inclusive.
 *
 * Aceita `Date` ou string/number parseável. Não valida presença:
 * `null`/`undefined` são aceitos; um valor que não parseia como data é
 * inválido.
 */
export class AgeRule implements ValidationRule {
  readonly errorCode = 'invalid.age'

  constructor(
    readonly min: number,
    readonly max: number,
  ) {}

  validate(value: unknown): string | null {
    if (isNullish(value)) {
      return null
    }

    const birthDate = toValidDate(value)

    if (birthDate === null) {
      return this.errorCode
    }

    const age = yearsBetween(birthDate, new Date())

    return age >= this.min && age <= this.max ? null : this.errorCode
  }
}

/**
 * Anos completos entre `from` e `to` (idade), descontando o ano corrente quando
 * o aniversário ainda não ocorreu.
 */
function yearsBetween(from: Date, to: Date): number {
  let years = to.getFullYear() - from.getFullYear()

  const monthDelta = to.getMonth() - from.getMonth()
  const dayDelta = to.getDate() - from.getDate()

  if (monthDelta < 0 || (monthDelta === 0 && dayDelta < 0)) {
    years -= 1
  }

  return years
}
