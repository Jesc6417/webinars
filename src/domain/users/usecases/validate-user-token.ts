import { Executable } from './../../core';
import { User, UserRepository } from './../../users';

export class ValidateUserToken implements Executable<string, User> {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(token: string) {
    const user = await this.userRepository.validate(token);

    if (!user) throw new Error('Invalid token.');

    return user;
  }
}
