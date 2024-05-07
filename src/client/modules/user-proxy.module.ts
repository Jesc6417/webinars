import { IdProvider } from '@/domain/core';
import {
  AuthenticateUser,
  RegisterUser,
  UserRepository,
  ValidateUserToken,
} from '@/domain/users';
import { Module } from '@nestjs/common';
import { ProvidersModule } from './providers.module';
import { RepositoriesModule } from './repositories.module';

@Module({
  imports: [RepositoriesModule, ProvidersModule],
  providers: [
    {
      provide: AuthenticateUser,
      useFactory: (userRepository: UserRepository) =>
        new AuthenticateUser(userRepository),
      inject: [UserRepository],
    },
    {
      provide: ValidateUserToken,
      useFactory: (userRepository: UserRepository) =>
        new ValidateUserToken(userRepository),
      inject: [UserRepository],
    },
    {
      provide: RegisterUser,
      useFactory: (userRepository: UserRepository, idProvider: IdProvider) =>
        new RegisterUser(userRepository, idProvider),
      inject: [UserRepository, IdProvider],
    },
  ],
  exports: [AuthenticateUser, ValidateUserToken, RegisterUser],
})
export class UserProxyModule {}
