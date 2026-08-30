import type { Config } from 'jest'

/**
 * Configuração de testes do módulo.
 *
 * Carregada pelo Jest via ts-node (por isso `ts-node` precisa existir no
 * package.json da raiz do monorepo). A transformação usa ts-jest com um
 * override de `module`/`moduleResolution` para CommonJS, já que o tsconfig
 * base do monorepo usa NodeNext (ESM) e o Jest roda em CJS.
 * (`isolatedModules: true` já vem herdado do tsconfig base.)
 */
const config: Config = {
  testEnvironment: 'node',
  roots: ['<rootDir>/src', '<rootDir>/test'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'json'],
  testMatch: ['**/*.test.ts'],
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        tsconfig: {
          module: 'CommonJS',
          moduleResolution: 'Node',
          verbatimModuleSyntax: false,
        },
      },
    ],
  },
}

export default config
