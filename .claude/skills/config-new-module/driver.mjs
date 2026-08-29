#!/usr/bin/env node
// Gerador de módulo de negócio para o monorepo projeto-reforma-trib.
//
// Cria modules/<nome> a partir dos templates em assets/, registra o
// workspace, injeta a dependência nos apps e (opcionalmente) roda
// install + build + testes do módulo.
//
// Uso:
//   node .agents/skills/config-new-module/driver.mjs --name auth
//   node .agents/skills/config-new-module/driver.mjs --name billing --scope @meu-projeto
//
// Flags:
//   --name <slug>     (OBRIGATÓRIO) nome do módulo em kebab-case. Sem ele o
//                     script aborta sem tocar em nada.
//   --scope <@escopo> escopo npm do pacote. Padrão: @meu-projeto
//   --force           sobrescreve modules/<nome> se já existir
//   --skip-install    não roda `npm install`
//   --skip-build      não roda `npm run build`
//   --skip-test       não roda os testes do módulo
//   --dry-run         mostra o que faria, sem escrever nada

import { execFileSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const SKILL_DIR = __dirname
const ASSETS_DIR = path.join(SKILL_DIR, 'assets')
// .agents/skills/config-new-module/driver.mjs -> raiz do repo
const REPO_ROOT = path.resolve(SKILL_DIR, '..', '..', '..')

const IS_WIN = process.platform === 'win32'
const NPM = IS_WIN ? 'npm.cmd' : 'npm'

function parseArgs(argv) {
  const args = { scope: '@meu-projeto' }
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i]
    if (a === '--name') args.name = argv[++i]
    else if (a === '--scope') args.scope = argv[++i]
    else if (a === '--force') args.force = true
    else if (a === '--skip-install') args.skipInstall = true
    else if (a === '--skip-build') args.skipBuild = true
    else if (a === '--skip-test') args.skipTest = true
    else if (a === '--dry-run') args.dryRun = true
    else {
      console.error(`Argumento desconhecido: ${a}`)
      process.exit(2)
    }
  }
  return args
}

function fail(msg) {
  console.error(`\n[config-new-module] ERRO: ${msg}\n`)
  process.exit(1)
}

function log(msg) {
  console.log(`[config-new-module] ${msg}`)
}

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, 'utf8'))
}

function writeJson(file, obj, dryRun) {
  const text = JSON.stringify(obj, null, 2) + '\n'
  if (dryRun) {
    log(`(dry-run) escreveria ${path.relative(REPO_ROOT, file)}`)
    return
  }
  fs.writeFileSync(file, text)
}

function applyPlaceholders(text, map) {
  let out = text
  for (const [k, v] of Object.entries(map)) {
    out = out.split(k).join(v)
  }
  return out
}

function copyTemplateTree(srcDir, destDir, map, dryRun) {
  for (const entry of fs.readdirSync(srcDir, { withFileTypes: true })) {
    const src = path.join(srcDir, entry.name)
    if (entry.isDirectory()) {
      const destSub = path.join(destDir, entry.name)
      if (!dryRun) fs.mkdirSync(destSub, { recursive: true })
      copyTemplateTree(src, destSub, map, dryRun)
    } else {
      // Templates são gravados como *.tmpl para o editor não type-checá-los
      // como código-fonte; o sufixo é removido ao gerar o módulo.
      const outName = entry.name.endsWith('.tmpl')
        ? entry.name.slice(0, -'.tmpl'.length)
        : entry.name
      const dest = path.join(destDir, outName)
      const rendered = applyPlaceholders(fs.readFileSync(src, 'utf8'), map)
      if (dryRun) {
        log(`(dry-run) criaria ${path.relative(REPO_ROOT, dest)}`)
      } else {
        fs.mkdirSync(path.dirname(dest), { recursive: true })
        fs.writeFileSync(dest, rendered)
      }
    }
  }
}

function run(cmd, cmdArgs) {
  log(`$ ${cmd} ${cmdArgs.join(' ')}`)
  // No Windows, npm é um .cmd e o Node >=20 exige shell:true para spawná-lo.
  execFileSync(cmd, cmdArgs, { cwd: REPO_ROOT, stdio: 'inherit', shell: IS_WIN })
}

