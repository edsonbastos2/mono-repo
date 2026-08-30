/**
 * Pacote de infraestrutura compartilhado do monorepo.
 *
 * Consumido por todos os módulos de negócio (`modules/*`) e pelos apps
 * (`apps/backend`, `apps/frontend`). Ponto único para utilitários, tipos e
 * contratos comuns que não pertencem a nenhum domínio de negócio específico.
 */
export * from "./error";
