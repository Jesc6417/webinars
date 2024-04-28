import { ValidationPipe } from '@/application/pipes/validation.pipe';
import { AuthenticateUser } from '@/domain/users';
import { UserApi } from '@/domain/users/ports';
import { Body, Controller, HttpCode, Post } from '@nestjs/common';

@Controller('/users')
export class UserController {
  constructor(private readonly authenticateUser: AuthenticateUser) {}

  @Post('/authenticate')
  @HttpCode(200)
  handleAuthenticateUser(
    @Body(new ValidationPipe(UserApi.AuthenticateUser.schema))
    data: UserApi.AuthenticateUser.Request,
  ): Promise<UserApi.AuthenticateUser.Response> {
    return this.authenticateUser.execute(data);
  }
}
