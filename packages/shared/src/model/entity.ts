import { v4 as uuidv4 } from 'uuid'

import type { ValidationError } from '../validation/validation-error.js'

/**
 * Dados básicos comuns a **toda** entidade da aplicação.
 *
 * Cada entidade concreta estende esta interface para descrever suas próprias
 * propriedades (ex.: `interface UserProps extends EntityProps { name: string }`).
 *
 * O `id` é **opcional na entrada**: quando omitido, a entidade gera um UUID v4
 * no momento da construção.
 */
export interface EntityProps {
  /** Identificador único. Gerado automaticamente (UUID v4) se não informado. */
  readonly id?: string
}

/**
 * Entidade base da aplicação.
 *
 * Concentra o que toda entidade compartilha:
 *
 * - um `id` `string` estável e imutável — recebido pelas props ou, na sua
 *   ausência, gerado como UUID v4;
 * - **identidade por `id`**: duas entidades são iguais quando têm o mesmo
 *   `id`, independentemente dos demais atributos ({@link Entity.equals});
 * - um contrato de validação interna ({@link Entity.validate}) que cada
 *   entidade concreta implementa montando um `Validator` com as regras do
 *   módulo de validação.
 *
 * @typeParam TProps - forma das propriedades da entidade concreta.
 */
export abstract class Entity<TProps extends EntityProps = EntityProps> {
  /** Identificador único e imutável da entidade. */
  readonly id: string

  /** Propriedades da entidade, com o `id` já resolvido. */
  protected readonly props: TProps

  protected constructor(props: TProps) {
    this.id = props.id ?? uuidv4()
    this.props = { ...props, id: this.id }
  }

  /**
   * Valida o estado interno da entidade.
   *
   * A implementação concreta monta um `Validator` com os campos e regras da
   * entidade e retorna os {@link ValidationError} encontrados — lista **vazia**
   * quando o estado é válido. Não lança: cabe ao consumidor decidir o que fazer
   * com os erros (ex.: `ValidationException.throwIfAny(entity.validate())`).
   */
  abstract validate(): ValidationError[]

  /**
   * Igualdade por identidade.
   *
   * @returns `true` quando `other` é uma {@link Entity} e possui o mesmo `id`
   * desta instância; `false` para `null`/`undefined` ou valores que não são
   * entidades.
   */
  equals(other?: Entity<EntityProps> | null): boolean {
    if (other === null || other === undefined) {
      return false
    }

    if (other === this) {
      return true
    }

    if (!(other instanceof Entity)) {
      return false
    }

    return this.id === other.id
  }
}
