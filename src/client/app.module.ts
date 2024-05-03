import {
  ParticipationController,
  UserController,
  WebinarController,
} from '@/application/controllers';
import { Module } from '@nestjs/common';
import { UserProxyModule } from './modules/user-proxy.module';
import { WebinarProxyModule } from './modules/webinar-proxy.module';

@Module({
  imports: [WebinarProxyModule, UserProxyModule],
  exports: [UserProxyModule, WebinarProxyModule],
  controllers: [WebinarController, UserController, ParticipationController],
  providers: [],
})
export class AppModule {}
