import { UserProxyModule } from './modules/user-proxy.module';
import { WebinarProxyModule } from './modules/webinar-proxy.module';
import { Module } from '@nestjs/common';

@Module({
  imports: [WebinarProxyModule, UserProxyModule],
  exports: [UserProxyModule, WebinarProxyModule],
})
export class UsecasesProxyModule {}
