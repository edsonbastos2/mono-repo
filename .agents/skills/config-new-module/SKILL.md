---
name: config-new-module
description: >-
  Cria (scaffold) um novo módulo de negócio em modules/<nome> no monorepo
  projeto-reforma-trib: gera package.json/tsconfig/jest.config/src/test a partir
  de templates, registra o workspace modules/*, garante ts-node na raiz, injeta a
  dependência @<escopo>/<nome> em apps/backend e apps/frontend e roda
  install + build + testes. Use quando pedirem "criar módulo", "novo módulo",
  "scaffold de módulo", "adicionar módulo em modules/".
---

# config-new-module

Gera um módulo de negócio novo dentro de `modules/<nome>` de forma
**determinística** e integra-o ao monorepo (npm workspaces + Turborepo).

Tudo é feito por um driver: [.agents/skills/config-new-module/driver.mjs](driver.mjs).
Os arquivos gerados saem dos templates em
[.agents/skills/config-new-module/assets/](assets/). Cada template é gravado
como `*.tmpl` (o driver remove o sufixo ao gerar o módulo) para o editor não
type-checá-los como código-fonte fora de um workspace. Os placeholders
`__PACKAGE_NAME__` e `__MODULE_NAME__` são substituídos na cópia.

> Caminhos neste documento são relativos à **raiz do repositório**
> (`c:\Users\edson\projetos-pessoal\projeto-reforma-trib`).

## Pré-requisitos

- Node + npm já usados pelo repo (testado com Node 22.18 / npm 11.16 — o
  `engines` pede `>=24`, mas o `npm install` roda só com avisos `EBADENGINE`).
- Nenhum pacote de SO adicional. Rodar a partir da raiz do repo.

## Regras (impostas pelo driver)

- **Sem `--name` o driver aborta e não escreve nada** (esse é "o namespace"
  obrigatório). Nome deve ser kebab-case: `^[a-z0-9]+(-[a-z0-9]+)*$`.
- Escopo do pacote: `--scope`, padrão `@meu-projeto` → pacote
  `@meu-projeto/<nome>`.
- `modules/<nome>` já existente ⇒ erro, a menos que `--force`.
- Edições em `package.json` (raiz, backend, frontend) são idempotentes:
  reexecutar não duplica entradas.

## Rodar (caminho do agente)

Scaffold completo — cria o módulo, `npm install`, `npm run build` (turbo) e os
testes do módulo:

```bash
node .agents/skills/config-new-module/driver.mjs --name auth
```

Só gerar os arquivos e as edições de `package.json`, sem rodar nada:

```bash
node .agents/skills/config-new-module/driver.mjs --name auth --skip-install --skip-build --skip-test
```

Prévia sem escrever (mostra arquivos e edições que faria):

```bash
node .agents/skills/config-new-module/driver.mjs --dry-run --name auth
```

Flags: `--name <slug>` (obrigatório) · `--scope <@escopo>` (padrão
`@meu-projeto`) · `--force` · `--skip-install` · `--skip-build` ·
`--skip-test` · `--dry-run`.

### O que o driver faz, em ordem

1. Cria `modules/` se não existir e `modules/<nome>/`.
2. Copia os templates de `assets/` (removendo o sufixo `.tmpl` e resolvendo
   os placeholders): `jest.config.ts`, `tsconfig.json`, `tsconfig.build.json`,
   `package.json`, `src/index.ts`, `test/index.test.ts`.
3. Raiz `package.json`: insere `"modules/*"` em `workspaces` (logo após
   `"apps/*"`) e `"ts-node": "^10.9.2"` em `devDependencies`, se faltarem.
4. `apps/backend/package.json` e `apps/frontend/package.json`: adiciona
   `"@<escopo>/<nome>": "*"` em `dependencies`.
5. `npm install` na raiz (pule com `--skip-install`).
6. `npm run build` na raiz — Turborepo compila `@<escopo>/<nome>` (via `tsc`),
   `backend` e `frontend` (pule com `--skip-build`).
7. `npm test --workspace @<escopo>/<nome>` — roda o Jest do módulo
   (pule com `--skip-test`).

## Verificar

Depois de `node .agents/skills/config-new-module/driver.mjs --name auth`:

```bash
find modules/auth -type f -not -path '*/node_modules/*'
npm run build --workspace @meu-projeto/auth
npm test --workspace @meu-projeto/auth
```

Saída esperada dos testes:

```
PASS test/index.test.ts
  √ Deve retornar o nome do modulo configurado
Tests:       1 passed, 1 total
```

E `modules/auth/dist/` contém `index.js`, `index.d.ts`, `index.d.ts.map`.

## Gotchas

- **`spawnSync npm.cmd EINVAL` no Windows.** Node ≥ 20 recusa spawnar `.cmd`
  sem `shell: true`. O driver já usa `shell: IS_WIN` em `run()`. Se copiar
  esse padrão para outro script, lembre-se disso.
- **`jest.config.ts` exige `ts-node` na raiz.** O Jest carrega o config TS
  via `ts-node`; por isso o passo 3 o adiciona em `devDependencies` da raiz.
  Sem ele: `Jest: Failed to parse the TypeScript config file`.
- **tsconfig base é NodeNext (ESM), Jest é CJS.** O `jest.config.ts` gerado
  passa um override `module: CommonJS` / `moduleResolution: Node` só para o
  ts-jest — o `tsconfig.build.json` do módulo (usado pelo `tsc` do build) fica
  intacto, como no template.
- **Dois tsconfig por módulo.** `tsconfig.json` é o config que o editor/IDE
  enxerga: inclui `src` **e** `test`, com `types: ["jest", "node"]` e
  `noEmit`, para o TS server achar os globais do Jest (`test`, `expect`) no
  arquivo de teste. `tsconfig.build.json` (`extends ./tsconfig.json`) é o que
  o `npm run build` usa: só `src`, `rootDir`/`outDir`/`declaration`, emite pra
  `dist/`. Se um módulo antigo só tem `tsconfig.json` com `include: ["src"]`,
  o editor acusa `Cannot find name 'test'` em `test/*.test.ts` — aplique esse
  mesmo split.
- **`WARNING no output files found for task @meu-projeto/auth#build`** e o
  mesmo para `backend#build`. É só o Turborepo avisando que o `outputs` em
  `turbo.json` só cobre `.next/**`; o build funciona. Não é erro.
- **`npm warn EBADENGINE ... current: node v22`.** O repo pede Node ≥ 24; o
  `npm install` conclui mesmo assim. Ignorar.
- **Escopo do pacote vs. dependência nos apps.** O enunciado original fala em
  `@meu-projeto/<nome>`. Se passar `--scope`, o nome do pacote **e** a
  dependência injetada nos apps mudam juntos.

## Troubleshooting

| Sintoma | Causa / correção |
|---|---|
| `ERRO: nome do módulo (namespace) não informado` | Faltou `--name`. Passe `--name <slug>`. |
| `ERRO: nome inválido: "..."` | Nome não é kebab-case. Use `a-z0-9` e `-`. |
| `ERRO: modules/<nome> já existe` | Rode com `--force` para sobrescrever os arquivos do módulo. |
| `spawnSync npm.cmd EINVAL` | Está usando uma cópia antiga do driver sem `shell: IS_WIN`. Atualize. |
| Build do `frontend`/`backend` falha por motivo não relacionado | Rode `--skip-build` e depois investigue o app isolado; o módulo em si compila com `npm run build --workspace @<escopo>/<nome>`. |
