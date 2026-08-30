import { Controller, Get } from '@nestjs/common';

@Controller('produtos')
export class ProdutosController {
  @Get()
  getRoot(): { message: string } {
    return { message: 'Módulo produtos disponível.' };
  }
}
