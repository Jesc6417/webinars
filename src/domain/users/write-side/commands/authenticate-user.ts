import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';
import { UserNotFoundException } from './../exceptions';
import { UserRepository } from './../ports';

export class AuthenticateUserCommand implements ICommand {
  constructor(
    public readonly email: string,
    public readonly password: string,
  ) {}
}
type Response = { access_token: string };

@CommandHandler(AuthenticateUserCommand)
export class AuthenticateUser
  implements ICommandHandler<AuthenticateUserCommand, Response>
{
  constructor(private readonly userRepository: UserRepository) {}

  async execute({ email, password }: AuthenticateUserCommand) {
    const access_token = Buffer.from(`${email}:${password}`).toString('base64');
    const result = await this.userRepository.authenticate(access_token);

    if (!result) throw new UserNotFoundException();

    return { access_token };
  }
}
