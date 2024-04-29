import { ValidationPipe } from '@/application/pipes/validation.pipe';
import { AuthenticateUser } from '@/domain/users';
import { UserApi } from '@/domain/users/ports';
import { Body, Controller, HttpCode, Post } from '@nestjs/common';

@Controller('/users')
export class UserController {
  constructor(private readonly authenticateUser: AuthenticateUser) {}

  @Post('/authenticate')
  @HttpCode(200)
  async handleAuthenticateUser(
    @Body(new ValidationPipe(UserApi.AuthenticateUser.schema))
    data: UserApi.AuthenticateUser.Request,
  ): Promise<UserApi.AuthenticateUser.Response> {
    const result = await this.authenticateUser.execute(data);

    return result;
  }
}
