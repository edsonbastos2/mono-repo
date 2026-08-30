import { Controller, Get } from '@nestjs/common';

@Controller('auth')
export class AuthController {
  @Get()
  getRoot(): { message: string } {
    return { message: 'Módulo auth disponível.' };
  }
}
