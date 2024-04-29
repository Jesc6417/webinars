import { UserRepository } from '@/domain/users';

export class ValidateUserToken {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(token: string) {
    const user = await this.userRepository.validate(token);

    if (!user) throw new Error('Invalid token.');

    return user;
  }
}
