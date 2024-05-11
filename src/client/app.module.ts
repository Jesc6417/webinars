import {
  ParticipationController,
  UserController,
  WebinarCommandController,
  WebinarQueryController,
} from '@/application/controllers';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CqrsModule } from '@nestjs/cqrs';
import { MongooseModule } from '@nestjs/mongoose';
import { UserProxyModule } from './modules/user-proxy.module';
import { WebinarCommandModule } from './modules/webinar-command.module';
import { CacheModule } from '@nestjs/cache-manager';
import { WebinarQueryModule } from './modules/webinar-query.module';

@Module({
  imports: [
    WebinarCommandModule,
    WebinarQueryModule,
    UserProxyModule,
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get('MONGODB_URI'),
      }),
    }),
    CacheModule.register({
      isGlobal: true,
    }),
    CqrsModule,
  ],
  exports: [UserProxyModule, WebinarCommandModule],
  controllers: [
    WebinarCommandController,
    WebinarQueryController,
    UserController,
    ParticipationController,
  ],
  providers: [],
})
export class AppModule {}
