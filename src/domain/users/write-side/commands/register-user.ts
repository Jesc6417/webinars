import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';
import { IdProvider } from './../../../core';
import { UserBuilder } from './../entities/user.builder';
import { UserRepository } from './../ports';

export class RegisterUserCommand implements ICommand {
  constructor(
    public readonly email: string,
    public readonly password: string,
  ) {}
}

type Response = { id: string };

@CommandHandler(RegisterUserCommand)
export class RegisterUser
  implements ICommandHandler<RegisterUserCommand, Response>
{
  constructor(
    private readonly userRepository: UserRepository,
    private readonly idProvider: IdProvider,
  ) {}

  async execute({ email, password }: RegisterUserCommand) {
    const access_token = Buffer.from(`${email}:${password}`).toString('base64');
    const id = this.idProvider.generate();
    const user = new UserBuilder()
      .withId(id)
      .withEmail(email)
      .withToken(access_token)
      .build();

    await this.userRepository.create(user);

    return { id };
  }
}
