import { UserController, WebinarController } from '@/application/controllers';
import { UsecasesProxyModule } from '@/infrastructure/usecases-proxy.module';
import { Module } from '@nestjs/common';

@Module({
  imports: [UsecasesProxyModule],
  controllers: [WebinarController, UserController],
  providers: [],
})
export class AppModule {}
