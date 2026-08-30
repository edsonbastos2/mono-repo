/**
 * Sistema de validação reutilizável.
 *
 * `ValidationRule` é o contrato de uma regra; `Validator` recebe vários campos
 * ({@link FieldValidation}), executa todas as regras de todos eles e agrega os
 * {@link ValidationError} resultantes; o consumidor lança uma única
 * {@link ValidationException} com a lista completa.
 */
export * from './rule.utils'
export * from './validation-error'
export * from './validation-rule.interface'
export * from './validator'
export * from './rules/index'
