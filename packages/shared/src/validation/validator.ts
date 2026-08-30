import { ValidationError } from './validation-error.js'
import type { ValidationRule } from './validation-rule.interface.js'

/**
 * Especificação de validação de **um** campo: o código do campo, o valor a
 * validar e todas as regras que se aplicam a ele.
 *
 * @typeParam T - tipo do valor do campo.
 */
export interface FieldValidation<T = unknown> {
  /** Código/caminho do campo. Ex.: `"user.email"`, `"product.name"`. */
  readonly fieldCode: string
  /** Valor a ser validado contra {@link FieldValidation.rules}. */
  readonly value: T
  /** Regras aplicadas ao valor, na ordem informada. */
  readonly rules: readonly ValidationRule<T>[]
}

/**
 * Valida **vários campos** de uma vez contra suas respectivas regras.
 *
 * Recebe uma lista de {@link FieldValidation} — um objeto por campo, com
 * `fieldCode`, `value` e `rules`. Executa **todas** as regras de **todos** os
 * campos e agrega os erros num único array — nunca para na primeira falha. Cada
 * regra violada vira um {@link ValidationError} cujo `fieldCode` é o do campo e
 * cujo `errorCode` é o código retornado por {@link ValidationRule.validate}.
 *
 * @example
 * ```ts
 * const validador = new Validator([
 *   { fieldCode: 'user.name', value: '', rules: [new RequiredRule()] },
 *   {
 *     fieldCode: 'user.email',
 *     value: 'nao-e-email',
 *     rules: [new RequiredRule(), new EmailRule()],
 *   },
 * ])
 *
 * validador.validate()
 * // -> [user.name.required, user.email.invalid.email]
 * ```
 */
export class Validator {
  constructor(
    /** Campos a validar, cada um com suas regras. */
    readonly fields: readonly FieldValidation[],
  ) {}

  /**
   * Aplica as regras de cada campo ao seu valor.
   *
   * @returns lista de {@link ValidationError} — uma por regra violada, na ordem
   * dos campos e, dentro de cada campo, na ordem das regras. Vazia se tudo é
   * válido.
   */
  validate(): ValidationError[] {
    const errors: ValidationError[] = []

    for (const field of this.fields) {
      for (const rule of field.rules) {
        const errorCode = rule.validate(field.value)

        if (errorCode !== null) {
          errors.push(new ValidationError(field.fieldCode, errorCode))
        }
      }
    }

    return errors
  }
}
