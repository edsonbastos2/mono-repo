import { Controller, Get } from '@nestjs/common';

@Controller('cadastro-empresas')
export class CadastroEmpresasController {
  @Get()
  getRoot(): { message: string } {
    return { message: 'Módulo cadastro-empresas disponível.' };
  }
}
