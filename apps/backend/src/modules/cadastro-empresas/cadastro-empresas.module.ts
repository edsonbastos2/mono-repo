import { Module } from '@nestjs/common';

import { CadastroEmpresasController } from './cadastro-empresas.controller.js';

@Module({
  controllers: [CadastroEmpresasController],
})
export class CadastroEmpresasModule {}
