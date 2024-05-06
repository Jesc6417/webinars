import {
  ParticipationController,
  UserController,
  WebinarController,
} from '@/application/controllers';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UserProxyModule } from './modules/user-proxy.module';
import { WebinarProxyModule } from './modules/webinar-proxy.module';

@Module({
  imports: [
    WebinarProxyModule,
    UserProxyModule,
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get('MONGODB_URI'),
      }),
    }),
  ],
  exports: [UserProxyModule, WebinarProxyModule],
  controllers: [WebinarController, UserController, ParticipationController],
  providers: [],
})
export class AppModule {}
