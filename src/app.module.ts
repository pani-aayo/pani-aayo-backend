import { Module } from '@nestjs/common';
import { PipelineModule } from './app/modules/pipeline/pipeline.module';
import { UserModule } from './app/modules/user/user.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GlobalModule } from './shared/global.module';

@Module({
  imports: [GlobalModule, UserModule, PipelineModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
