import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';
import { User } from '../entities';
import { UserRepository } from '../ports';
import { InvalidTokenException } from './../exceptions';

export class ValidateUserTokenCommand implements ICommand {
  constructor(public readonly token: string) {}
}

type Response = User;

@CommandHandler(ValidateUserTokenCommand)
export class ValidateUserToken
  implements ICommandHandler<ValidateUserTokenCommand, Response>
{
  constructor(private readonly userRepository: UserRepository) {}

  async execute(command: ValidateUserTokenCommand) {
    const user = await this.userRepository.validate(command.token);

    if (!user) throw new InvalidTokenException();

    return user;
  }
}
