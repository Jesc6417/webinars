import { WebinarController, UserController } from '@/application/controllers';
import { AuthenticationGuard } from '@/application/guards';
import { UsecasesProxyModule } from '@/infrastructure/modules';
import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [UsecasesProxyModule.register()],
  controllers: [WebinarController, UserController],
  providers: [],
})
export class AppModule {}
