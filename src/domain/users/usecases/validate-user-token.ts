import { UserRepository } from '@/domain/users';

export class ValidateUserToken {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(token: string) {
    const isValid = await this.userRepository.authenticate(token);

    if (!isValid) throw new Error('Invalid token.');

    return this.userRepository.authenticate(token);
  }
}
