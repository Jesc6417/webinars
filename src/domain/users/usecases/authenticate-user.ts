import { UserRepository } from './../ports';

export class AuthenticateUser {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(payload: { email: string; password: string }) {
    const token = await this.userRepository.authenticate(payload);

    if (!token) throw new Error('User not found.');

    return { access_token: token };
  }
}
