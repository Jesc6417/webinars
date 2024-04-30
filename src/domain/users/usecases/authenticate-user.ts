import { Executable } from './../../core';
import { UserRepository } from './../ports';

type Request = { email: string; password: string };
type Response = { access_token: string };

export class AuthenticateUser implements Executable<Request, Response> {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(request: Request) {
    const token = await this.userRepository.authenticate(request);

    if (!token) throw new Error('User not found.');

    return { access_token: token };
  }
}
