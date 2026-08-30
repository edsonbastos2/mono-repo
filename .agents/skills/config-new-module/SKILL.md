---
name: config-new-module
description: >-
  Cria (scaffold) um novo módulo de negócio em modules/<nome> no monorepo
  projeto-reforma-trib: gera package.json/tsconfig/jest.config/src/test a partir
  de templates, registra o workspace modules/*, garante ts-node na raiz, injeta a
  dependência @<escopo>/<nome> em apps/backend e apps/frontend e roda
  install + build + testes. Também gera um módulo + controller NestJS em
  apps/backend/src/modules/<nome> (endpoint GET padrão) e o registra no AppModule,
  e ainda cria no apps/frontend a rota privada
  app/(private)/<nome>/page.tsx + a página modules/<nome>/pages/<nome>.page.tsx +
  o componente modules/<nome>/components/<nome>.component.tsx.
  Use quando pedirem "criar módulo", "novo módulo", "scaffold de módulo",
  "adicionar módulo em modules/", "criar módulo no backend/Nest",
  "criar módulo no frontend".
---

# config-new-module

Faz três coisas, de forma **determinística** e idempotente, na mesma execução:

1. Gera um **módulo de negócio** novo dentro de `modules/<nome>` e integra-o ao
   monorepo (npm workspaces + Turborepo).
2. Gera um **módulo + controller NestJS** em
   `apps/backend/src/modules/<nome>` com um endpoint `GET /<nome>` que devolve
   uma mensagem padrão, e registra esse módulo no `AppModule`
   (`apps/backend/src/app.module.ts`). Sem testes/spec — só a definição do
   módulo e o controller. Desligue com `--skip-backend-module`.
3. Gera um **módulo no frontend** (Next.js App Router) em `apps/frontend/src`:
   - Rota privada: `app/(private)/<nome>/page.tsx` (só reexporta a página do
     módulo). O route group é configurável com `--route-group`.
   - Página principal: `modules/<nome>/pages/<nome>.page.tsx`.
   - Componente principal: `modules/<nome>/components/<nome>.component.tsx`.
   Nomes de arquivo e símbolos seguem o nome do módulo (`<nome>.component.tsx`,
   `<Pascal>Component`). Desligue com `--skip-frontend-module`.

Tudo é feito por um driver: [.agents/skills/config-new-module/driver.mjs](driver.mjs).
Os arquivos do módulo de negócio saem dos templates em
[.agents/skills/config-new-module/assets/](assets/); os do módulo NestJS saem de
[.agents/skills/config-new-module/nest-assets/](nest-assets/) e os do módulo
frontend de [.agents/skills/config-new-module/front-assets/](front-assets/)
(ambos ficam **fora** de `assets/` para não entrar no `copyTemplateTree` do
módulo de negócio). Cada template é gravado como `*.tmpl` (o driver remove o
sufixo ao gerar) para o editor não type-checá-los como código-fonte fora de um
workspace. Os placeholders `__PACKAGE_NAME__`, `__MODULE_NAME__`,
`__MODULE_CLASS__` (PascalCase de `<nome>`) e `__MODULE_TITLE__` (Title Case de
`<nome>`, usado só no `<h1>` do componente frontend) são substituídos na cópia.

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
- `apps/backend/src/modules/<nome>` já existente ⇒ erro, a menos que `--force`.
- `apps/frontend/src/app/<routeGroup>/<nome>` ou
  `apps/frontend/src/modules/<nome>` já existentes ⇒ erro, a menos que `--force`.
- Edições em `package.json` (raiz, backend, frontend) e o registro no
  `AppModule` são idempotentes: reexecutar não duplica entradas.

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
`@meu-projeto`) · `--route-group <g>` (route group da rota privada no frontend,
padrão `(private)`; aceita `private` ou `(private)`) · `--force` ·
`--skip-install` · `--skip-build` · `--skip-test` · `--skip-backend-module`
(não gera o módulo/controller NestJS) · `--skip-frontend-module` (não gera a
rota + página + componente no frontend) · `--dry-run`.

### O que o driver faz, em ordem

1. Cria `modules/` se não existir e `modules/<nome>/`.
2. Copia os templates de `assets/` (removendo o sufixo `.tmpl` e resolvendo
   os placeholders): `jest.config.ts`, `tsconfig.json`, `tsconfig.build.json`,
   `package.json`, `src/index.ts`, `test/index.test.ts`.
3. Raiz `package.json`: insere `"modules/*"` em `workspaces` (logo após
   `"apps/*"`) e `"ts-node": "^10.9.2"` em `devDependencies`, se faltarem.
4. `apps/backend/package.json` e `apps/frontend/package.json`: adiciona
   `"@<escopo>/<nome>": "*"` em `dependencies`.
4b. **NestJS** (pule com `--skip-backend-module`): cria
   `apps/backend/src/modules/<nome>/` com `<nome>.module.ts` e
   `<nome>.controller.ts` (a partir de `nest-assets/`); o controller tem
   `@Controller('<nome>')` + um `@Get()` que retorna
   `{ message: 'Módulo <nome> disponível.' }`. Depois insere o `import`
   (com extensão `.js`, o backend é ESM `nodenext`) e adiciona
   `<Class>Module` ao array `imports` do `@Module` em
   `apps/backend/src/app.module.ts`. Não toca em nada do módulo de negócio.
4c. **Frontend** (pule com `--skip-frontend-module`): a partir de
   `front-assets/`, cria
   `apps/frontend/src/app/<routeGroup>/<nome>/page.tsx` (rota que só reexporta
   `<Class>Page`), `apps/frontend/src/modules/<nome>/pages/<nome>.page.tsx`
   (renderiza `<Class>Component`) e
   `apps/frontend/src/modules/<nome>/components/<nome>.component.tsx`
   (`<h1>` com o Title Case do nome). Usa o alias `@/*` → `src/*`. Não roda
   nada e não mexe em `package.json` além do passo 4. Independente do módulo
   de negócio e do módulo NestJS.
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

Para o módulo NestJS:

```bash
find apps/backend/src/modules/auth -type f
grep AuthModule apps/backend/src/app.module.ts
npm run build --workspace backend
```

Esperado: `apps/backend/src/modules/auth/{auth.module.ts,auth.controller.ts}`,
`AuthModule` importado e listado em `imports` no `app.module.ts`, e o build do
`backend` gera `apps/backend/dist/modules/auth/`. Subindo a API
(`npm run dev --workspace backend`), `GET http://localhost:4000/auth` responde
`{"message":"Módulo auth disponível."}`.

Para o módulo frontend:

```bash
find "apps/frontend/src/app/(private)/auth" apps/frontend/src/modules/auth -type f
npm run build --workspace frontend
```

Esperado: `apps/frontend/src/app/(private)/auth/page.tsx`,
`apps/frontend/src/modules/auth/pages/auth.page.tsx` e
`apps/frontend/src/modules/auth/components/auth.component.tsx`. Subindo o app
(`npm run dev --workspace frontend`), `http://localhost:3000/auth` renderiza o
`<h1>Auth</h1>` do componente.

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
- **Módulo NestJS ≠ módulo de negócio.** São duas coisas independentes geradas
  na mesma execução: `modules/<nome>` (pacote `@<escopo>/<nome>`) e
  `apps/backend/src/modules/<nome>` (feature Nest). O módulo Nest **não**
  importa nem depende do pacote de negócio — se quiser ligá-los, faça na mão.
- **Import com `.js` no `app.module.ts`.** O backend é ESM `nodenext`, então o
  registro usa `./modules/<nome>/<nome>.module.js` (extensão `.js` em fonte
  `.ts`). É de propósito; não "corrija" para sem extensão.
- **Registro no `AppModule` por manipulação de string.** O driver acha a última
  linha `import ...` e o primeiro `imports: [` do arquivo. Se o
  `app.module.ts` for reescrito num formato muito diferente (sem array
  `imports`), ele cai no fallback de criar `imports: [<Class>Module]`. Confira
  o diff depois de rodar.
- **Sem spec/teste no módulo Nest.** Por decisão de escopo: a skill gera só
  `*.module.ts` e `*.controller.ts`. O `--skip-test` continua valendo só para
  o Jest do módulo de negócio.
- **Módulo frontend é 100% arquivos.** Não edita `package.json` (além do passo
  4), não registra nada em lugar nenhum e não roda comando. Se o Next não
  "enxergar" a rota, confira que o dev server foi reiniciado.
- **Nome do arquivo do componente segue o nome do módulo.** É
  `<nome>.component.tsx` / `<Pascal>Component` — mesmo que o `<nome>` esteja no
  plural (`cadastro-empresas` → `cadastro-empresas.component.tsx`,
  `CadastroEmpresasComponent`). Não há singularização.
- **`(private)` é um route group.** Os parênteses fazem o Next **não** incluir
  `private` na URL: `app/(private)/<nome>/page.tsx` responde em `/<nome>`. Para
  outro grupo (ou nenhum), use `--route-group`.

## Troubleshooting

| Sintoma | Causa / correção |
|---|---|
| `ERRO: nome do módulo (namespace) não informado` | Faltou `--name`. Passe `--name <slug>`. |
| `ERRO: nome inválido: "..."` | Nome não é kebab-case. Use `a-z0-9` e `-`. |
| `ERRO: modules/<nome> já existe` | Rode com `--force` para sobrescrever os arquivos do módulo. |
| `ERRO: apps/backend/src/modules/<nome> já existe` | Rode com `--force` para sobrescrever os arquivos do módulo NestJS (o registro no `AppModule` não é duplicado). |
| `ERRO: apps/frontend/src/... já existe` | Rode com `--force` para sobrescrever a rota/página/componente do módulo frontend. |
| Não quero o módulo NestJS, só o de negócio | Passe `--skip-backend-module`. |
| Não quero o módulo frontend | Passe `--skip-frontend-module`. |
| Quero a rota fora de `(private)` | Passe `--route-group <g>` (ex.: `--route-group "(public)"`). |
| `spawnSync npm.cmd EINVAL` | Está usando uma cópia antiga do driver sem `shell: IS_WIN`. Atualize. |
| Build do `frontend`/`backend` falha por motivo não relacionado | Rode `--skip-build` e depois investigue o app isolado; o módulo em si compila com `npm run build --workspace @<escopo>/<nome>`. |