function main() {
  const args = parseArgs(process.argv.slice(2))

  // "Não executar essa skill se o namespace não for informado"
  if (!args.name || !args.name.trim()) {
    fail('nome do módulo (namespace) não informado. Use --name <slug>.')
  }
  const name = args.name.trim()
  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(name)) {
    fail(`nome inválido: "${name}". Use kebab-case: letras minúsculas, números e hífen.`)
  }
  const scope = args.scope.startsWith('@') ? args.scope : `@${args.scope}`
  const packageName = `${scope}/${name}`

  log(`raiz do repo: ${REPO_ROOT}`)
  log(`módulo:       modules/${name}`)
  log(`pacote:       ${packageName}`)

  // 1. modules/ e modules/<nome>
  const modulesDir = path.join(REPO_ROOT, 'modules')
  const moduleDir = path.join(modulesDir, name)
  if (fs.existsSync(moduleDir) && !args.force) {
    fail(`modules/${name} já existe. Use --force para sobrescrever.`)
  }
  if (!args.dryRun) fs.mkdirSync(moduleDir, { recursive: true })

  // 2. Copiar templates com placeholders resolvidos
  copyTemplateTree(ASSETS_DIR, moduleDir, {
    __PACKAGE_NAME__: packageName,
    __MODULE_NAME__: name,
  }, args.dryRun)
  log('templates copiados (jest.config.ts, tsconfig.json, tsconfig.build.json, package.json, src/index.ts, test/index.test.ts)')

  // 3. Raiz: workspaces + ts-node
  const rootPkgPath = path.join(REPO_ROOT, 'package.json')
  const rootPkg = readJson(rootPkgPath)
  rootPkg.workspaces ||= []
  if (!rootPkg.workspaces.includes('modules/*')) {
    // insere logo após "apps/*" se existir, senão no fim
    const idx = rootPkg.workspaces.indexOf('apps/*')
    if (idx >= 0) rootPkg.workspaces.splice(idx + 1, 0, 'modules/*')
    else rootPkg.workspaces.push('modules/*')
    log('adicionado "modules/*" em workspaces (raiz)')
  } else {
    log('"modules/*" já presente em workspaces (raiz)')
  }
  rootPkg.devDependencies ||= {}
  if (!rootPkg.devDependencies['ts-node']) {
    rootPkg.devDependencies['ts-node'] = '^10.9.2'
    rootPkg.devDependencies = sortKeys(rootPkg.devDependencies)
    log('adicionado ts-node ^10.9.2 em devDependencies (raiz)')
  } else {
    log(`ts-node já presente na raiz (${rootPkg.devDependencies['ts-node']})`)
  }
  writeJson(rootPkgPath, rootPkg, args.dryRun)

  // 4. apps/backend e apps/frontend: dependência do módulo
  for (const app of ['backend', 'frontend']) {
    const appPkgPath = path.join(REPO_ROOT, 'apps', app, 'package.json')
    if (!fs.existsSync(appPkgPath)) {
      log(`apps/${app}/package.json não encontrado — pulando`)
      continue
    }
    const appPkg = readJson(appPkgPath)
    appPkg.dependencies ||= {}
    if (appPkg.dependencies[packageName]) {
      log(`apps/${app}: ${packageName} já está em dependencies`)
      continue
    }
    appPkg.dependencies[packageName] = '*'
    appPkg.dependencies = sortKeys(appPkg.dependencies)
    writeJson(appPkgPath, appPkg, args.dryRun)
    log(`apps/${app}: adicionado "${packageName}": "*" em dependencies`)
  }

  if (args.dryRun) {
    log('dry-run concluído — nenhum comando executado.')
    return
  }

  // 5. install / build / test
  if (!args.skipInstall) run(NPM, ['install'])
  else log('npm install pulado (--skip-install)')

  if (!args.skipBuild) run(NPM, ['run', 'build'])
  else log('npm run build pulado (--skip-build)')

  if (!args.skipTest) run(NPM, ['test', '--workspace', packageName])
  else log('testes pulados (--skip-test)')

  log(`OK — módulo ${packageName} criado em modules/${name}`)
}

function sortKeys(obj) {
  return Object.fromEntries(Object.entries(obj).sort(([a], [b]) => a.localeCompare(b)))
}

main()
