import { WebinarController, UserController } from '@/application/controllers';
import { UsecasesProxyModule } from '@/infrastructure/modules';
import { Module } from '@nestjs/common';

@Module({
  imports: [UsecasesProxyModule.register()],
  controllers: [WebinarController, UserController],
  providers: [],
})
export class AppModule {}
