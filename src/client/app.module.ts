import { UserController, WebinarController } from '@/application/controllers';
import { Module } from '@nestjs/common';
import { UserProxyModule } from './modules/user-proxy.module';
import { WebinarProxyModule } from './modules/webinar-proxy.module';

@Module({
  imports: [WebinarProxyModule, UserProxyModule],
  exports: [UserProxyModule, WebinarProxyModule],
  controllers: [WebinarController, UserController],
  providers: [],
})
export class AppModule {}
