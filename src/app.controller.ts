import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { Public } from './shared/auth/decorators/public.decorator';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Public()
  @Get()
  getHello(): Promise<string> {
    return this.appService.getHello();
  }
}
