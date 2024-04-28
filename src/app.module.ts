import { WebinarController, UserController } from '@/application/controllers';
import { UsecasesProxyModule } from '@/infrastructure/modules';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [UsecasesProxyModule.register()],
  controllers: [AppController, WebinarController, UserController],
  providers: [AppService],
})
export class AppModule {}
