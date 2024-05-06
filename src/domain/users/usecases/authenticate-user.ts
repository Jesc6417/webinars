import { UserNotFoundException } from './../exceptions';
import { Executable } from './../../core';
import { UserRepository } from './../ports';

type Request = { email: string; password: string };
type Response = { access_token: string };

export class AuthenticateUser implements Executable<Request, Response> {
  constructor(private readonly userRepository: UserRepository) {}

  async execute({ email, password }: Request) {
    const access_token = Buffer.from(`${email}:${password}`).toString('base64');

    const result = await this.userRepository.authenticate(access_token);

    if (!result) throw new UserNotFoundException();

    return { access_token };
  }
}
