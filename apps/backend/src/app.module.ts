import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { ConfigModule } from '@nestjs/config';
import { CadastroEmpresasModule } from './modules/cadastro-empresas/cadastro-empresas.module.js';
import { AuthModule } from './modules/auth/auth.module.js';
import { ProdutosModule } from './modules/produtos/produtos.module.js';

@Module({
  imports: [
		ProdutosModule,
		CadastroEmpresasModule,
		AuthModule,
		ConfigModule.forRoot({
			isGlobal: true,
		}),
	],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
