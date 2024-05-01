import { DateProvider, IdGenerator } from '@/domain/core';
import {
  AuthenticateUser,
  InMemoryUserRepository,
  UserRepository,
  ValidateUserToken,
} from '@/domain/users';
import {
  ChangeSeats,
  InMemoryWebinarRepository,
  OrganizeWebinar,
  WebinarRepository,
} from '@/domain/webinars';
import { Module } from '@nestjs/common';
import { CurrentDateProvider, UuidProvider } from '../providers';

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
          useClass: UuidProvider,
        },
        {
          provide: DateProvider,
          useClass: CurrentDateProvider,
        },
        {
          provide: OrganizeWebinar,
          useFactory: (
            webinarRepository: WebinarRepository,
            idGenerator: IdGenerator,
            dateGenerator: DateProvider,
          ) =>
            new OrganizeWebinar(webinarRepository, idGenerator, dateGenerator),
          inject: [WebinarRepository, IdGenerator, DateProvider],
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
        {
          provide: ChangeSeats,
          useFactory: (webinarRepository: WebinarRepository) =>
            new ChangeSeats(webinarRepository),
          inject: [WebinarRepository],
        },
      ],
      exports: [
        OrganizeWebinar,
        AuthenticateUser,
        ValidateUserToken,
        ChangeSeats,
      ],
    };
  }
}
