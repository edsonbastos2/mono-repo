import { Module } from '@nestjs/common';

import { ProdutosController } from './produtos.controller.js';

@Module({
  controllers: [ProdutosController],
})
export class ProdutosModule {}
