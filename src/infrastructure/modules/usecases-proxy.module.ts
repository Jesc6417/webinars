import { DateGenerator, IdGenerator } from '@/domain/core';
import {
  AuthenticateUser,
  InMemoryUserRepository,
  UserRepository,
  ValidateUserToken,
} from '@/domain/users';
import {
  InMemoryWebinarRepository,
  OrganizeWebinar,
  WebinarRepository,
} from '@/domain/webinars';
import { Module } from '@nestjs/common';
import { CurrentDateGenerator, UuidGenerator } from './../generators';

@Module({
  imports: [],
})
export class UsecasesProxyModule {
  static register() {
    return {
      module: UsecasesProxyModule,
      providers: [
        {
          provide: WebinarRepository,
          useClass: InMemoryWebinarRepository,
        },
        {
          provide: IdGenerator,
          useClass: UuidGenerator,
        },
        {
          provide: DateGenerator,
          useClass: CurrentDateGenerator,
        },
        {
          provide: OrganizeWebinar,
          useFactory: (
            webinarRepository: WebinarRepository,
            idGenerator: IdGenerator,
            dateGenerator: DateGenerator,
          ) =>
            new OrganizeWebinar(webinarRepository, idGenerator, dateGenerator),
          inject: [WebinarRepository, IdGenerator, DateGenerator],
        },
        {
          provide: UserRepository,
          useClass: InMemoryUserRepository,
        },
        {
          provide: AuthenticateUser,
          useFactory: (authenticatorRepository: UserRepository) =>
            new AuthenticateUser(authenticatorRepository),
          inject: [UserRepository],
        },
        {
          provide: ValidateUserToken,
          useFactory: (authenticatorRepository: UserRepository) =>
            new ValidateUserToken(authenticatorRepository),
          inject: [UserRepository],
        },
      ],
      exports: [OrganizeWebinar, AuthenticateUser, ValidateUserToken],
    };
  }
}
