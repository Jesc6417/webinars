import {
  AuthenticateUser,
  UserRepository,
  ValidateUserToken,
} from '@/domain/users';
import { RepositoriesModule } from './repositories.module';
import { Module } from '@nestjs/common';

@Module({
  imports: [RepositoriesModule],
  providers: [
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
  exports: [AuthenticateUser, ValidateUserToken],
})
export class UserProxyModule {}
